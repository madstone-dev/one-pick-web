import { Dispatch, SetStateAction } from "react";
import { Menu } from "@headlessui/react";
import { focusedCommentVar } from "../../src/utils/questionComments.utils";
import { loginUserVar } from "../../src/utils/auth.utils";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import QuestionCommentDeleteButton from "./QuestionCommentDeleteButton";
import QuestionCommentEditButton from "./QuestionCommentEditButton";
import QuestionCommentBlockButton from "./QuestionCommentBlockButton";
import DropdownMenu from "../DropdownMenu";

interface IquestionCommentDropdown {
  comment: showQuestionComments_showQuestionComments;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentDropdown({
  comment,
  setEditable,
  setReportOpen,
}: IquestionCommentDropdown) {
  const loginUser = loginUserVar();

  const afterEnter = () => {
    focusedCommentVar(comment.id);
  };
  const afterLeave = () => {
    focusedCommentVar(null);
  };

  return (
    <DropdownMenu afterEnter={afterEnter} afterLeave={afterLeave}>
      {loginUser?.id === comment.user.id ? (
        <>
          <Menu.Item>
            <div>
              <QuestionCommentEditButton
                comment={comment}
                setEditable={setEditable}
              />
            </div>
          </Menu.Item>
          <Menu.Item>
            <div>
              <QuestionCommentDeleteButton comment={comment} />
            </div>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item>
            <div>
              <QuestionCommentBlockButton comment={comment} />
            </div>
          </Menu.Item>
          <Menu.Item>
            <button
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
              onClick={() => {
                setReportOpen(true);
              }}
            >
              댓글 신고
            </button>
          </Menu.Item>
        </>
      )}
    </DropdownMenu>
  );
}
