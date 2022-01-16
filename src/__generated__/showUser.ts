/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showUser
// ====================================================

export interface showUser_showUser_questions_user {
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

export interface showUser_showUser_questions_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface showUser_showUser_questions {
  __typename: "Question";
  id: number;
  user: showUser_showUser_questions_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: showUser_showUser_questions_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface showUser_showUser_picks_user {
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

export interface showUser_showUser_picks_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface showUser_showUser_picks {
  __typename: "Question";
  id: number;
  user: showUser_showUser_picks_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: showUser_showUser_picks_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface showUser_showUser {
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
  questions: showUser_showUser_questions[] | null;
  totalQuestions: number;
  picks: showUser_showUser_picks[] | null;
}

export interface showUser {
  showUser: showUser_showUser | null;
}

export interface showUserVariables {
  id: number;
  lastId?: number | null;
}
