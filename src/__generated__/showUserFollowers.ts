/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showUserFollowers
// ====================================================

export interface showUserFollowers_showUser_followers {
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

export interface showUserFollowers_showUser {
  __typename: "User";
  id: number;
  followers: showUserFollowers_showUser_followers[] | null;
}

export interface showUserFollowers {
  showUser: showUserFollowers_showUser | null;
}

export interface showUserFollowersVariables {
  id: number;
  lastId?: number | null;
}
