/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createQuestionCommentReport
// ====================================================

export interface createQuestionCommentReport_createQuestionCommentReport {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface createQuestionCommentReport {
  createQuestionCommentReport: createQuestionCommentReport_createQuestionCommentReport;
}

export interface createQuestionCommentReportVariables {
  id: number;
  type: number;
}
