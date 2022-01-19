import { gql, useQuery, useReactiveVar } from "@apollo/client";
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
import { routes } from "../../src/routes";
import { showUser, showUser_showUser } from "../../src/__generated__/showUser";
import Tabs from "../../components/Tabs";
import { loadContentFinishVar } from "../../src/utils/utils";
import { NextSeo } from "next-seo";
import { NextPageContext } from "next";
import UserInfo from "../../components/users/UserInfo";

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
  const loginUser = useReactiveVar(loginUserVar);
  const id = parseInt(router.query.id as string);
  const [user, setUser] = useState(data);
  const {
    data: userData,
    refetch,
    fetchMore,
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

  useEffect(() => {
    refetch();
  }, [currentTab]);

  // SSR -> CSR 전환
  useEffect(() => {
    if (userData?.showUser) {
      setUser(userData?.showUser);
    }
  }, [userData, loginUser]);

  let userProfileImage = "";
  if (userData?.showUser) {
    userProfileImage =
      userData.showUser?.avatar?.Location ||
      getAvatar(userData.showUser?.username);
  } else {
    userProfileImage = data.avatar?.Location || getAvatar(data.username);
  }

  return (
    <>
      <NextSeo
        title={`${
          userData?.showUser ? userData?.showUser.username : data.username
        }`}
        openGraph={{
          type: "page",
          title: `${
            userData?.showUser ? userData?.showUser.username : data.username
          }의 프로필`,
          description: `${
            userData?.showUser ? userData?.showUser.username : data.username
          }의 프로필 페이지입니다.`,
          images: [
            {
              url: userProfileImage,
            },
          ],
        }}
      />
      <Layout>
        <UserInfo user={user} userProfileImage={userProfileImage} />
        <Tabs
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
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
    </>
  );
}

ShowUser.getInitialProps = async (context: NextPageContext) => {
  const {
    data: { showUser },
  } = await apolloClient.query<showUser>({
    query: SHOW_USER_QUERY,
    variables: {
      id: parseInt(context.query.id as string),
    },
  });
  if (!showUser) {
    context.res?.writeHead(301, {
      Location: routes.home,
    });
    context.res?.end();
  }
  return { data: showUser };
};
