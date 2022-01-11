/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateQuestion
// ====================================================

export interface updateQuestion_updateQuestion_question_user {
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

export interface updateQuestion_updateQuestion_question_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface updateQuestion_updateQuestion_question {
  __typename: "Question";
  id: number;
  user: updateQuestion_updateQuestion_question_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  questionHashtags: updateQuestion_updateQuestion_question_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface updateQuestion_updateQuestion {
  __typename: "UpdateQuestionResult";
  ok: boolean;
  error: string | null;
  question: updateQuestion_updateQuestion_question | null;
}

export interface updateQuestion {
  updateQuestion: updateQuestion_updateQuestion;
}

export interface updateQuestionVariables {
  id: number;
  content?: string | null;
  image?: any | null;
  choice?: (string | null)[] | null;
  questionHashtags?: string | null;
}
