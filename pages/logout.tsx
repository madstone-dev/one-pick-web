import { removeCookies } from "cookies-next";
import { REFRESH_TOKEN } from "../src/utils/auth.utils";

export default function Logout() {
  return null;
}

export async function getServerSideProps({ req, res }: any) {
  removeCookies(REFRESH_TOKEN, { req, res });
  removeCookies(`${REFRESH_TOKEN}.sig`, { req, res });
  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
}
