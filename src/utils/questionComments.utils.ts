import { makeVar } from "@apollo/client";

export const isQuestionCommentLoadFinishVar = makeVar(false);
export const focusedCommentVar = makeVar<any>(null);
export const editingCommentVar = makeVar<any>(null);
