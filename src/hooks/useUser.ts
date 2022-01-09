import { gql, useQuery } from "@apollo/client";
import { refreshAccessToken } from "../apolloClient";
import { BASIC_USER_FRAGMENT } from "../fragments";
import { ACCESS_TOKEN } from "../utils/auth.utils";
import { me } from "../__generated__/me";

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
    refreshAccessToken();
  }
  const { data, loading } = useQuery<me>(ME_QUERY, {
    skip: !hasToken,
  });
  return { data, loading };
}

export default useUser;
