import { makeVar } from "@apollo/client";

export const focusedCommentVar = makeVar<number | null>(null);
export const editingCommentVar = makeVar<number | null>(null);
