/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: resetPassword
// ====================================================

export interface resetPassword_resetPassword {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface resetPassword {
  resetPassword: resetPassword_resetPassword;
}

export interface resetPasswordVariables {
  email: string;
  token: string;
  password: string;
}
