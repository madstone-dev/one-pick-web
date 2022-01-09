/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createQuestionReport
// ====================================================

export interface createQuestionReport_createQuestionReport {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface createQuestionReport {
  createQuestionReport: createQuestionReport_createQuestionReport;
}

export interface createQuestionReportVariables {
  id: number;
  type: number;
}
