/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showQuestionReports
// ====================================================

export interface showQuestionReports_showQuestionReports_reports_question_user {
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

export interface showQuestionReports_showQuestionReports_reports_question_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface showQuestionReports_showQuestionReports_reports_question {
  __typename: "Question";
  id: number;
  user: showQuestionReports_showQuestionReports_reports_question_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  hashtagString: string | null;
  questionHashtags: showQuestionReports_showQuestionReports_reports_question_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface showQuestionReports_showQuestionReports_reports {
  __typename: "QuestionReport";
  id: number;
  type: number;
  question: showQuestionReports_showQuestionReports_reports_question;
  createdAt: string;
}

export interface showQuestionReports_showQuestionReports {
  __typename: "ShowQuestionReportsResult";
  totalReports: number;
  lastPage: number;
  reports: showQuestionReports_showQuestionReports_reports[] | null;
}

export interface showQuestionReports {
  showQuestionReports: showQuestionReports_showQuestionReports;
}

export interface showQuestionReportsVariables {
  page?: number | null;
  take?: number | null;
}
