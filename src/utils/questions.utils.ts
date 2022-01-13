import { makeVar } from "@apollo/client";

export const shouldRefetchQuestionsVar = makeVar(false);
export const focusedQuestionVar = makeVar<number | null>(null);
