import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { createQuestionReport } from "../../src/__generated__/createQuestionReport";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import ReportModal from "../ReportModal";

const REPORT_QUESTION_MUTATION = gql`
  mutation createQuestionReport($id: Int!, $type: Int!) {
    createQuestionReport(id: $id, type: $type) {
      ok
      error
    }
  }
`;

interface IquestionReportModal {
  question: showQuestions_showQuestions;
  reportOpen: boolean;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionReportModal({
  question,
  reportOpen,
  setReportOpen,
}: IquestionReportModal) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [reportQuestionMutation, { loading }] =
    useMutation<createQuestionReport>(REPORT_QUESTION_MUTATION);

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
      reportQuestionMutation({
        variables: {
          id: question.id,
          type: parseInt(type),
        },
      });
    }
    setOpen(false);
    alert("신고 완료");
  };

  return (
    <ReportModal
      title="콘텐츠 신고"
      type={type}
      setType={setType}
      onSubmit={onSubmit}
      loading={loading}
      open={open}
      setOpen={setOpen}
    />
  );
}
