/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchQuestions
// ====================================================

export interface searchQuestions_searchQuestions_user {
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

export interface searchQuestions_searchQuestions_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface searchQuestions_searchQuestions {
  __typename: "Question";
  id: number;
  user: searchQuestions_searchQuestions_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: searchQuestions_searchQuestions_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface searchQuestions {
  searchQuestions: searchQuestions_searchQuestions[] | null;
}

export interface searchQuestionsVariables {
  keyword?: string | null;
  type: string;
  lastId?: number | null;
}
