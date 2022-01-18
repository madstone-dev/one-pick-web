import moment from "moment";
import "moment/locale/ko";
import { reportTypes } from "../../src/utils/utils";
import { showQuestionReports_showQuestionReports_reports } from "../../src/__generated__/showQuestionReports";
import QuestionReportDropdown from "./QuestionReportDropdown";
import QuestionReportMobileMenu from "./QuestionReportMobileMenu";

interface IquestionReport {
  report: showQuestionReports_showQuestionReports_reports;
  isLast: boolean;
}

export default function QuestionReport({ report, isLast }: IquestionReport) {
  const reportLabel = reportTypes.find(
    (type) => Number(type.value) === Number(report.type)
  );
  const createdAt = moment(
    moment.unix(Number(report.createdAt) / 1000)
  ).fromNow();
  return (
    <div>
      <div className="flex items-start px-4 py-4 sm:px-6">
        <div className="flex items-start flex-1 min-w-0">
          <div className="flex-shrink-0">
            <img
              src={report.question.image?.Location}
              alt={report.question.content}
              className="object-cover object-center w-12 h-12 rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {report.question.content}
              </p>
              <p className="flex items-center mt-2 text-sm text-gray-500">
                <span className="truncate">{reportLabel?.label}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div>
                <p className="flex items-center mt-2 text-sm text-gray-500">
                  {createdAt}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <QuestionReportDropdown report={report} isLast={isLast} />
        </div>
        <div className="block lg:hidden">
          <QuestionReportMobileMenu report={report} />
        </div>
      </div>
    </div>
  );
}
