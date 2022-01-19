import { makeVar } from "@apollo/client";

export const followersLoadFinishVar = makeVar(false);
export const followingsLoadFinishVar = makeVar(false);
export const shouldFollowRefetch = makeVar(false);
