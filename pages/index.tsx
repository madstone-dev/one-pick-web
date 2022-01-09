import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  isQuestionLoadFinishVar,
  shouldRefetchQuestionsVar,
} from "../src/utils/questions.utils";
import Layout from "../components/auth/Layout";
import { HashLoader } from "react-spinners";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import ContentSection from "../components/ContentSection";
import QuestionMasonry from "../components/questions/QuestionMasonry";

const SHOW_QUESTIONS_QUERY = gql`
  query showQuestions($lastId: Int) {
    showQuestions(lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Home() {
  const loader = useRef(null);
  const { data, loading, fetchMore, refetch } = useQuery(SHOW_QUESTIONS_QUERY, {
    onCompleted: () => {
      isQuestionLoadFinishVar(false);
    },
  });

  useEffect(() => {
    const shouldRefetch = shouldRefetchQuestionsVar();
    if (shouldRefetch) {
      refetch();
      shouldRefetchQuestionsVar(false);
    }
  }, []);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = isQuestionLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.showQuestions && target.isIntersecting) {
        const lastId = data?.showQuestions[data.showQuestions.length - 1]?.id;
        const more: any = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.showQuestions?.length === 0) {
          isQuestionLoadFinishVar(true);
        }
      }
    },
    [data]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [handleObserver]);

  return (
    <Layout>
      <ContentSection>
        <section
          aria-labelledby="questions-heading"
          className={`py-4 sm:py-6 lg:py-8 w-full px-4 sm:px-6 lg:px-8 ${
            loading && "contents"
          }`}
        >
          <h2 id="questions-heading" className="sr-only">
            질문들
          </h2>
          {loading && (
            <div className="flex items-center justify-center flex-1">
              <HashLoader color="#777777" loading={true} size={60} />
            </div>
          )}
          <div className={`${loading && "hidden"}`}>
            {data?.showQuestions?.length > 0 ? (
              <QuestionMasonry questions={data.showQuestions} />
            ) : (
              <div
                className="absolute text-2xl font-bold text-center text-gray-600"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <span className="block">당신이 처음입니다</span>
                <span className="block">첫 게시물을 작성해보세요!</span>
              </div>
            )}
          </div>
          <div ref={loader} />
        </section>
      </ContentSection>
    </Layout>
  );
}
