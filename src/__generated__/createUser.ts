/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createUser
// ====================================================

export interface createUser_createUser {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface createUser {
  createUser: createUser_createUser;
}

export interface createUserVariables {
  email: string;
  username: string;
  password: string;
}
