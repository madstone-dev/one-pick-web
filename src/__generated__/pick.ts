/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pick
// ====================================================

export interface pick_pick {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface pick {
  pick: pick_pick;
}

export interface pickVariables {
  id: number;
  pick: number;
}
