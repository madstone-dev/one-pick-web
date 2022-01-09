import Layout from "../../components/auth/Layout";
import { getRefreshToken, headerHeightVar } from "../../src/utils/auth.utils";
import { routes } from "../../src/routes";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfileAside from "../../components/users/ProfileAside";
import { gql, useQuery } from "@apollo/client";
import {
  SHOW_QUESTIONS_FRAGMENT,
  SHOW_QUESTION_COMMENT_FRAGMENT,
} from "../../src/fragments";
import { classNames } from "../../src/utils/utils";
import BlockedQuestions from "../../components/users/BlockedQuestions";
import UserComment from "../../components/users/UserComment";
import { loadContentFinishVar } from "../../src/utils/user.utils";

const ME_QUERY = gql`
  query me($lastId: Int) {
    me {
      questionBlocks(lastId: $lastId) {
        ...ShowQuestionsFragment
      }
      questionCommentBlocks(lastId: $lastId) {
        ...ShowQuestionCommentFragment
      }
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
  ${SHOW_QUESTION_COMMENT_FRAGMENT}
`;

export default function UserBlocks() {
  const tabs = [
    { name: "숨긴 질문", to: "qustions" },
    { name: "숨긴 댓글", to: "comments" },
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0].to);
  const [scrollHeight, setScrollHeight] = useState(0);
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

  const loader = useRef(null);
  const { data, refetch, fetchMore } = useQuery(ME_QUERY, {
    onCompleted: () => {
      loadContentFinishVar(false);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const [commentCount, setCommentCount] = useState(0);
  useEffect(() => {
    if (data?.me?.questionCommentBlocks) {
      const blockCount = data?.me?.questionCommentBlocks?.filter(
        (comment: any) => comment.isBlocked
      );
      setCommentCount(blockCount.length);
    }
  }, [data]);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = loadContentFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (currentTab === tabs[0].to) {
        if (data?.me?.questionBlocks && target.isIntersecting) {
          const lastId =
            data?.me?.questionBlocks[data.me.questionBlocks.length - 1]?.id;
          const more: any = await fetchMore({
            variables: {
              lastId,
            },
          });
          if (more?.data?.me?.questionBlocks?.length === 0) {
            loadContentFinishVar(true);
          }
        }
      } else {
        if (data?.me?.questionCommentBlocks && target.isIntersecting) {
          const lastId =
            data?.me?.questionCommentBlocks[
              data.me.questionCommentBlocks.length - 1
            ]?.id;
          const more: any = await fetchMore({
            variables: {
              lastId,
            },
          });
          if (more?.data?.me?.questionCommentBlocks?.length === 0) {
            loadContentFinishVar(true);
          }
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
      <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <ProfileAside />

          {/* 코멘트 리스트 */}
          <div className="px-4 space-y-6 sm:px-6 lg:px-8 lg:col-span-9">
            {/* Tabs */}
            <div
              className={`sticky z-30 mt-6 bg-white lg:px-6 sm:mt-2 2xl:mt-5 ${
                scrollHeight === 0 ? "" : "shadow-sm"
              }`}
              style={{
                top: `${headerHeightVar()}px`,
              }}
            >
              <div className="py-4">
                <div className="px-4 mx-auto sm:px-6 lg:px-8">
                  <nav
                    className="block mx-auto -mb-px space-x-8 w-fit"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.name}
                        className={classNames(
                          tab.to === currentTab
                            ? "border-indigo-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "whitespace-nowrap py-2 px-1 border-b-4 text-sm font-semibold"
                        )}
                        aria-current={
                          tab.to === currentTab ? "page" : undefined
                        }
                        onClick={() => {
                          loadContentFinishVar(false);
                          setCurrentTab(tab.to);
                        }}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <section aria-labelledby="user-comments-heading">
              <div
                className="overflow-hidden rounded-3xl"
                style={{ boxShadow: "0 1px 20px 0 rgb(0 0 0 / 10%)" }}
              >
                <div className="px-4 py-6 bg-white sm:p-6">
                  <div className="py-4 bg-white sm:py-6">
                    {currentTab === tabs[0].to
                      ? data?.me?.questionBlocks && (
                          <BlockedQuestions
                            questions={data?.me?.questionBlocks}
                            refetch={refetch}
                            fetchMore={fetchMore}
                          />
                        )
                      : null}
                    {currentTab === tabs[1].to ? (
                      commentCount > 0 ? (
                        data?.me?.questionCommentBlocks?.map(
                          (comment: any) =>
                            comment.isBlocked && (
                              <UserComment key={comment.id} comment={comment} />
                            )
                        )
                      ) : (
                        <div className="text-lg font-bold text-center text-gray-600 sm:text-xl">
                          <span className="block">숨겨둔 댓글이 없습니다</span>
                        </div>
                      )
                    ) : null}
                  </div>
                  <div ref={loader} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const token = getRefreshToken({ req, res });
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: routes.home,
      },
    };
  }
  return {
    props: {},
  };
}
