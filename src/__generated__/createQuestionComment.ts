/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createQuestionComment
// ====================================================

export interface createQuestionComment_createQuestionComment_comment_user {
  __typename: "User";
  id: number;
  email: string;
  username: string;
  avatar: any | null;
  role: string;
  isBlocked: boolean;
  isFollowing: boolean;
  totalFollowings: number;
  totalFollowers: number;
  isMe: boolean;
  totalPicks: number;
  lastLogin: string | null;
}

export interface createQuestionComment_createQuestionComment_comment_question {
  __typename: "Question";
  id: number;
}

export interface createQuestionComment_createQuestionComment_comment {
  __typename: "QuestionComment";
  id: number;
  user: createQuestionComment_createQuestionComment_comment_user;
  question: createQuestionComment_createQuestionComment_comment_question;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}

export interface createQuestionComment_createQuestionComment {
  __typename: "CreateQuestionCommentResult";
  ok: boolean;
  error: string | null;
  comment: createQuestionComment_createQuestionComment_comment | null;
}

export interface createQuestionComment {
  createQuestionComment: createQuestionComment_createQuestionComment;
}

export interface createQuestionCommentVariables {
  id: number;
  content: string;
}
