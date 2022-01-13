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
import {
  showQuestion,
  showQuestion_showQuestion,
} from "../../src/__generated__/showQuestion";
import QuestionReportModal from "../../components/questions/QuestionReportModal";
import { cardShadow } from "../../src/utils/utils";
import { NextSeo } from "next-seo";

export const SHOW_QUESTION_QUERY = gql`
  query showQuestion($id: Int!) {
    showQuestion(id: $id) {
      ...ShowQuestionFragment
    }
  }
  ${SHOW_QUESTION_FRAGMENT}
`;

interface IshowQuestionServer {
  data: showQuestion_showQuestion;
}

export default function ShowQuestion({ data }: IshowQuestionServer) {
  const { data: userData } = useUser();
  const router = useRouter();
  const cardRef = useRef<any>();
  const [cardTop, setCardTop] = useState(0);
  const [question, setQuestion] = useState(data);
  const [reportOpen, setReportOpen] = useState(false);
  const id = parseInt(router.query.id as string);
  const { data: questionData, refetch } = useQuery<showQuestion>(
    SHOW_QUESTION_QUERY,
    {
      variables: {
        id,
      },
    }
  );

  // SSR -> CSR 전환
  useEffect(() => {
    refetch();
    if (questionData?.showQuestion) {
      setQuestion(questionData?.showQuestion);
    }
  }, [questionData, refetch]);

  useEffect(() => {
    if (cardRef?.current?.offsetTop) {
      setCardTop(cardRef?.current?.offsetTop);
    }
  }, [cardRef]);

  return (
    <>
      <NextSeo
        title={`${
          questionData?.showQuestion
            ? questionData.showQuestion.content
            : data.content
        }`}
        openGraph={{
          type: "page",
          title: `${
            questionData?.showQuestion
              ? questionData.showQuestion.content
              : data.content
          }`,
          description: `${
            questionData?.showQuestion
              ? questionData.showQuestion.content
              : data.content
          }`,
          images: [
            {
              url: questionData?.showQuestion
                ? questionData.showQuestion.image.Location
                : data.image.Location,
            },
          ],
        }}
      />
      <Layout>
        <ContentSection>
          {!question ? null : (
            <>
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
                    style={{ boxShadow: cardShadow }}
                    ref={cardRef}
                  >
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8">
                      <div className="flex justify-between sm:hidden">
                        <QuestionInfo question={question} />
                        {userData && (
                          <div className="relative z-10 shrink-0">
                            <QuestionDropdown
                              question={question}
                              setReportOpen={setReportOpen}
                            />
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
                            <QuestionImageZoom
                              image={question?.image.Location}
                            />
                          </div>
                        ) : (
                          <NoImage className={"rounded-3xl"} />
                        )}
                      </div>
                      <div className="justify-between hidden sm:flex">
                        <QuestionInfo question={question} />
                        {userData && (
                          <div className="shrink-0">
                            <QuestionDropdown
                              question={question}
                              setReportOpen={setReportOpen}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Pick question={question} />
                      </div>
                    </div>
                    <div className="mt-12">
                      <div className="px-1 mb-6 font-semibold">
                        <span>댓글 {question.totalComments}</span>
                      </div>
                      <QuestionCommentList question={question} />
                    </div>
                  </div>
                </div>
              </div>

              {userData && (
                <QuestionReportModal
                  question={question}
                  reportOpen={reportOpen}
                  setReportOpen={setReportOpen}
                />
              )}
            </>
          )}
        </ContentSection>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const {
    data: { showQuestion },
  } = await apolloClient.query<showQuestion>({
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
