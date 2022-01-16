/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createQuestion
// ====================================================

export interface createQuestion_createQuestion_question_user {
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

export interface createQuestion_createQuestion_question_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface createQuestion_createQuestion_question {
  __typename: "Question";
  id: number;
  user: createQuestion_createQuestion_question_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: createQuestion_createQuestion_question_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface createQuestion_createQuestion {
  __typename: "CreateQuestionResult";
  ok: boolean;
  error: string | null;
  question: createQuestion_createQuestion_question | null;
}

export interface createQuestion {
  createQuestion: createQuestion_createQuestion;
}

export interface createQuestionVariables {
  content: string;
  choice: string[];
  image: any;
  questionHashtags?: string | null;
}
