import { gql, useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { deleteQuestionCommentReport } from "../../src/__generated__/deleteQuestionCommentReport";
import { showQuestionCommentReports_showQuestionCommentReports_reports } from "../../src/__generated__/showQuestionCommentReports";

const DELETE_QUESTION_COMMENT_REPORT = gql`
  mutation deleteQuestionCommentReport($id: Int!) {
    deleteQuestionCommentReport(id: $id) {
      ok
      error
    }
  }
`;

interface IquestionCommentReportDeleteButton {
  report: showQuestionCommentReports_showQuestionCommentReports_reports;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentReportDeleteButton({
  report,
  fontSize,
  setOpen,
}: IquestionCommentReportDeleteButton) {
  const deleteQuestionCache = () => {
    apolloClient.cache.evict({
      id: `QuestionCommentReport:${report.id}`,
    });
    apolloClient.cache.modify({
      id: "ROOT_QUERY",
      fields: {
        showQuestionCommentReports(prev) {
          return { ...prev, totalReports: prev.totalReports - 1 };
        },
      },
    });
    apolloClient.cache.gc();
    if (setOpen) {
      setOpen(false);
    }
  };

  const onCompleted = (data: deleteQuestionCommentReport) => {
    if (data.deleteQuestionCommentReport.ok) {
      deleteQuestionCache();
    } else {
      alert("삭제 실패");
    }
  };

  const [deleteQuestionCommentReportMutation, { loading }] =
    useMutation<deleteQuestionCommentReport>(DELETE_QUESTION_COMMENT_REPORT, {
      variables: {
        id: report.id,
      },
      onCompleted,
    });

  const onDeleteClick = () => {
    const ok = window.confirm("해당 리포트를 삭제하시겠습니까?");
    if (ok) {
      deleteQuestionCommentReportMutation();
      deleteQuestionCache();
    }
  };

  return (
    <button
      className={`${fontSize ? fontSize : "text-sm"} ${
        loading ? "pointer-events-none bg-gray-100" : ""
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
      onClick={onDeleteClick}
    >
      신고 삭제{loading && "중..."}
    </button>
  );
}
