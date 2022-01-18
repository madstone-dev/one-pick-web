import { Dispatch, SetStateAction, useState } from "react";
import QuestionCommentDeleteButton from "./QuestionCommentDeleteButton";
import QuestionCommentEditButton from "./QuestionCommentEditButton";
import QuestionCommentBlockButton from "./QuestionCommentBlockButton";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import { loginUserVar } from "../../src/utils/auth.utils";
import MobileMenu from "../MobileMenu";

interface IquestionCommentMobileMenu {
  comment: showQuestionComments_showQuestionComments;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentMobileMenu({
  comment,
  setEditable,
  setReportOpen,
}: IquestionCommentMobileMenu) {
  const loginUser = loginUserVar();
  const [open, setOpen] = useState(false);
  const [isClickReport, setIsClickReport] = useState(false);
  const onReportOpen = () => {
    setOpen(false);
    setIsClickReport(true);
  };

  const shouldOpenReport = () => {
    if (isClickReport) {
      setReportOpen(true);
      setIsClickReport(false);
    }
  };

  return (
    <MobileMenu
      title="댓글 메뉴"
      open={open}
      setOpen={setOpen}
      afterLeave={shouldOpenReport}
    >
      {loginUser?.id === comment.user.id ? (
        <>
          <li className="w-full">
            <div>
              <QuestionCommentEditButton
                comment={comment}
                setEditable={setEditable}
                fontSize="text-base font-semibold"
                setOpen={setOpen}
              />
            </div>
          </li>
          <li className="w-full">
            <div>
              <QuestionCommentDeleteButton
                comment={comment}
                fontSize="text-base font-semibold"
                setOpen={setOpen}
              />
            </div>
          </li>
        </>
      ) : (
        <>
          <li className="w-full">
            <div>
              <QuestionCommentBlockButton
                comment={comment}
                fontSize="text-base font-semibold"
                setOpen={setOpen}
              />
            </div>
          </li>
          <li className="w-full">
            <button
              className="block w-full px-4 py-2 text-base font-semibold text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
              onClick={onReportOpen}
            >
              댓글 신고
            </button>
          </li>
        </>
      )}
    </MobileMenu>
  );
}
