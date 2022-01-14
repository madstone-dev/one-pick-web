import { useRouter } from "next/router";
import { useEffect } from "react";
import { useReactiveVar } from "@apollo/client";
import { Ichildren } from "../../src/interfaces";
import { routes } from "../../src/routes";
import { loadingUserVar, loginUserVar } from "../../src/utils/auth.utils";
import { HashLoader } from "react-spinners";

export default function AdminOnly({ children }: Ichildren) {
  const router = useRouter();
  const loginUser = useReactiveVar(loginUserVar);
  const loadingUser = useReactiveVar(loadingUserVar);

  useEffect(() => {
    if (!loadingUser && !loginUser) {
      router.replace(routes.home);
    }
    if (!loadingUser && loginUser?.role !== "admin") {
      router.replace(routes.home);
    }
  }, [loginUser, loadingUser]);

  return (
    <>
      {loadingUser ? (
        <div className="flex items-center justify-center flex-1">
          <HashLoader color="#777777" loading={true} size={60} />
        </div>
      ) : (
        loginUser && loginUser.role === "admin" && children
      )}
    </>
  );
}
