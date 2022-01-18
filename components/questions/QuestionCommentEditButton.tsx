import { Dispatch, SetStateAction } from "react";
import { editingCommentVar } from "../../src/utils/questionComments.utils";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";

interface IquestionCommentEditButton {
  comment: showQuestionComments_showQuestionComments;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  fontSize?: string;
}

export default function QuestionCommentEditButton({
  comment,
  setEditable,
  setOpen,
  fontSize,
}: IquestionCommentEditButton) {
  return (
    <button
      onClick={() => {
        editingCommentVar(comment.id);
        setEditable(true);
        if (setOpen) {
          setOpen(false);
        }
      }}
      className={`${
        fontSize ? fontSize : "text-sm"
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
    >
      댓글 수정
    </button>
  );
}
