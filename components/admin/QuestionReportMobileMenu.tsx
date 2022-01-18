import { useState } from "react";
import Link from "next/link";
import { showQuestionReports_showQuestionReports_reports } from "../../src/__generated__/showQuestionReports";
import QuestionReportDeleteButton from "./QuestionReportDeleteButton";
import QuestionDeleteButton from "../questions/QeustionDeleteButton";
import MobileMenu from "../MobileMenu";

interface IquestionReportMobileMenu {
  report: showQuestionReports_showQuestionReports_reports;
}

export default function QuestionReportMobileMenu({
  report,
}: IquestionReportMobileMenu) {
  const [open, setOpen] = useState(false);

  return (
    <MobileMenu title="신고 게시글 메뉴" open={open} setOpen={setOpen}>
      <li className="w-full">
        <Link href={`/questions/${report.question?.id}`}>
          <a className="block w-full px-4 py-2 text-base font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            보기
          </a>
        </Link>
      </li>
      <li className="w-full">
        <div>
          <QuestionReportDeleteButton
            report={report}
            fontSize="text-base font-medium"
            setOpen={setOpen}
          />
        </div>
      </li>
      <li className="w-full">
        <div>
          <QuestionDeleteButton
            question={report.question}
            fontSize="text-base font-medium"
            setOpen={setOpen}
          />
        </div>
      </li>
    </MobileMenu>
  );
}
