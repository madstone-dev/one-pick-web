/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showQuestions
// ====================================================

export interface showQuestions_showQuestions_user {
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

export interface showQuestions_showQuestions_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface showQuestions_showQuestions {
  __typename: "Question";
  id: number;
  user: showQuestions_showQuestions_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: showQuestions_showQuestions_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface showQuestions {
  showQuestions: showQuestions_showQuestions[];
}

export interface showQuestionsVariables {
  lastId?: number | null;
}
