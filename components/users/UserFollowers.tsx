import {
  ApolloQueryResult,
  gql,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { BASIC_USER_FRAGMENT } from "../../src/fragments";
import { useCallback, useEffect, useRef, useState } from "react";
import { showUser_showUser } from "../../src/__generated__/showUser";
import { showUserFollowers } from "../../src/__generated__/showUserFollowers";
import { getAvatar } from "../../src/utils/auth.utils";
import moment from "moment";
import FollowModal from "./FollowModal";
import {
  followersLoadFinishVar,
  shouldFollowRefetch,
} from "../../src/utils/userFollow.utils";
import Link from "next/link";

const SHOW_USER_FOLLOWERS_QUERY = gql`
  query showUserFollowers($id: Int!, $lastId: Int) {
    showUser(id: $id) {
      id
      followers(lastId: $lastId) {
        ...BasicUserFragment
      }
    }
  }
  ${BASIC_USER_FRAGMENT}
`;

interface IuserFollowers {
  user: showUser_showUser;
}

export default function UserFollowers({ user }: IuserFollowers) {
  const loader = useRef(null);
  const [open, setOpen] = useState(false);
  const [quickClose, setQuickClose] = useState(false);
  const [transitionFinish, setTransitionFinish] = useState(false);
  const shouldRefetch = useReactiveVar(shouldFollowRefetch);
  const {
    data: followersData,
    fetchMore,
    refetch,
  } = useQuery<showUserFollowers>(SHOW_USER_FOLLOWERS_QUERY, {
    variables: {
      id: user.id,
    },
    onCompleted: () => {
      followersLoadFinishVar(false);
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
      const loadFinish = followersLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (followersData?.showUser?.followers && target.isIntersecting) {
        const lastId =
          followersData?.showUser?.followers[
            followersData?.showUser?.followers.length - 1
          ]?.id;
        const more: ApolloQueryResult<showUserFollowers> = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.showUser?.followers?.length === 0) {
          followersLoadFinishVar(true);
        }
      }
    },
    [followersData, fetchMore, open]
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
      title="?????????"
      count={user?.totalFollowers}
    >
      <ul
        role="list"
        className="pb-8 overflow-y-auto divide-y divide-gray-200"
        style={{
          minHeight: "160px",
        }}
      >
        {followersData?.showUser?.followers &&
          followersData.showUser.followers.length === 0 && (
            <li className="flex items-center justify-center h-40 pb-4">
              <p className="text-base font-medium text-center text-gray-400">
                ????????? ??? ????????? ????????????
              </p>
            </li>
          )}
        {followersData?.showUser?.followers &&
          followersData?.showUser?.followers.map((user, index) => (
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
                        alt={`${user.username}??? ?????????`}
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
                        ).fromNow()} ??????`
                      : "?????????"}
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
                      ??????
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
