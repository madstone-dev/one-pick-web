import { gql, useQuery } from "@apollo/client";
import { SearchIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import { BASIC_USER_FRAGMENT } from "../../src/fragments";
import { headerHeightVar } from "../../src/utils/auth.utils";
import { cardShadow } from "../../src/utils/utils";
import { searchUsers } from "../../src/__generated__/searchUsers";
import ScrollToTop from "../ScrollToTop";
import OffsetPaginator from "./OffsetPaginator";
import User from "./User";

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

export default function UserList() {
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
    <div className="space-y-4">
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
        {data?.searchUsers && (
          <OffsetPaginator
            itemTotal={data.searchUsers.totalUsers}
            currentPage={page}
            take={take}
            lastPage={data.searchUsers.lastPage}
            setPage={setPage}
          />
        )}
      </div>
      <div className="pb-20 bg-white sm:rounded-3xl sm:px-2">
        <div
          className="border border-gray-100 divide-y divide-gray-200 sm:rounded-3xl"
          style={{ boxShadow: cardShadow }}
        >
          {/* header */}
          <div className="overflow-hidden sm:rounded-t-3xl">
            <div className="flex items-start px-6 py-3 bg-gray-50">
              <div className="flex-1 min-w-0 md:grid md:grid-cols-2 md:gap-6">
                <div>
                  <p className="text-xs text-gray-500">닉네임 / 이메일</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-500">최근 접속시간</p>
                </div>
              </div>
              <div className="sr-only">메뉴</div>
            </div>
          </div>
          {data?.searchUsers?.users?.map((user, index) => (
            <User user={user} key={index} />
          ))}
        </div>
      </div>
      <div className={`${scrollHeight > 0 ? "" : "hidden"}`}>
        <ScrollToTop />
      </div>
    </div>
  );
}
