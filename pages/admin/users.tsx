import { gql, useQuery } from "@apollo/client";
import { SearchIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import AdminAside from "../../components/admin/AdminAside";
import OffsetPaginator from "../../components/admin/OffsetPaginator";
import UserList from "../../components/admin/UserList";
import Layout from "../../components/auth/Layout";
import ScrollToTop from "../../components/ScrollToTop";
import { BASIC_USER_FRAGMENT } from "../../src/fragments";
import { routes } from "../../src/routes";
import { getRefreshToken, headerHeightVar } from "../../src/utils/auth.utils";
import { searchUsers } from "../../src/__generated__/searchUsers";
import { NextSeo } from "next-seo";

const SEARCH_UESRS_QUERY = gql`
  query searchUsers($keyword: String, $page: Int, $take: Int) {
    searchUsers(keyword: $keyword, page: $page, take: $take) {
      totalUsers
      users {
        ...BasicUserFragment
      }
      lastPage
    }
  }
  ${BASIC_USER_FRAGMENT}
`;

export default function AdminUsers() {
  const inputRef = useRef<any>();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const take = 20;
  const { data, fetchMore } = useQuery<searchUsers>(SEARCH_UESRS_QUERY, {
    variables: {
      page,
      take,
      keyword,
    },
  });

  useEffect(() => {
    fetchMore({
      variables: {
        page,
        take,
        keyword,
      },
    });
  }, [page, fetchMore, keyword]);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      setPage(1);
      setKeyword(inputRef.current.value);
    }
  };

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

  return (
    <>
      <NextSeo title="유저 목록" />
      <Layout>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <AdminAside />
            <div className="space-y-4 sm:px-6 lg:px-8 lg:col-span-9">
              {data?.searchUsers && (
                <>
                  <div
                    className={`${
                      headerHeightVar() < scrollHeight ? "shadow-sm" : ""
                    } sticky px-4 pt-4 pb-2 space-y-2 bg-white sm:pt-0 sm:pb-0 sm:grid sm:grid-cols-2 sm:space-y-0`}
                    style={{
                      top: `${headerHeightVar()}px`,
                    }}
                  >
                    <div>
                      <div className="flex items-center flex-1">
                        <div className="w-full sm:max-w-xs">
                          <label htmlFor="search" className="sr-only">
                            닉네임 검색
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <SearchIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <form onSubmit={onSearch}>
                              <input
                                ref={inputRef}
                                id="search"
                                name="search"
                                className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="닉네임 검색"
                                type="search"
                                defaultValue={keyword}
                                autoFocus
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <OffsetPaginator
                      itemTotal={data.searchUsers.totalUsers}
                      currentPage={page}
                      take={take}
                      lastPage={data.searchUsers.lastPage}
                      setPage={setPage}
                    />
                  </div>
                  <UserList users={data.searchUsers.users} />
                </>
              )}
            </div>
          </div>
        </main>
        <div className={`${scrollHeight > 0 ? "" : "hidden"}`}>
          <ScrollToTop />
        </div>
      </Layout>
    </>
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
