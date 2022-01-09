/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: forgotPassword
// ====================================================

export interface forgotPassword_forgotPassword {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface forgotPassword {
  forgotPassword: forgotPassword_forgotPassword;
}

export interface forgotPasswordVariables {
  email: string;
}
