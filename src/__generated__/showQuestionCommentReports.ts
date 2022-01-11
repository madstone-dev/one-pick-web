/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showQuestionCommentReports
// ====================================================

export interface showQuestionCommentReports_showQuestionCommentReports_reports_questionComment_user {
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

export interface showQuestionCommentReports_showQuestionCommentReports_reports_questionComment_question {
  __typename: "Question";
  id: number;
}

export interface showQuestionCommentReports_showQuestionCommentReports_reports_questionComment {
  __typename: "QuestionComment";
  id: number;
  user: showQuestionCommentReports_showQuestionCommentReports_reports_questionComment_user;
  question: showQuestionCommentReports_showQuestionCommentReports_reports_questionComment_question;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}

export interface showQuestionCommentReports_showQuestionCommentReports_reports {
  __typename: "QuestionCommentReport";
  id: number;
  type: number;
  questionComment: showQuestionCommentReports_showQuestionCommentReports_reports_questionComment;
  createdAt: string;
}

export interface showQuestionCommentReports_showQuestionCommentReports {
  __typename: "ShowQuestionCommentReportsResult";
  totalReports: number;
  lastPage: number;
  reports: showQuestionCommentReports_showQuestionCommentReports_reports[];
}

export interface showQuestionCommentReports {
  showQuestionCommentReports: showQuestionCommentReports_showQuestionCommentReports;
}

export interface showQuestionCommentReportsVariables {
  page?: number | null;
  take?: number | null;
}
