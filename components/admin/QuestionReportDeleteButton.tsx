import { gql, useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
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
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionReportDeleteButton({
  report,
  fontSize,
  setOpen,
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
    if (setOpen) {
      setOpen(false);
    }
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
      className={`${
        fontSize ? fontSize : " text-sm"
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
      onClick={onDeleteClick}
    >
      신고 삭제
    </button>
  );
}
