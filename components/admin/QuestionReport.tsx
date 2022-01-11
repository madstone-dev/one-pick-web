import moment from "moment";
import "moment/locale/ko";
import { reportTypes } from "../../src/utils/utils";
import { showQuestionReports_showQuestionReports_reports } from "../../src/__generated__/showQuestionReports";
import NoImage from "../NoImage";
import QuestionReportDropdown from "./QuestionReportDropdown";

interface IquestionReport {
  report: showQuestionReports_showQuestionReports_reports;
}

export default function QuestionReport({ report }: IquestionReport) {
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
            {report.question.image?.Location ? (
              <img
                src={report.question.image?.Location}
                alt={report.question.content}
                className="object-cover object-center w-10 h-10 rounded-md"
              />
            ) : (
              <NoImage title={report.question.content} />
            )}
          </div>
          <div className="flex-1 ml-4">
            <div className="text-sm font-medium text-gray-900 break-all">
              {report.question.content}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {reportLabel?.label}
            </div>

            <div className="flex items-center justify-between mt-2 md:hidden">
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {createdAt}
              </div>
              <div className="relative flex text-sm font-medium whitespace-nowrap">
                <QuestionReportDropdown report={report} />
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
          <QuestionReportDropdown report={report} />
        </div>
      </td>
    </tr>
  );
}
