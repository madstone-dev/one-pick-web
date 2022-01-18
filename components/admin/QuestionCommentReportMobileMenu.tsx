import { useState } from "react";
import Link from "next/link";
import { showQuestionCommentReports_showQuestionCommentReports_reports } from "../../src/__generated__/showQuestionCommentReports";
import QuestionCommentReportDeleteButton from "./QuestionCommentReportDeleteButton";
import QuestionCommentDeleteButton from "../questions/QuestionCommentDeleteButton";
import MobileMenu from "../MobileMenu";

interface IquestionCommentReportMobileMenu {
  report: showQuestionCommentReports_showQuestionCommentReports_reports;
}

export default function QuestionCommentReportMobileMenu({
  report,
}: IquestionCommentReportMobileMenu) {
  const [open, setOpen] = useState(false);

  return (
    <MobileMenu title="신고 댓글 메뉴" open={open} setOpen={setOpen}>
      <li className="w-full">
        <Link href={`/questions/${report.questionComment.question?.id}`}>
          <a className="block w-full px-4 py-2 text-base font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            보기
          </a>
        </Link>
      </li>
      <li className="w-full">
        <div>
          <QuestionCommentReportDeleteButton
            report={report}
            fontSize="text-base font-medium"
            setOpen={setOpen}
          />
        </div>
      </li>
      <li className="w-full">
        <div>
          <QuestionCommentDeleteButton
            comment={report.questionComment}
            fontSize="text-base font-medium"
            setOpen={setOpen}
          />
        </div>
      </li>
    </MobileMenu>
  );
}
