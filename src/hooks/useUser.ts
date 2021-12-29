import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { refreshToken } from "../apolloClient";
import { BASIC_USER_FRAGMENT } from "../fragments";
import { ACCESS_TOKEN } from "../utils/auth.utils";

export const ME_QUERY = gql`
  query me {
    me {
      ...BasicUserFragment
    }
  }
  ${BASIC_USER_FRAGMENT}
`;

function useUser() {
  const hasToken = Boolean(
    process.browser ? localStorage.getItem(ACCESS_TOKEN) : false
  );
  if (process.browser && !hasToken) {
    refreshToken();
  }
  const { data, loading } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  return { data, loading };
}

export default useUser;
