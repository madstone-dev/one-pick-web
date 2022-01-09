/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Mutation
// ====================================================

export interface Mutation_updateQuestion_question_user {
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

export interface Mutation_updateQuestion_question_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface Mutation_updateQuestion_question {
  __typename: "Question";
  id: number;
  user: Mutation_updateQuestion_question_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  questionHashtags: (Mutation_updateQuestion_question_questionHashtags | null)[] | null;
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Mutation_updateQuestion {
  __typename: "UpdateQuestionResult";
  ok: boolean;
  error: string | null;
  question: Mutation_updateQuestion_question | null;
}

export interface Mutation {
  updateQuestion: Mutation_updateQuestion;
}

export interface MutationVariables {
  id: number;
  content?: string | null;
  image?: any | null;
  choice?: (string | null)[] | null;
  questionHashtags?: string | null;
}
