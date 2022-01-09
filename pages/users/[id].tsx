import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/auth/Layout";
import { apolloClient } from "../../src/apolloClient";
import {
  getAvatar,
  headerHeightVar,
  loginUserVar,
} from "../../src/utils/auth.utils";
import "moment/locale/ko";
import UserQuestions from "../../components/users/UserQuestions";
import {
  BASIC_USER_FRAGMENT,
  SHOW_QUESTIONS_FRAGMENT,
} from "../../src/fragments";
import { classNames } from "../../src/utils/utils";
import ContentSection from "../../components/ContentSection";
import { isQuestionLoadFinishVar } from "../../src/utils/questions.utils";
import Link from "next/link";
import { routes } from "../../src/routes";
import ToggleFollowButton from "../../components/users/ToggleFollowButton";
import { showUser, showUser_showUser } from "../../src/__generated__/showUser";

const SHOW_USER_QUERY = gql`
  query showUser($id: Int!, $lastId: Int) {
    showUser(id: $id) {
      ...BasicUserFragment
      questions(lastId: $lastId) {
        ...ShowQuestionsFragment
      }
      picks(lastId: $lastId) {
        ...ShowQuestionsFragment
      }
    }
  }
  ${BASIC_USER_FRAGMENT}
  ${SHOW_QUESTIONS_FRAGMENT}
`;

interface IshowUserServer {
  data: showUser_showUser;
}

export default function ShowUser({ data }: IshowUserServer) {
  const router = useRouter();
  const loginUser = loginUserVar();
  const id = parseInt(router.query.id as string);
  const [user, setUser] = useState(data);
  const [scrollHeight, setScrollHeight] = useState(0);
  const {
    data: userData,
    refetch,
    fetchMore,
  } = useQuery<showUser>(SHOW_USER_QUERY, {
    variables: {
      id,
    },
    onCompleted: () => {
      isQuestionLoadFinishVar(false);
    },
  });
  const tabs = [
    { name: "작성한 질문", to: "createdQuestions" },
    { name: "응답한 질문", to: "answerdQuestions" },
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0].to);

  // SSR -> CSR 전환
  useEffect(() => {
    if (userData?.showUser) {
      setUser(userData?.showUser);
    }
  }, [userData]);

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
      <div className="w-full max-w-6xl px-4 pt-8 pb-2 mx-auto sm:px-6 md:flex md:items-center md:justify-between lg:px-8 h-fit">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                className="w-16 h-16 rounded-full"
                src={user?.avatar?.Location || getAvatar(user?.username)}
                alt={user?.username}
              />
              <span
                className="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 break-all">
              {user?.username}
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">
              팔로워 {user?.totalFollowers}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse mt-6 space-y-4 space-y-reverse justify-stretch sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          {id === loginUser?.id ? (
            <Link href={routes.userProfile}>
              <a className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                계정 설정
              </a>
            </Link>
          ) : (
            <ToggleFollowButton user={user} />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`sticky z-30 bg-white lg:px-6 ${
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
  } = await apolloClient.query<showUser>({
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
