import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { apolloClient } from "../../src/apolloClient";
import { routes } from "../../src/routes";
import { ACCESS_TOKEN } from "../../src/utils/auth.utils";
import { shouldRefetchQuestionsVar } from "../../src/utils/questions.utils";
import { logout } from "../../src/__generated__/logout";

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

  const onCompleted = (data: logout) => {
    if (data?.logout?.ok) {
      apolloClient.cache.evict({
        fieldName: "me",
      });
      shouldRefetchQuestionsVar(true);
      localStorage.removeItem(ACCESS_TOKEN);
      router.push(routes.home);
    } else {
      alert("로그아웃 실패");
    }
  };

  const [logoutMutation, { loading }] = useMutation<logout>(LOGOUT_MUTATION, {
    onCompleted,
  });

  const userLogout = () => {
    logoutMutation();
  };

  return (
    <button
      onClick={userLogout}
      className={`${
        loading ? "pointer-events-none bg-gray-100" : ""
      } block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 whitespace-nowrap`}
    >
      로그아웃 {loading && "중..."}
    </button>
  );
}
