import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/auth/Layout";
import NoImage from "../../components/NoImage";
import QuestionInfo from "../../components/questions/QuestionInfo";
import Pick from "../../components/questions/Pick";
import { apolloClient } from "../../src/apolloClient";
import { SHOW_QUESTION_FRAGMENT } from "../../src/fragments";
import QuestionCommentList from "../../components/questions/QuestionCommentList";
import QuestionDropdown from "../../components/questions/QuestionDropdown";
import QuestionImageZoom from "../../components/questions/QuestionImageZoom";
import NavBack from "../../components/NavBack";
import ContentSection from "../../components/ContentSection";
import useUser from "../../src/hooks/useUser";

export const SHOW_QUESTION_QUERY = gql`
  query showQuestion($id: Int!) {
    showQuestion(id: $id) {
      ...ShowQuestionFragment
    }
  }
  ${SHOW_QUESTION_FRAGMENT}
`;

export default function ShowQuestion({ data }: any) {
  const { data: userData, loading } = useUser();
  const cardRef = useRef<any>();
  const [cardTop, setCardTop] = useState(0);
  const router = useRouter();
  const [question, setQuestion] = useState(data);
  const id = parseInt(router.query.id as string);
  const { data: questionData, refetch } = useQuery(SHOW_QUESTION_QUERY, {
    variables: {
      id,
    },
  });

  // SSR -> CSR 전환
  useEffect(() => {
    refetch();
    setQuestion(questionData?.showQuestion);
  }, [questionData]);

  useEffect(() => {
    if (cardRef?.current?.offsetTop) {
      setCardTop(cardRef?.current?.offsetTop);
    }
  }, [cardRef]);

  return (
    <Layout>
      <ContentSection>
        {!question ? null : (
          <div className="flex flex-col flex-1 p-4 sm:p-6 lg:p-8">
            <div
              className="sticky"
              style={{
                top: cardTop,
              }}
            >
              <NavBack />
            </div>
            <div className="w-full max-w-4xl mx-auto">
              <div
                className="w-full max-w-4xl p-4 mx-auto bg-white border border-gray-100 sm:p-6 lg:p-8 rounded-3xl"
                style={{ boxShadow: "0 1px 20px 0 rgb(0 0 0 / 10%)" }}
                ref={cardRef}
              >
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8">
                  <div className="flex justify-between sm:hidden">
                    <QuestionInfo question={question} />
                    {userData && (
                      <div className="relative z-10 shrink-0">
                        <QuestionDropdown question={question} />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden group aspect-w-2 aspect-h-1 sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
                    {question.image ? (
                      <div className="relative justify-center overflow-hidden rounded-3xl bg-gray-50">
                        <img
                          src={question?.image.Location}
                          alt={`${question?.content}`}
                          className="object-contain w-full h-full"
                        />
                        <QuestionImageZoom image={question?.image.Location} />
                      </div>
                    ) : (
                      <NoImage className={"rounded-3xl"} />
                    )}
                  </div>
                  <div className="justify-between hidden sm:flex">
                    <QuestionInfo question={question} />
                    {userData && (
                      <div className="shrink-0">
                        <QuestionDropdown question={question} />
                      </div>
                    )}
                  </div>
                  <div>
                    <Pick question={question} />
                  </div>
                </div>
                <div className="mt-12">
                  <QuestionCommentList question={question} />
                </div>
              </div>
            </div>
          </div>
        )}
      </ContentSection>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const {
    data: { showQuestion },
  } = await apolloClient.query({
    query: SHOW_QUESTION_QUERY,
    variables: {
      id: parseInt(context.query.id),
    },
  });
  if (!showQuestion) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
  return {
    props: { data: showQuestion },
  };
}
