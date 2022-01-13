import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUser from "../../src/hooks/useUser";
import { Ichildren } from "../../src/interfaces";
import { routes } from "../../src/routes";
import { loginUserVar } from "../../src/utils/auth.utils";
import ActionBar from "../ActionBar";
import HeaderNav from "../HeaderNav";

export default function Layout({ children }: Ichildren) {
  const router = useRouter();
  const { data, loading } = useUser();
  const [isUserLoad, setIsUserLoad] = useState(false);

  useEffect(() => {
    setIsUserLoad(!loading);
    loginUserVar(data?.me);
  }, [loading, data?.me]);

  return (
    <div className="flex flex-col items-stretch w-full h-full min-h-screen">
      {isUserLoad && <HeaderNav user={data} />}
      <div className="flex flex-col flex-1">{children}</div>
      {(router.pathname === routes.home ||
        router.pathname === routes.search) && <ActionBar user={data} />}
    </div>
  );
}
