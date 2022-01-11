/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myBlockContents
// ====================================================

export interface myBlockContents_me_questionBlocks_user {
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

export interface myBlockContents_me_questionBlocks_questionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
}

export interface myBlockContents_me_questionBlocks {
  __typename: "Question";
  id: number;
  user: myBlockContents_me_questionBlocks_user | null;
  isMine: boolean;
  content: string;
  image: any | null;
  choice: string[];
  questionHashtags: myBlockContents_me_questionBlocks_questionHashtags[];
  isPicker: boolean;
  totalPickers: number;
  totalComments: number;
  totalLikes: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface myBlockContents_me_questionCommentBlocks_user {
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

export interface myBlockContents_me_questionCommentBlocks_question {
  __typename: "Question";
  id: number;
}

export interface myBlockContents_me_questionCommentBlocks {
  __typename: "QuestionComment";
  id: number;
  user: myBlockContents_me_questionCommentBlocks_user;
  question: myBlockContents_me_questionCommentBlocks_question;
  content: string;
  isBlocked: boolean;
  pick: number;
  createdAt: string;
  updatedAt: string;
}

export interface myBlockContents_me {
  __typename: "User";
  id: number;
  questionBlocks: myBlockContents_me_questionBlocks[] | null;
  questionCommentBlocks: myBlockContents_me_questionCommentBlocks[] | null;
}

export interface myBlockContents {
  me: myBlockContents_me | null;
}

export interface myBlockContentsVariables {
  lastId?: number | null;
}
