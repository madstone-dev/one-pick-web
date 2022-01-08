import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/auth/Layout";
import { apolloClient } from "../../src/apolloClient";
import { getAvatar, headerHeightVar } from "../../src/utils/auth.utils";
import "moment/locale/ko";
import UserQuestions from "../../components/users/UserQuestions";
import { SHOW_QUESTIONS_FRAGMENT } from "../../src/fragments";
import { shouldRefetchQuestionsVar } from "../../src/utils/questions.utils";
import { classNames } from "../../src/utils/utils";
import ContentSection from "../../components/ContentSection";

const SHOW_USER_QUERY = gql`
  query showUser($id: Int!, $take: Int, $lastId: Int) {
    showUser(id: $id) {
      id
      email
      username
      avatar
      role
      isMe
      totalPicks
      lastLogin
      questions(take: $take, lastId: $lastId) {
        ...ShowQuestionsFragment
      }
      picks(take: $take, lastId: $lastId) {
        ...ShowQuestionsFragment
      }
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function ShowUser({ data }: any) {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const [user, setUser] = useState(data);
  const [scrollHeight, setScrollHeight] = useState(0);
  const {
    data: userData,
    refetch,
    fetchMore,
  } = useQuery(SHOW_USER_QUERY, {
    variables: {
      id,
    },
  });
  const tabs = [
    { name: "작성한 질문", to: "createdQuestions" },
    { name: "응답한 질문", to: "answerdQuestions" },
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0].to);

  const lastLogin = moment(Number(user?.lastLogin)).fromNow();

  // SSR -> CSR 전환
  useEffect(() => {
    setUser(userData?.showUser);
  }, [userData]);

  useEffect(() => {
    const shouldRefetch = shouldRefetchQuestionsVar();
    if (shouldRefetch) {
      refetch();
      shouldRefetchQuestionsVar(false);
    }
  }, []);

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
      <div className="w-full max-w-6xl px-4 pt-8 mx-auto sm:px-6 md:flex md:items-center md:justify-between lg:px-8 h-fit">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                className="w-16 h-16 rounded-full"
                src={user?.avatar || getAvatar(user?.username)}
                alt={user?.username}
              />
              <span
                className="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.username}
            </h1>
            <p className="mt-1 text-xs font-medium text-gray-500">
              마지막 접속 {lastLogin}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse mt-6 space-y-4 space-y-reverse justify-stretch sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            계정 설정
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            팔로우
          </button>
        </div>
      </div>

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
                  aria-current={tab.to === currentTab ? "page" : undefined}
                  onClick={() => {
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
      <ContentSection>
        <div className="flex flex-col w-full">
          {user && (
            <UserQuestions
              questions={
                currentTab === tabs[0].to ? user?.questions : user?.picks
              }
              refetch={refetch}
              fetchMore={fetchMore}
            />
          )}
        </div>
      </ContentSection>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const {
    data: { showUser },
  } = await apolloClient.query({
    query: SHOW_USER_QUERY,
    variables: {
      id: parseInt(context.query.id),
    },
  });
  if (!showUser) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
  return {
    props: { data: showUser },
  };
}
