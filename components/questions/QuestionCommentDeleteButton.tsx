import { gql, useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { deleteQuestionComment } from "../../src/__generated__/deleteQuestionComment";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";

export const DELETE_QUESTION_COMMENT_MUTATION = gql`
  mutation deleteQuestionComment($id: Int!) {
    deleteQuestionComment(id: $id) {
      ok
      error
    }
  }
`;

interface IquestionCommentDeleteButton {
  comment: showQuestionComments_showQuestionComments;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentDeleteButton({
  comment,
  fontSize,
  setOpen,
}: IquestionCommentDeleteButton) {
  const deleteQuestionCommentCache = () => {
    apolloClient.cache.evict({
      id: `QuestionComment:${comment.id}`,
    });
    apolloClient.cache.gc();
    if (setOpen) {
      setOpen(false);
    }
  };

  const onCompleted = (data: deleteQuestionComment) => {
    if (data.deleteQuestionComment.ok) {
      deleteQuestionCommentCache();
      apolloClient.cache.modify({
        id: `Question:${comment.question.id}`,
        fields: {
          totalComments(prev) {
            return prev + 1;
          },
        },
      });
      apolloClient.cache.modify({
        id: `User:${comment.user.id}`,
        fields: {
          totalQuestionComments(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteQuestionCommentMutation] = useMutation<deleteQuestionComment>(
    DELETE_QUESTION_COMMENT_MUTATION,
    {
      variables: {
        id: comment.id,
      },
      onCompleted,
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
        fontSize ? fontSize : "text-sm"
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
      onClick={onDeleteClick}
    >
      댓글 삭제
    </button>
  );
}
