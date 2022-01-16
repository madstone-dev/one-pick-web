import { gql } from "@apollo/client";

export const BASIC_USER_FRAGMENT = gql`
  fragment BasicUserFragment on User {
    id
    email
    username
    avatar
    role
    isBlocked
    isFollowing
    totalFollowings
    totalFollowers
    isMe
    totalPicks
    lastLogin
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
    userPicks {
      first
      second
      total
    }
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
    question {
      id
    }
    content
    isBlocked
    pick
    createdAt
    updatedAt
  }
  ${BASIC_USER_FRAGMENT}
`;
