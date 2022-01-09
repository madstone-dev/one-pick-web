/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myQuestionComments
// ====================================================

export interface myQuestionComments_me_questionComments_user {
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

export interface myQuestionComments_me_questionComments {
  __typename: "QuestionComment";
  id: number;
  user: myQuestionComments_me_questionComments_user;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}

export interface myQuestionComments_me {
  __typename: "User";
  id: number;
  questionComments: (myQuestionComments_me_questionComments | null)[] | null;
  totalQuestionComments: number;
}

export interface myQuestionComments {
  me: myQuestionComments_me | null;
}

export interface myQuestionCommentsVariables {
  lastId?: number | null;
}
