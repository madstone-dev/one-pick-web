/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShowQuestionCommentFragment
// ====================================================

export interface ShowQuestionCommentFragment_user {
  __typename: "User";
  id: number;
  email: string;
  username: string;
  avatar: any | null;
  isBlocked: boolean;
}

export interface ShowQuestionCommentFragment {
  __typename: "QuestionComment";
  id: number;
  user: ShowQuestionCommentFragment_user;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}