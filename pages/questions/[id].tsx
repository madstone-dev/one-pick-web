import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/auth/Layout";
import NoImage from "../../components/NoImage";
import QuestionInfo from "../../components/questions/QuestionInfo";
import Pick from "../../components/questions/Pick";
import { apolloClient } from "../../src/apolloClient";
import { SHOW_QUESTION_FRAGMENT } from "../../src/fragments";
import QuestionCommentList from "../../components/questions/QuestionCommentList";
import QuestionActions from "../../components/questions/QeustionActions";

const SHOW_QUESTION_QUERY = gql`
  query ShowQuestion($id: Int!) {
    showQuestion(id: $id) {
      ...ShowQuestionFragment
    }
  }
  ${SHOW_QUESTION_FRAGMENT}
`;

export default function ShowQuestion({ data }: any) {
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

  return (
    <Layout>
      <div className="flex flex-col flex-1 py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-4xl mx-auto">
          {question && <QuestionActions question={question} />}
          <div className="w-full max-w-4xl p-4 mx-auto overflow-hidden bg-white border border-gray-100 rounded-md shadow-md sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8">
              <div className="block sm:hidden">
                {question && <QuestionInfo question={question} />}
              </div>
              <div className="overflow-hidden rounded-lg group aspect-w-2 aspect-h-1 sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
                {question?.image ? (
                  <div className="relative justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={question?.image.Location}
                      alt={`${question?.content}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <NoImage className={"md:h-96"} />
                )}
              </div>
              <div className="hidden sm:block">
                {question && <QuestionInfo question={question} />}
              </div>
              <div>{question && <Pick question={question} />}</div>
            </div>
            <div className="mt-14">
              {question && <QuestionCommentList question={question} />}
            </div>
          </div>
        </div>
      </div>
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
