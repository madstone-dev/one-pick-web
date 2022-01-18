import { gql, useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import { toggleQuestionCommentBlock } from "../../src/__generated__/toggleQuestionCommentBlock";

export const TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION = gql`
  mutation toggleQuestionCommentBlock($id: Int!) {
    toggleQuestionCommentBlock(id: $id) {
      ok
      error
    }
  }
`;

interface IquestionCommentBlockButton {
  comment: showQuestionComments_showQuestionComments;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}
export default function QuestionCommentBlockButton({
  comment,
  fontSize,
  setOpen,
}: IquestionCommentBlockButton) {
  const updateCache = () => {
    apolloClient.cache.modify({
      id: `QuestionComment:${comment.id}`,
      fields: {
        isBlocked(prev) {
          return !prev;
        },
      },
    });
    if (setOpen) {
      setOpen(false);
    }
  };

  const [toggleQuestionCommentBlockMutation] =
    useMutation<toggleQuestionCommentBlock>(
      TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION,
      {
        variables: {
          id: comment.id,
        },
      }
    );

  const onBlockClick = () => {
    toggleQuestionCommentBlockMutation();
    updateCache();
  };

  return (
    <button
      className={`${
        fontSize ? fontSize : "text-sm"
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
      onClick={onBlockClick}
    >
      댓글 숨기기 {comment.isBlocked && "해제"}
    </button>
  );
}
