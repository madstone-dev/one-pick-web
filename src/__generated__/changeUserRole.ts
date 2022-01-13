/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: changeUserRole
// ====================================================

export interface changeUserRole_changeUserRole {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface changeUserRole {
  changeUserRole: changeUserRole_changeUserRole;
}

export interface changeUserRoleVariables {
  id: number;
  role: string;
}
