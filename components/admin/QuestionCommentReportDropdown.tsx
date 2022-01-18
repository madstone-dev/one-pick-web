import { Menu } from "@headlessui/react";
import Link from "next/link";
import { showQuestionCommentReports_showQuestionCommentReports_reports } from "../../src/__generated__/showQuestionCommentReports";
import QuestionCommentReportDeleteButton from "./QuestionCommentReportDeleteButton";
import QuestionCommentDeleteButton from "../questions/QuestionCommentDeleteButton";
import DropdownMenu from "../DropdownMenu";

interface IquestionCommentReportDropdown {
  report: showQuestionCommentReports_showQuestionCommentReports_reports;
  isLast: boolean;
}

export default function QuestionCommentReportDropdown({
  report,
  isLast,
}: IquestionCommentReportDropdown) {
  return (
    <DropdownMenu isLast={isLast}>
      <Menu.Item>
        <Link href={`/questions/${report.questionComment.question?.id}`}>
          <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            보기
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <div>
          <QuestionCommentReportDeleteButton report={report} />
        </div>
      </Menu.Item>
      <Menu.Item>
        <div>
          <QuestionCommentDeleteButton comment={report.questionComment} />
        </div>
      </Menu.Item>
    </DropdownMenu>
  );
}
