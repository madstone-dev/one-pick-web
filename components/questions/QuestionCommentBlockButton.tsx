import { ApolloCache, gql, useMutation } from "@apollo/client";
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
}
export default function QuestionCommentBlockButton({
  comment,
}: IquestionCommentBlockButton) {
  const onUpdatedCommentBlock = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `QuestionComment:${comment.id}`,
      fields: {
        isBlocked(prev) {
          return !prev;
        },
      },
    });
  };

  const [toggleQuestionCommentBlockMutation] =
    useMutation<toggleQuestionCommentBlock>(
      TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION,
      {
        variables: {
          id: comment.id,
        },
        update: onUpdatedCommentBlock,
      }
    );

  const onBlockClick = () => {
    toggleQuestionCommentBlockMutation();
  };

  return (
    <button
      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
      onClick={onBlockClick}
    >
      댓글 숨기기 {comment.isBlocked && "해제"}
    </button>
  );
}
