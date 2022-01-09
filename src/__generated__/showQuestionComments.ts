/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showQuestionComments
// ====================================================

export interface showQuestionComments_showQuestionComments_user {
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

export interface showQuestionComments_showQuestionComments {
  __typename: "QuestionComment";
  id: number;
  user: showQuestionComments_showQuestionComments_user;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}

export interface showQuestionComments {
  showQuestionComments: (showQuestionComments_showQuestionComments | null)[] | null;
}

export interface showQuestionCommentsVariables {
  id: number;
  lastId?: number | null;
}
