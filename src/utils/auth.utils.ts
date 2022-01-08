import { makeVar } from "@apollo/client";
import { getCookie } from "cookies-next";

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const loginUserVar = makeVar<any>(null);
export const headerHeightVar = makeVar<any>(0);

export const getRefreshToken = ({ req, res }: any) => {
  return getCookie(REFRESH_TOKEN, { req, res });
};

export const getAvatar = (username: string) => {
  return encodeURI(
    `https://ui-avatars.com/api/?name=${username}&color=7F9CF5&background=EBF4FF`
  );
};
