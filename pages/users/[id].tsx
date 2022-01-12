import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/auth/Layout";
import { apolloClient } from "../../src/apolloClient";
import { getAvatar, loginUserVar } from "../../src/utils/auth.utils";
import "moment/locale/ko";
import UserQuestions from "../../components/users/UserQuestions";
import {
  BASIC_USER_FRAGMENT,
  SHOW_QUESTIONS_FRAGMENT,
} from "../../src/fragments";
import ContentSection from "../../components/ContentSection";
import Link from "next/link";
import { routes } from "../../src/routes";
import ToggleFollowButton from "../../components/users/ToggleFollowButton";
import { showUser, showUser_showUser } from "../../src/__generated__/showUser";
import Tabs from "../../components/Tabs";
import { loadContentFinishVar } from "../../src/utils/utils";

const SHOW_USER_QUERY = gql`
  query showUser($id: Int!, $lastId: Int) {
    showUser(id: $id) {
      ...BasicUserFragment
      questions(lastId: $lastId) {
        ...ShowQuestionsFragment
      }
      totalQuestions
      picks(lastId: $lastId) {
        ...ShowQuestionsFragment
      }
      totalPicks
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
  const {
    data: userData,
    fetchMore,
    refetch,
  } = useQuery<showUser>(SHOW_USER_QUERY, {
    variables: {
      id,
    },
    onCompleted: () => {
      loadContentFinishVar(false);
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout>
      <div className="w-full max-w-4xl px-4 pt-8 pb-2 mx-auto h-fit">
        <div className="flex flex-col flex-wrap items-center justify-center w-full space-y-6">
          <div className="flex-shrink-0">
            <div className="relative mx-6">
              <img
                className="rounded-full w-28 h-28 md:w-40 md:h-40"
                src={user?.avatar?.Location || getAvatar(user?.username)}
                alt={user?.username}
              />
              <span
                className="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="mx-auto text-2xl font-bold text-gray-900 break-all w-fit">
              {user?.username}
            </h1>
            <div className="flex justify-between space-x-8 text-base font-medium text-gray-500 md:space-x-16">
              <div className="flex flex-col items-center justify-center">
                <span>{user?.totalQuestions}</span>
                <span className="whitespace-nowrap">게시물</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span>{user?.totalFollowers}</span>
                <span className="whitespace-nowrap">팔로워</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span>{user?.totalFollowings}</span>
                <span className="whitespace-nowrap">팔로잉</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse w-full max-w-sm mx-auto mt-6 space-y-4 h-fit">
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
      <Tabs tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
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
