import Layout from "../../components/auth/Layout";
import { useCallback, useEffect, useRef } from "react";
import ProfileAside from "../../components/users/ProfileAside";
import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import UserComment from "../../components/users/UserComment";
import { myQuestionComments } from "../../src/__generated__/myQuestionComments";
import { cardShadow, loadContentFinishVar } from "../../src/utils/utils";
import { NextSeo } from "next-seo";
import LoginOnly from "../../components/auth/LoginOnly";

const ME_QUERY = gql`
  query myQuestionComments($lastId: Int) {
    me {
      id
      questionComments(lastId: $lastId) {
        ...ShowQuestionCommentFragment
      }
      totalQuestionComments
    }
  }
  ${SHOW_QUESTION_COMMENT_FRAGMENT}
`;

export default function UserComments() {
  const loader = useRef(null);
  const { data, refetch, fetchMore } = useQuery<myQuestionComments>(ME_QUERY, {
    onCompleted: () => {
      loadContentFinishVar(false);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = loadContentFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.me?.questionComments && target.isIntersecting) {
        const lastId =
          data?.me?.questionComments[data.me.questionComments.length - 1]?.id;
        const more: ApolloQueryResult<myQuestionComments> = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.me?.questionComments?.length === 0) {
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
    <Layout>
      <NextSeo title="작성한 댓글" />
      <LoginOnly>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <ProfileAside />

            {/* 코멘트 리스트 */}
            <div className="px-4 space-y-6 sm:px-6 lg:px-8 lg:col-span-9">
              <section aria-labelledby="user-comments-heading">
                <div
                  className="overflow-hidden rounded-3xl"
                  style={{ boxShadow: cardShadow }}
                >
                  <div className="px-4 py-6 bg-white sm:p-6">
                    <div>
                      <h2
                        id="user-profile-heading"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        작성한 댓글
                        <span className="ml-2">
                          ({data?.me?.totalQuestionComments})
                        </span>
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        최근 작성한 순서대로 표시됩니다.
                      </p>
                    </div>
                    <div className="py-4 bg-white sm:py-6">
                      {data?.me?.questionComments &&
                      data?.me?.questionComments?.length > 0 ? (
                        data?.me?.questionComments?.map(
                          (comment) =>
                            comment && (
                              <UserComment key={comment.id} comment={comment} />
                            )
                        )
                      ) : (
                        <div className="text-lg font-bold text-center text-gray-600 sm:text-xl">
                          <span className="block">작성한 댓글이 없습니다</span>
                        </div>
                      )}
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
