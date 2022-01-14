import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useUser from "../../src/hooks/useUser";
import { Ichildren } from "../../src/interfaces";
import { routes } from "../../src/routes";
import { loadingUserVar, loginUserVar } from "../../src/utils/auth.utils";
import ActionBar from "../ActionBar";
import HeaderNav from "../HeaderNav";

export default function Layout({ children }: Ichildren) {
  const router = useRouter();
  const { data, loading } = useUser();

  useEffect(() => {
    console.log(loading, "loading");
    console.log(data?.me, "user");
    loginUserVar(data?.me);
    loadingUserVar(loading);
  }, [loading, data?.me]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <div className="flex flex-col items-stretch w-full h-full min-h-screen">
        <HeaderNav user={data} />
        <div className="flex flex-col flex-1">{children}</div>
        {(router.pathname === routes.home ||
          router.pathname === routes.search) && <ActionBar user={data} />}
      </div>
    </>
  );
}
