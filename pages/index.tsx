import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import {
  focusedQuestionVar,
  isQuestionLoadFinishVar,
  shouldRefetchQuestionsVar,
} from "../src/utils/questions.utils";
import Link from "next/link";
import NoImage from "../components/NoImage";
import Layout from "../components/auth/Layout";
import { HashLoader } from "react-spinners";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import LinesEllipsis from "react-lines-ellipsis";
import QuestionBlockButton from "../components/questions/QuestionBlockButton";
import QuestionReportModal from "../components/questions/QuestionReportModal";
import { loginUserVar } from "../src/utils/auth.utils";
import QuestionDropdown from "../components/questions/QuestionDropdown";

const SHOW_QUESTIONS_QUERY = gql`
  query showQuestions($take: Int, $lastId: Int) {
    showQuestions(take: $take, lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Home() {
  const focusedQuestion = useReactiveVar(focusedQuestionVar);
  const loginUser = loginUserVar();
  const loader = useRef(null);
  const [take, setTake] = useState(20);
  const { data, loading, fetchMore, refetch } = useQuery(SHOW_QUESTIONS_QUERY, {
    variables: {
      take,
    },
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

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    280: 1,
  };

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
            take,
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
      <section
        aria-labelledby="products-heading"
        className={`py-4 sm:py-6 lg:py-8 w-full ${loading && "contents"}`}
      >
        <h2 id="products-heading" className="sr-only">
          질문들
        </h2>
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <HashLoader color="#777777" loading={true} size={60} />
          </div>
        )}
        <div className={`${loading && "hidden"}`}>
          {data?.showQuestions?.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {data?.showQuestions?.map((question: any) => (
                <div key={question.id} className="mb-3">
                  {question.isBlocked ? (
                    <>
                      <div className="relative w-full shadow-md rounded-2xl aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3 group">
                        {loginUser && (
                          <div className="absolute bottom-0 right-0 z-10 flex">
                            <div
                              className={`${
                                focusedQuestion === question.id
                                  ? "opacity-100"
                                  : "sm:opacity-0 group-hover:opacity-100"
                              } p-3 bg-white`}
                            >
                              <QuestionDropdown question={question} />
                            </div>
                          </div>
                        )}
                        {question.image?.Location ? (
                          <img
                            src={question.image?.Location}
                            alt={question.content}
                            className="object-cover object-center w-full h-full blur-md"
                          />
                        ) : (
                          <NoImage
                            title={question.content}
                            className="blur-md"
                          />
                        )}
                      </div>
                      <div className="py-3 text-sm italic font-medium text-gray-600">
                        사용자에 의해 숨겨진 콘텐츠입니다
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative w-full shadow-md rounded-2xl aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3 group">
                        {loginUser && (
                          <div className="absolute z-10 flex bottom-3 right-3">
                            <div
                              className={`${
                                focusedQuestion === question.id
                                  ? "opacity-100"
                                  : "sm:opacity-0 group-hover:opacity-100"
                              } bg-opacity-10 sm:bg-gray-100 rounded-full`}
                            >
                              <QuestionDropdown question={question} />
                            </div>
                          </div>
                        )}

                        <Link
                          href="/questions/[id]"
                          as={`/questions/${question.id}`}
                        >
                          <a>
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-0 rounded-2xl group-hover:bg-opacity-50"></div>
                            {question.image?.Location ? (
                              <img
                                src={question.image?.Location}
                                alt={question.content}
                                className="object-cover object-center w-full h-full rounded-2xl"
                              />
                            ) : (
                              <NoImage
                                title={question.content}
                                className="rounded-2xl"
                              />
                            )}
                          </a>
                        </Link>
                      </div>
                      <Link
                        href="/questions/[id]"
                        as={`/questions/${question.id}`}
                      >
                        <a>
                          <div className="py-3 text-sm font-medium text-gray-900">
                            <LinesEllipsis
                              text={question.content}
                              maxLine="1"
                              ellipsis="..."
                            />
                          </div>
                        </a>
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </Masonry>
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
    </Layout>
  );
}
