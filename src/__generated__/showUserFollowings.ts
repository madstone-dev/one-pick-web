/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: showUserFollowings
// ====================================================

export interface showUserFollowings_showUser_followings {
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

export interface showUserFollowings_showUser {
  __typename: "User";
  id: number;
  followings: showUserFollowings_showUser_followings[] | null;
}

export interface showUserFollowings {
  showUser: showUserFollowings_showUser | null;
}

export interface showUserFollowingsVariables {
  id: number;
  lastId?: number | null;
}
