import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../components/auth/Layout";
import { HashLoader } from "react-spinners";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import { headerHeightVar } from "../src/utils/auth.utils";
import { SearchIcon } from "@heroicons/react/outline";
import ContentSection from "../components/ContentSection";
import QuestionMasonry from "../components/questions/QuestionMasonry";
import { searchQuestions } from "../src/__generated__/searchQuestions";
import { searchQuestionHashtags } from "../src/__generated__/searchQuestionHashtags";
import { loadContentFinishVar } from "../src/utils/utils";
import { useRouter } from "next/router";
import HashtagList from "../components/search/HashtagList";

const SEARCH_QUESTION_HASHTAGS_QUERY = gql`
  query searchQuestionHashtags($keyword: String) {
    searchQuestionHashtags(keyword: $keyword) {
      hashtag
      totalQuestions
    }
  }
`;

const SEARCH_QUESTIONS_QUERY = gql`
  query searchQuestions($keyword: String, $type: String!, $lastId: Int) {
    searchQuestions(keyword: $keyword, type: $type, lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Search() {
  const router = useRouter();
  const loader = useRef(null);
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
  const { data: hashtagData, refetch: hashtagRefetch } =
    useQuery<searchQuestionHashtags>(SEARCH_QUESTION_HASHTAGS_QUERY);

  useEffect(() => {
    const timeout = setTimeout(() => {
      hashtagRefetch({
        keyword,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [keyword, hashtagRefetch]);

  // search question
  const {
    data: questionsData,
    loading,
    fetchMore,
    refetch: questionRefetch,
  } = useQuery<searchQuestions>(SEARCH_QUESTIONS_QUERY, {
    variables: {
      type: "hashtag",
    },
  });

  const onSearch = useCallback(
    async (type: string = "text", keyword: string) => {
      (document.activeElement as HTMLElement).blur();
      loadContentFinishVar(false);
      setKeyword(keyword.trim());
      questionRefetch({
        keyword: keyword.trim(),
        type,
      });
    },
    [questionRefetch]
  );

  useEffect(() => {
    if (router.query.tag) {
      onSearch("hashtag", router.query.tag as string);
      hashtagRefetch({
        keyword: router.query.tag,
      });
    }
  }, [router.query, hashtagRefetch, onSearch]);

  // infinity scroll
  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = loadContentFinishVar();
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
            lastId,
          },
        });
        if (more?.data?.searchQuestions?.length === 0) {
          loadContentFinishVar(true);
        }
      }
    },
    [questionsData, fetchMore, keyword]
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
          <div className="px-4 lg:mx-0 xl:px-0 sm:px-6 lg:px-8">
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
                      onSearch("text", keyword);
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
        {hashtagData?.searchQuestionHashtags && (
          <HashtagList
            hashtags={hashtagData.searchQuestionHashtags}
            onSearch={onSearch}
            inputFocused={inputFocused}
            keyword={keyword}
          />
        )}
      </div>
      <ContentSection>
        <section
          aria-labelledby="search-heading"
          className={`pb-4 sm:pb-6 lg:pb-8 w-full ${loading && "contents"}`}
        >
          <h2 id="search-heading" className="sr-only">
            검색
          </h2>
          {loading && (
            <div className="flex items-center justify-center flex-1">
              <HashLoader color="#777777" loading={true} size={60} />
            </div>
          )}
          <div
            className={`${
              loading && "hidden"
            } py-4 sm:py-6 lg:py-8 w-full px-4 sm:px-6 lg:px-8`}
          >
            {questionsData?.searchQuestions &&
            questionsData?.searchQuestions?.length > 0 ? (
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
