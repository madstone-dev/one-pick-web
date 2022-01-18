import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { createQuestionCommentReport } from "../../src/__generated__/createQuestionCommentReport";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import ReportModal from "../ReportModal";

const REPORT_QUESTION_COMMENT_MUTATION = gql`
  mutation createQuestionCommentReport($id: Int!, $type: Int!) {
    createQuestionCommentReport(id: $id, type: $type) {
      ok
      error
    }
  }
`;

interface IquestionCommentReportModal {
  comment: showQuestionComments_showQuestionComments;
  reportOpen: boolean;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentReportModal({
  comment,
  reportOpen,
  setReportOpen,
}: IquestionCommentReportModal) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [reportQuestionCommentMutation] =
    useMutation<createQuestionCommentReport>(REPORT_QUESTION_COMMENT_MUTATION);

  useEffect(() => {
    setReportOpen(open);
  }, [open, setReportOpen]);

  useEffect(() => {
    if (reportOpen) {
      setOpen(reportOpen);
    }
  }, [reportOpen]);

  const onSubmit = () => {
    if (type) {
      reportQuestionCommentMutation({
        variables: {
          id: comment.id,
          type: parseInt(type),
        },
      });
    }
    setOpen(false);
    alert("신고 완료");
  };

  return (
    <ReportModal
      title="댓글 신고"
      type={type}
      setType={setType}
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
    />
  );
}
