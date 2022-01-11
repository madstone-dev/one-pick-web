import moment from "moment";
import "moment/locale/ko";
import { getAvatar } from "../../src/utils/auth.utils";
import { reportTypes } from "../../src/utils/utils";
import { showQuestionCommentReports_showQuestionCommentReports_reports } from "../../src/__generated__/showQuestionCommentReports";
import QuestionCommentReportDropdown from "./QuestionCommentReportDropdown";

interface IquestionReport {
  report: showQuestionCommentReports_showQuestionCommentReports_reports;
}

export default function QuestionCommentReport({ report }: IquestionReport) {
  const reportLabel = reportTypes.find(
    (type) => Number(type.value) === Number(report.type)
  );
  const createdAt = moment(
    moment.unix(Number(report.createdAt) / 1000)
  ).fromNow();
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              src={
                report.questionComment.user.avatar?.Location ||
                getAvatar(report.questionComment.user.username)
              }
              alt={report.questionComment.user.username}
              className="object-cover object-center w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1 ml-4">
            <div className="text-sm font-medium text-gray-900 break-all">
              {report.questionComment.content}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {reportLabel?.label}
            </div>

            <div className="flex items-center justify-between mt-2 md:hidden">
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {createdAt}
              </div>
              <div className="relative flex text-sm font-medium whitespace-nowrap">
                <QuestionCommentReportDropdown report={report} />
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:table-cell">
        {createdAt}
      </td>
      <td className="hidden px-6 py-4 text-sm font-medium whitespace-nowrap md:table-cell">
        <div className="relative flex justify-end">
          <QuestionCommentReportDropdown report={report} />
        </div>
      </td>
    </tr>
  );
}
