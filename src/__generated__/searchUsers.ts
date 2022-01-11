/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchUsers
// ====================================================

export interface searchUsers_searchUsers_users {
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

export interface searchUsers_searchUsers {
  __typename: "SearchUsersResult";
  totalUsers: number;
  users: searchUsers_searchUsers_users[] | null;
  lastPage: number;
}

export interface searchUsers {
  searchUsers: searchUsers_searchUsers;
}

export interface searchUsersVariables {
  keyword?: string | null;
  page?: number | null;
  take?: number | null;
}
