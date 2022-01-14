import Layout from "../../components/auth/Layout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProfileAside from "../../components/users/ProfileAside";
import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import {
  SHOW_QUESTIONS_FRAGMENT,
  SHOW_QUESTION_COMMENT_FRAGMENT,
} from "../../src/fragments";
import { cardShadow, loadContentFinishVar } from "../../src/utils/utils";
import BlockedQuestions from "../../components/users/BlockedQuestions";
import UserComment from "../../components/users/UserComment";
import { myBlockContents } from "../../src/__generated__/myBlockContents";
import Tabs from "../../components/Tabs";
import { NextSeo } from "next-seo";
import LoginOnly from "../../components/auth/LoginOnly";

const ME_QUERY = gql`
  query myBlockContents($lastId: Int) {
    me {
      id
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
  const tabs = useMemo(
    () => [
      { name: "숨긴 질문", to: "qustions" },
      { name: "숨긴 댓글", to: "comments" },
    ],
    []
  );
  const [currentTab, setCurrentTab] = useState(tabs[0].to);

  const loader = useRef(null);
  const { data, refetch, fetchMore } = useQuery<myBlockContents>(ME_QUERY, {
    onCompleted: () => {
      loadContentFinishVar(false);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [commentCount, setCommentCount] = useState(0);
  useEffect(() => {
    if (data?.me?.questionCommentBlocks) {
      const blockCount = data?.me?.questionCommentBlocks?.filter(
        (comment) => comment?.isBlocked
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
          const more: ApolloQueryResult<myBlockContents> = await fetchMore({
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
          const more: ApolloQueryResult<myBlockContents> = await fetchMore({
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
    [data, currentTab, fetchMore, tabs]
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
      <NextSeo title="숨긴 콘텐츠" />
      <LoginOnly>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <ProfileAside />

            {/* 숨긴 콘텐츠 리스트 */}
            <div className="px-4 space-y-6 sm:px-6 lg:px-8 lg:col-span-9">
              <Tabs
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
              <section aria-labelledby="user-comments-heading">
                <div
                  className="overflow-hidden rounded-3xl"
                  style={{ boxShadow: cardShadow }}
                >
                  <div className="px-4 py-6 bg-white sm:p-6">
                    <div className="py-4 bg-white sm:py-6">
                      {currentTab === tabs[0].to
                        ? data?.me?.questionBlocks && (
                            <BlockedQuestions
                              questions={data?.me?.questionBlocks}
                              fetchMore={fetchMore}
                            />
                          )
                        : null}
                      {currentTab === tabs[1].to ? (
                        commentCount > 0 ? (
                          data?.me?.questionCommentBlocks?.map(
                            (comment) =>
                              comment?.isBlocked && (
                                <UserComment
                                  key={comment?.id}
                                  comment={comment}
                                />
                              )
                          )
                        ) : (
                          <div className="text-lg font-bold text-center text-gray-600 sm:text-xl">
                            <span className="block">
                              숨겨둔 댓글이 없습니다
                            </span>
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
      </LoginOnly>
    </Layout>
  );
}
