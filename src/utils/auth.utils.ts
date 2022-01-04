import { makeVar } from "@apollo/client";
import { getCookie } from "cookies-next";

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const loginUserVar = makeVar<any>(null);

export const getRefreshToken = ({ req, res }: any) => {
  return getCookie(REFRESH_TOKEN, { req, res });
};
