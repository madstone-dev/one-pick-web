import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { ACCESS_TOKEN } from "./utils/auth.utils";

const REFRESH_TOKEN_MUTATION = gql`
  mutation refreshToken {
    refreshToken {
      ok
      error
      accessToken
    }
  }
`;

export const refreshAccessToken = async () => {
  const result = await apolloClient.mutate({
    mutation: REFRESH_TOKEN_MUTATION,
  });
  if (result?.data?.refreshToken?.ok === false) {
    localStorage.removeItem(ACCESS_TOKEN);
  } else {
    localStorage.setItem(ACCESS_TOKEN, result?.data?.refreshToken?.accessToken);
  }
};

const authLink = setContext((_, { headers }) => {
  if (process.browser) {
    const token = localStorage.getItem(ACCESS_TOKEN) || "";
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  }
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(graphQLErrors, "gql Error");
    graphQLErrors.forEach((err) => {
      // 액세스 토큰 갱신
      if (err.message === "유효한 액세스 토큰이 아닙니다.") {
        refreshAccessToken();
      }
      // 리프레시 불가능시 액세스 토큰 삭제
      if (err.message.indexOf("유효한 갱신 토큰이 아닙니다.") > -1) {
        localStorage.removeItem(ACCESS_TOKEN);
        window.location.reload();
      }
    });
  }
  if (networkError) {
    console.log(networkError, "network Error");
  }
});

const uploadHttpLink = createUploadLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://graphql.onepick.fun"
      : "http://localhost:4000",
  credentials: "include",
});

const mergeFilteredItems = (existing: any, incoming: any, orderBy: string) => {
  const existArr = existing.map((item: any) => item.__ref);
  const filteredIncoming = incoming.filter(
    (item: any) => !existArr.includes(item.__ref)
  );
  if (orderBy === "desc") {
    return [...existing, ...filteredIncoming];
  } else {
    return [...filteredIncoming, ...existing];
  }
};

const cursorPaginate = (orderBy: string) => {
  return {
    merge(existing = [], incoming = []) {
      return mergeFilteredItems(existing, incoming, orderBy);
    },
    read(existing: any) {
      return existing && Object.values(existing);
    },
  };
};

export const apolloClient = new ApolloClient({
  link: authLink.concat(onErrorLink).concat(uploadHttpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          showQuestions: cursorPaginate("desc"),
          showQuestionComments: cursorPaginate("desc"),
          searchQuestions: cursorPaginate("desc"),
        },
      },
      User: {
        fields: {
          questions: cursorPaginate("desc"),
          questionComments: cursorPaginate("desc"),
          questionBlocks: cursorPaginate("desc"),
          questionCommentBlocks: cursorPaginate("desc"),
          followings: {
            keyArgs: false,
            ...cursorPaginate("desc"),
          },
          followers: {
            keyArgs: false,
            ...cursorPaginate("desc"),
          },
          totalQuestionComments: {
            keyArgs: false,
          },
        },
      },
    },
  }),
});
