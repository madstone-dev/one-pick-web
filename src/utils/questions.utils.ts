import { makeVar } from "@apollo/client";

export const isQuestionLoadFinishVar = makeVar(false);
export const shouldRefetchQuestionsVar = makeVar(false);
export const focusedQuestionVar = makeVar<any>(null);
