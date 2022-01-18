import { useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { myQuestionComments_me_questionComments } from "../../src/__generated__/myQuestionComments";
import { toggleQuestionCommentBlock } from "../../src/__generated__/toggleQuestionCommentBlock";
import { TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION } from "../questions/QuestionCommentBlockButton";

interface IuserCommentBlockButton {
  comment: myQuestionComments_me_questionComments;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function UserCommentBlockButton({
  comment,
  fontSize,
  setOpen,
}: IuserCommentBlockButton) {
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
