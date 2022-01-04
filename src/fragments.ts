import { gql } from "@apollo/client";

export const BASIC_USER_FRAGMENT = gql`
  fragment BasicUserFragment on User {
    id
    email
    username
    avatar
    isBlocked
  }
`;

export const SHOW_QUESTIONS_FRAGMENT = gql`
  fragment ShowQuestionsFragment on Question {
    id
    user {
      ...BasicUserFragment
    }
    isMine
    content
    image
    choice
    questionHashtags {
      hashtag
    }
    isPicker
    totalPickers
    totalComments
    totalLikes
    isBlocked
    createdAt
    updatedAt
  }
  ${BASIC_USER_FRAGMENT}
`;

export const SHOW_QUESTION_FRAGMENT = gql`
  fragment ShowQuestionFragment on Question {
    id
    user {
      ...BasicUserFragment
    }
    isMine
    content
    image
    choice
    questionHashtags {
      hashtag
      id
    }
    totalPickers
    isPicker
    myPick
    totalComments
    isLiked
    totalLikes
    isBlocked
    createdAt
    updatedAt
  }
  ${BASIC_USER_FRAGMENT}
`;

export const SHOW_QUESTION_COMMENT_FRAGMENT = gql`
  fragment ShowQuestionCommentFragment on QuestionComment {
    id
    user {
      ...BasicUserFragment
    }
    content
    isBlocked
    pick
    createdAt
    updatedAt
  }
  ${BASIC_USER_FRAGMENT}
`;
