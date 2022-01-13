import {
  ApolloQueryResult,
  gql,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { useCallback, useEffect, useRef } from "react";
import { shouldRefetchQuestionsVar } from "../src/utils/questions.utils";
import Layout from "../components/auth/Layout";
import { HashLoader } from "react-spinners";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import ContentSection from "../components/ContentSection";
import QuestionMasonry from "../components/questions/QuestionMasonry";
import { showQuestions } from "../src/__generated__/showQuestions";
import { loadContentFinishVar } from "../src/utils/utils";
import { NextSeo } from "next-seo";

const SHOW_QUESTIONS_QUERY = gql`
  query showQuestions($lastId: Int) {
    showQuestions(lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Home() {
  const shouldRefetch = useReactiveVar(shouldRefetchQuestionsVar);
  const loader = useRef(null);
  const { data, loading, fetchMore, refetch } = useQuery<showQuestions>(
    SHOW_QUESTIONS_QUERY,
    {
      onCompleted: () => {
        loadContentFinishVar(false);
      },
    }
  );

  // 필요한 경우 리패치
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      shouldRefetchQuestionsVar(false);
    }
  }, [shouldRefetch, refetch]);

  // 인피니티 스크롤 옵저버
  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = loadContentFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.showQuestions && target.isIntersecting) {
        const lastId = data?.showQuestions[data.showQuestions.length - 1]?.id;
        const more: ApolloQueryResult<showQuestions> = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.showQuestions?.length === 0) {
          loadContentFinishVar(true);
        }
      }
    },
    [data, fetchMore]
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
    <>
      <NextSeo title="홈" />
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
              {data?.showQuestions && data?.showQuestions?.length > 0 ? (
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
    </>
  );
}
