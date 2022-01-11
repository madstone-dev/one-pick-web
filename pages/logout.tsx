import { removeCookies } from "cookies-next";
import { apolloClient } from "../src/apolloClient";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../src/utils/auth.utils";
import { useRouter } from "next/router";
import { routes } from "../src/routes";
import { HashLoader } from "react-spinners";

export default function Logout() {
  const router = useRouter();
  if (process.browser) {
    localStorage.removeItem(ACCESS_TOKEN);
    router.push(routes.home);
  }

  return (
    <div className="flex items-center justify-center flex-1 h-screen">
      <HashLoader color="#777777" loading={true} size={60} />
    </div>
  );
}

export async function getServerSideProps({ req, res }: any) {
  removeCookies(REFRESH_TOKEN, { req, res });
  removeCookies(`${REFRESH_TOKEN}.sig`, { req, res });
  apolloClient.cache.evict({
    fieldName: "me",
  });
  return {
    props: {},
  };
}
