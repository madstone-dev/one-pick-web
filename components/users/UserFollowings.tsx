import {
  ApolloQueryResult,
  gql,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { BASIC_USER_FRAGMENT } from "../../src/fragments";
import { useCallback, useEffect, useRef, useState } from "react";
import { showUser_showUser } from "../../src/__generated__/showUser";
import { showUserFollowings } from "../../src/__generated__/showUserFollowings";
import { getAvatar } from "../../src/utils/auth.utils";
import moment from "moment";
import FollowModal from "./FollowModal";
import {
  followingsLoadFinishVar,
  shouldFollowRefetch,
} from "../../src/utils/userFollow.utils";
import Link from "next/link";

const SHOW_USER_FOLLOWERS_QUERY = gql`
  query showUserFollowings($id: Int!, $lastId: Int) {
    showUser(id: $id) {
      id
      followings(lastId: $lastId) {
        ...BasicUserFragment
      }
    }
  }
  ${BASIC_USER_FRAGMENT}
`;

interface IuserFollowings {
  user: showUser_showUser;
}

export default function UserFollowings({ user }: IuserFollowings) {
  const loader = useRef(null);
  const [open, setOpen] = useState(false);
  const [quickClose, setQuickClose] = useState(false);
  const [transitionFinish, setTransitionFinish] = useState(false);
  const shouldRefetch = useReactiveVar(shouldFollowRefetch);
  const {
    data: followingsData,
    fetchMore,
    refetch,
  } = useQuery<showUserFollowings>(SHOW_USER_FOLLOWERS_QUERY, {
    variables: {
      id: user.id,
    },
    onCompleted: () => {
      followingsLoadFinishVar(false);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      shouldFollowRefetch(false);
    }
  }, [shouldRefetch]);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = followingsLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (followingsData?.showUser?.followings && target.isIntersecting) {
        const lastId =
          followingsData?.showUser?.followings[
            followingsData?.showUser?.followings.length - 1
          ]?.id;
        const more: ApolloQueryResult<showUserFollowings> = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.showUser?.followings?.length === 0) {
          followingsLoadFinishVar(true);
        }
      }
    },
    [followingsData, fetchMore, open]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    if (open) {
      const observer = new IntersectionObserver(handleObserver, option);
      if (loader.current) {
        observer.observe(loader.current);
      }
    }
  }, [handleObserver, transitionFinish]);

  return (
    <FollowModal
      open={open}
      setOpen={setOpen}
      setTransitionFinish={setTransitionFinish}
      quickClose={quickClose}
      setQuickClose={setQuickClose}
      title="팔로잉"
      count={user?.totalFollowings}
    >
      <ul
        role="list"
        className="pb-8 overflow-y-auto divide-y divide-gray-200"
        style={{
          minHeight: "160px",
        }}
      >
        {followingsData?.showUser?.followings &&
          followingsData.showUser.followings.length === 0 && (
            <li className="flex items-center justify-center h-40 pb-4">
              <p className="text-base font-medium text-center text-gray-400">
                팔로잉 된 유저가 없습니다
              </p>
            </li>
          )}
        {followingsData?.showUser?.followings &&
          followingsData?.showUser?.followings.map((user, index) => (
            <li key={index} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Link href={`/users/${user.id}`}>
                    <a
                      onClick={() => {
                        setQuickClose(true);
                        setOpen(false);
                      }}
                    >
                      <img
                        className="object-cover object-center w-8 h-8 rounded-full"
                        src={user.avatar?.Location || getAvatar(user.username)}
                        alt={`${user.username}의 프로필`}
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/users/${user.id}`}>
                    <a
                      onClick={() => {
                        setQuickClose(true);
                        setOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.username}
                      </p>
                    </a>
                  </Link>
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastLogin
                      ? `${moment(
                          moment.unix(Number(user.lastLogin) / 1000)
                        ).fromNow()} 활동`
                      : "미접속"}
                  </p>
                </div>
                <div>
                  <Link href={`/users/${user.id}`}>
                    <a
                      onClick={() => {
                        setQuickClose(true);
                        setOpen(false);
                      }}
                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                    >
                      보기
                    </a>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        <li ref={loader} />
      </ul>
    </FollowModal>
  );
}
