import {
  ApolloQueryResult,
  gql,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { shouldRefetchQuestionsVar } from "../src/utils/questions.utils";
import Layout from "../components/auth/Layout";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import ContentSection from "../components/ContentSection";
import QuestionMasonry from "../components/questions/QuestionMasonry";
import {
  showQuestions,
  showQuestions_showQuestions,
} from "../src/__generated__/showQuestions";
import { loadContentFinishVar } from "../src/utils/utils";
import { NextSeo } from "next-seo";
import { apolloClient } from "../src/apolloClient";
import { loginUserVar } from "../src/utils/auth.utils";

const SHOW_QUESTIONS_QUERY = gql`
  query showQuestions($lastId: Int) {
    showQuestions(lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

interface Ihome {
  data: showQuestions_showQuestions[] | null;
}

export default function Home({ data }: Ihome) {
  const loginUser = useReactiveVar(loginUserVar);
  const [isCSR, setIsCSR] = useState(false);
  const [questions, setQuestions] = useState(data);
  const shouldRefetch = useReactiveVar(shouldRefetchQuestionsVar);
  const loader = useRef(null);
  const {
    data: questionsData,
    fetchMore,
    refetch,
  } = useQuery<showQuestions>(SHOW_QUESTIONS_QUERY, {
    onCompleted: () => {
      loadContentFinishVar(false);
    },
  });

  // SSR -> CSR 전환
  useEffect(() => {
    if (questionsData?.showQuestions) {
      setQuestions(questionsData?.showQuestions);
      setIsCSR(true);
    }
  }, [questionsData, loginUser]);

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
      if (loadFinish || !isCSR) {
        return;
      }
      const target = entries[0];
      if (questions && target.isIntersecting) {
        const lastId = questions[questions.length - 1]?.id;
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
    [data, fetchMore, isCSR]
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
            className="w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8"
          >
            <h2 id="questions-heading" className="sr-only">
              질문들
            </h2>
            <div className={`${isCSR ? "" : "opacity-0"}`}>
              {questions && questions?.length > 0 ? (
                <QuestionMasonry questions={questions} />
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

Home.getInitialProps = async () => {
  const {
    data: { showQuestions },
  } = await apolloClient.query<showQuestions>({
    query: SHOW_QUESTIONS_QUERY,
  });
  return { data: showQuestions };
};
