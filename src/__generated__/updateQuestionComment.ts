/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateQuestionComment
// ====================================================

export interface updateQuestionComment_updateQuestionComment_comment_user {
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

export interface updateQuestionComment_updateQuestionComment_comment {
  __typename: "QuestionComment";
  id: number;
  user: updateQuestionComment_updateQuestionComment_comment_user;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}

export interface updateQuestionComment_updateQuestionComment {
  __typename: "UpdateQuestionCommentResult";
  ok: boolean;
  error: string | null;
  comment: updateQuestionComment_updateQuestionComment_comment | null;
}

export interface updateQuestionComment {
  updateQuestionComment: updateQuestionComment_updateQuestionComment;
}

export interface updateQuestionCommentVariables {
  id: number;
  content: string;
}
