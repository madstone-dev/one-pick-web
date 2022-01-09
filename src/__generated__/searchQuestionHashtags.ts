/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchQuestionHashtags
// ====================================================

export interface searchQuestionHashtags_searchQuestionHashtags {
  __typename: "QuestionHashtag";
  hashtag: string;
  totalQuestions: number;
}

export interface searchQuestionHashtags {
  searchQuestionHashtags: (searchQuestionHashtags_searchQuestionHashtags | null)[] | null;
}

export interface searchQuestionHashtagsVariables {
  keyword?: string | null;
}
