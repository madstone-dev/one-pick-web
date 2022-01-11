import { gql, useMutation } from "@apollo/client";
import { apolloClient } from "../../src/apolloClient";
import { deleteQuestionReport } from "../../src/__generated__/deleteQuestionReport";
import { showQuestionReports_showQuestionReports_reports } from "../../src/__generated__/showQuestionReports";

const DELETE_QUESTION_REPORT = gql`
  mutation deleteQuestionReport($id: Int!) {
    deleteQuestionReport(id: $id) {
      ok
      error
    }
  }
`;

interface IquestionReportDeleteButton {
  report: showQuestionReports_showQuestionReports_reports;
}

export default function QuestionReportDeleteButton({
  report,
}: IquestionReportDeleteButton) {
  const deleteQuestionCache = () => {
    apolloClient.cache.evict({
      id: `QuestionReport:${report.id}`,
    });
    apolloClient.cache.modify({
      id: "ROOT_QUERY",
      fields: {
        showQuestionReports(prev) {
          return { ...prev, totalReports: prev.totalReports - 1 };
        },
      },
    });
    apolloClient.cache.gc();
  };

  const onCompleted = (data: deleteQuestionReport) => {
    if (data.deleteQuestionReport.ok) {
      deleteQuestionCache();
    }
  };

  const [deleteQuestionReportMutation] = useMutation<deleteQuestionReport>(
    DELETE_QUESTION_REPORT,
    {
      variables: {
        id: report.id,
      },
      onCompleted,
    }
  );

  const onDeleteClick = () => {
    if (window.confirm("해당 리포트를 삭제하시겠습니까?")) {
      deleteQuestionReportMutation();
    }
  };

  return (
    <button
      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
      onClick={onDeleteClick}
    >
      신고 삭제
    </button>
  );
}
