/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShowQuestionFragment
// ====================================================

export interface ShowQuestionFragment_user {
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

export interface ShowQuestionFragment_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
  id: number;
}

export interface ShowQuestionFragment_userPicks {
  __typename: "QuestionUserPicks";
  first: number;
  second: number;
  total: number;
}

export interface ShowQuestionFragment {
  __typename: "Question";
  id: number;
  user: ShowQuestionFragment_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: ShowQuestionFragment_questionHashtags[];
  totalPickers: number;
  isPicker: boolean;
  myPick: number | null;
  userPicks: ShowQuestionFragment_userPicks;
  totalComments: number;
  isLiked: boolean;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
