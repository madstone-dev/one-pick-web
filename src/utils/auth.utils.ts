import { makeVar } from "@apollo/client";
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";

export const loginUserVar = makeVar<any>(null);
export const loadingUserVar = makeVar<boolean>(true);
export const loadindLoginUserVar = makeVar<boolean>(false);
export const headerHeightVar = makeVar<number>(0);
export const refreshTokenVar = makeVar<string | undefined>(undefined);

export const DEFAULT_ERROR_MESSAGE = { message: "" };

export const getAvatar = (username: string | undefined) => {
  return encodeURI(
    `https://ui-avatars.com/api/?name=${username}&color=7F9CF5&background=EBF4FF`
  );
};

export const getRefreshToken = (cookies: {
  [key: string]: object | undefined;
}) => {
  return cookies[REFRESH_TOKEN] || undefined;
};
