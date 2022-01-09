import { gql, useQuery } from "@apollo/client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { isQuestionLoadFinishVar } from "../src/utils/questions.utils";
import Layout from "../components/auth/Layout";
import { HashLoader } from "react-spinners";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import { headerHeightVar } from "../src/utils/auth.utils";
import { SearchIcon } from "@heroicons/react/outline";
import ContentSection from "../components/ContentSection";
import { Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import QuestionMasonry from "../components/questions/QuestionMasonry";

const SEARCH_QUESTION_HASHTAGS_QUERY = gql`
  query searchQuestionHashtags($keyword: String) {
    searchQuestionHashtags(keyword: $keyword) {
      hashtag
      totalQuestions
    }
  }
`;

const SEARCH_QUESTIONS_QUERY = gql`
  query searchQuestions(
    $keyword: String
    $isTag: Boolean
    $take: Int
    $lastId: Int
  ) {
    searchQuestions(
      keyword: $keyword
      isTag: $isTag
      take: $take
      lastId: $lastId
    ) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Search() {
  const loader = useRef(null);
  const [take, setTake] = useState(20);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);

  // search bar shadow
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

  // search hashtag
  const [keyword, setKeyword] = useState("");
  const [hashtags, setHashtags] = useState([]);

  const { data: hashtagData, fetchMore: hashtagFetchMore } = useQuery(
    SEARCH_QUESTION_HASHTAGS_QUERY
  );

  const onChangeInputValue = async () => {
    const more = await hashtagFetchMore({
      variables: {
        keyword,
      },
    });
    setHashtags(more.data?.searchQuestionHashtags);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeInputValue();
    }, 500);
    return () => clearTimeout(timeout);
  }, [keyword]);

  // search question
  const {
    data: questionsData,
    loading,
    fetchMore,
    refetch,
  } = useQuery(SEARCH_QUESTIONS_QUERY);

  const onSearch = async (isTag: any = false, keyword: string) => {
    (document.activeElement as HTMLElement).blur();
    isQuestionLoadFinishVar(false);
    setKeyword(keyword.trim());
    refetch({
      keyword: keyword.trim(),
      take,
      isTag,
    });
  };

  // infinity scroll
  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = isQuestionLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (questionsData?.searchQuestions && target.isIntersecting) {
        const lastId =
          questionsData?.searchQuestions[
            questionsData.searchQuestions.length - 1
          ]?.id;
        const more: any = await fetchMore({
          variables: {
            keyword,
            take,
            lastId,
          },
        });
        if (more?.data?.searchQuestions?.length === 0) {
          isQuestionLoadFinishVar(true);
        }
      }
    },
    [questionsData]
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
      <div
        className={`sticky z-30 w-full bg-white ${
          scrollHeight === 0 ? "" : "shadow-sm"
        }`}
        style={{
          top: `${headerHeightVar()}px`,
        }}
        onFocus={() => {
          setInputFocused(true);
        }}
        onBlur={() => {
          setInputFocused(false);
        }}
      >
        <div className="flex-1 py-4 mx-auto md:max-w-3xl md:px-8 lg:px-0">
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (keyword.trim()) {
                      onSearch(false, keyword);
                    }
                  }}
                >
                  <input
                    id="search"
                    name="keyword"
                    className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-gray-200 border border-gray-100 rounded-full sm:py-3 sm:text-base sm:pl-14 focus:bg-gray-50 hover:bg-gray-200 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                    placeholder="검색"
                    type="text"
                    autoComplete="off"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* hashtag livesearch */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={inputFocused}
        >
          <div className="border-t border-gray-100">
            <div className="absolute w-full h-screen bg-gray-600 bg-opacity-30"></div>
            <div className="absolute z-10 w-full px-2 transform -translate-x-1/2 left-1/2 sm:px-0 md:max-w-3xl">
              <div className="overflow-hidden rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 px-5 py-6 overflow-y-auto bg-white sm:gap-8 sm:p-8 max-h-96">
                  {hashtags.length > 0 ? (
                    hashtags.map((item: any, index: number) => (
                      <button
                        key={index}
                        className="block w-full p-3 text-left transition duration-150 ease-in-out rounded-md hover:bg-gray-50"
                        onClick={() => {
                          onSearch(true, item.hashtag);
                        }}
                      >
                        <p className="text-base font-medium text-gray-900">
                          {item.hashtag}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          게시물 {item.totalQuestions}
                        </p>
                      </button>
                    ))
                  ) : (
                    <button
                      className="block w-full p-3 text-left transition duration-150 ease-in-out rounded-md hover:bg-gray-50"
                      onClick={() => {
                        onSearch(false, keyword);
                      }}
                    >
                      {!keyword.trim()
                        ? "한 글자 이상 입력해주세요"
                        : `'${keyword}' 를 포함한 게시물을 찾습니다`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
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
            {questionsData?.searchQuestions?.length > 0 ? (
              <QuestionMasonry questions={questionsData?.searchQuestions} />
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
