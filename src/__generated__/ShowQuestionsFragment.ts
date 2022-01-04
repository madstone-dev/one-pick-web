/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShowQuestionsFragment
// ====================================================

export interface ShowQuestionsFragment_user {
  __typename: "User";
  id: number;
  email: string;
  username: string;
  avatar: any | null;
  isBlocked: boolean;
}

export interface ShowQuestionsFragment_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface ShowQuestionsFragment {
  __typename: "Question";
  id: number;
  user: ShowQuestionsFragment_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  questionHashtags: (ShowQuestionsFragment_questionHashtags | null)[] | null;
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
