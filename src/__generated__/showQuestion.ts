/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showQuestion
// ====================================================

export interface showQuestion_showQuestion_user {
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

export interface showQuestion_showQuestion_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
  id: number;
}

export interface showQuestion_showQuestion {
  __typename: "Question";
  id: number;
  user: showQuestion_showQuestion_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  questionHashtags: (showQuestion_showQuestion_questionHashtags | null)[] | null;
  totalPickers: number;
  isPicker: boolean;
  myPick: number | null;
  totalComments: number;
  isLiked: boolean;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface showQuestion {
  showQuestion: showQuestion_showQuestion | null;
}

export interface showQuestionVariables {
  id: number;
}