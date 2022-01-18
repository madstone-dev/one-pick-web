import { Menu } from "@headlessui/react";
import Link from "next/link";
import { showQuestionReports_showQuestionReports_reports } from "../../src/__generated__/showQuestionReports";
import QuestionDeleteButton from "../questions/QeustionDeleteButton";
import QuestionReportDeleteButton from "./QuestionReportDeleteButton";
import DropdownMenu from "../DropdownMenu";

interface IquestionReportDropdown {
  report: showQuestionReports_showQuestionReports_reports;
  isLast: boolean;
}

export default function QuestionReportDropdown({
  report,
  isLast,
}: IquestionReportDropdown) {
  return (
    <DropdownMenu isLast={isLast}>
      <Menu.Item>
        <Link href={`/questions/${report.question?.id}`}>
          <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            보기
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <div>
          <QuestionReportDeleteButton report={report} />
        </div>
      </Menu.Item>
      <Menu.Item>
        <div>
          <QuestionDeleteButton question={report.question} />
        </div>
      </Menu.Item>
    </DropdownMenu>
  );
}
