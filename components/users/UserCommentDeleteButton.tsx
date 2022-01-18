import { useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { deleteQuestionComment } from "../../src/__generated__/deleteQuestionComment";
import { myQuestionComments_me_questionComments } from "../../src/__generated__/myQuestionComments";
import { DELETE_QUESTION_COMMENT_MUTATION } from "../questions/QuestionCommentDeleteButton";

interface IuserCommentDeleteButton {
  comment: myQuestionComments_me_questionComments;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function UserCommentDeleteButton({
  comment,
  fontSize,
  setOpen,
}: IuserCommentDeleteButton) {
  const deleteQuestionCommentCache = () => {
    apolloClient.cache.evict({
      id: `QuestionComment:${comment.id}`,
    });
    apolloClient.cache.gc();
    if (setOpen) {
      setOpen(false);
    }
  };

  const [deleteQuestionCommentMutation] = useMutation<deleteQuestionComment>(
    DELETE_QUESTION_COMMENT_MUTATION,
    {
      variables: {
        id: comment.id,
      },
      onCompleted: () => deleteQuestionCommentCache(),
    }
  );

  const onDeleteClick = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteQuestionCommentMutation();
    }
  };

  return (
    <button
      className={`${
        fontSize ? fontSize : "text-sm "
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
      onClick={onDeleteClick}
    >
      댓글 삭제
    </button>
  );
}
