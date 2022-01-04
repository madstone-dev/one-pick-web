/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: refreshToken
// ====================================================

export interface refreshToken_refreshToken {
  __typename: "RefreshTokenResult";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
}

export interface refreshToken {
  refreshToken: refreshToken_refreshToken;
}
