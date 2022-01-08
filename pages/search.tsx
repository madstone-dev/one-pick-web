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
import { headerHeightVar, loginUserVar } from "../src/utils/auth.utils";
import QuestionDropdown from "../components/questions/QuestionDropdown";
import { SearchIcon } from "@heroicons/react/outline";
import ContentSection from "../components/ContentSection";

const SHOW_QUESTIONS_QUERY = gql`
  query showQuestions($take: Int, $lastId: Int) {
    showQuestions(take: $take, lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Search() {
  const focusedQuestion = useReactiveVar(focusedQuestionVar);
  const loginUser = loginUserVar();
  const loader = useRef(null);
  const [take, setTake] = useState(20);
  const [scrollHeight, setScrollHeight] = useState(0);
  const { data, loading, fetchMore, refetch } = useQuery(SHOW_QUESTIONS_QUERY, {
    variables: {
      take,
    },
    skip: true,
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

  const trackScroll = () => {
    setScrollHeight(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", trackScroll);
    setScrollHeight(window.scrollY);
    return () => {
      window.removeEventListener("scroll", trackScroll);
    };
  }, []);

  return (
    <Layout>
      <ContentSection>
        <section
          aria-labelledby="products-heading"
          className={`pb-4 sm:pb-6 lg:pb-8 w-full ${loading && "contents"}`}
        >
          <h2 id="products-heading" className="sr-only">
            검색
          </h2>
          {loading && (
            <div className="flex items-center justify-center flex-1">
              <HashLoader color="#777777" loading={true} size={60} />
            </div>
          )}
          <div className={`${loading && "hidden"}`}>
            <div
              className={`sticky z-30 w-full bg-white ${
                scrollHeight === 0 ? "" : "shadow-sm"
              }`}
              style={{
                top: `${headerHeightVar()}px`,
              }}
            >
              <div className="flex-1 min-w-0 py-4 mx-auto md:max-w-3xl md:px-8 lg:px-0">
                <div className="flex items-center px-4 lg:mx-0 xl:px-0 sm:px-6 lg:px-8">
                  <div className="w-full">
                    <label htmlFor="search" className="sr-only">
                      검색
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none sm:left-2">
                        <SearchIcon
                          className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-gray-200 border border-gray-100 rounded-full sm:py-3 sm:text-base sm:pl-14 focus:bg-gray-50 hover:bg-gray-200 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                        placeholder="검색"
                        type="search"
                        autoFocus
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {data?.showQuestions?.length > 0 ? (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="px-4 my-masonry-grid sm:px-6 lg:px-8"
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
                                } p-3`}
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
                <span className="block">검색 결과가 없습니다</span>
              </div>
            )}
          </div>
          <div ref={loader} />
        </section>
      </ContentSection>
    </Layout>
  );
}
