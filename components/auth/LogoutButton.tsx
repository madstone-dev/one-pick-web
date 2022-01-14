import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { apolloClient } from "../../src/apolloClient";
import { routes } from "../../src/routes";
import { ACCESS_TOKEN } from "../../src/utils/auth.utils";

const LOGOUT_MUTATION = gql`
  mutation logout {
    logout {
      ok
      error
    }
  }
`;

export default function LogoutButton() {
  const router = useRouter();

  const onCompleted = (data: any) => {
    if (data?.logout?.ok) {
      apolloClient.cache.evict({
        fieldName: "me",
      });
      localStorage.removeItem(ACCESS_TOKEN);
      router.push(routes.home);
    }
  };

  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    onCompleted,
  });

  const userLogout = () => {
    logoutMutation();
  };

  return (
    <button
      onClick={userLogout}
      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 whitespace-nowrap"
    >
      로그아웃
    </button>
  );
}
