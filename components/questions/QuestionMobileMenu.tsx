import { Dispatch, SetStateAction, useState } from "react";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import Link from "next/link";
import QuestionDeleteButton from "./QeustionDeleteButton";
import QuestionBlockButton from "./QuestionBlockButton";
import MobileMenu from "../MobileMenu";

interface IquestionMobileMenu {
  question: showQuestions_showQuestions;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionMobileMenu({
  question,
  setReportOpen,
}: IquestionMobileMenu) {
  const [open, setOpen] = useState(false);
  const [isClickReport, setIsClickReport] = useState(false);
  const onReportOpen = () => {
    setOpen(false);
    setIsClickReport(true);
  };

  const shouldOpenReport = () => {
    if (isClickReport) {
      setReportOpen(true);
      setIsClickReport(false);
    }
  };

  return (
    <MobileMenu
      title="콘텐츠 메뉴"
      afterLeave={shouldOpenReport}
      open={open}
      setOpen={setOpen}
    >
      {question.isMine ? (
        <>
          <li className="w-full">
            <Link href={`/questions/${question?.id}/edit`}>
              <a className="block w-full px-4 py-2 text-base font-semibold text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
                콘텐츠 수정
              </a>
            </Link>
          </li>
          <li className="w-full">
            <div>
              <QuestionDeleteButton
                question={question}
                fontSize="text-base font-semibold"
                setOpen={setOpen}
              />
            </div>
          </li>
        </>
      ) : (
        <>
          <li className="w-full">
            <div>
              <QuestionBlockButton
                question={question}
                fontSize="text-base font-semibold"
                setOpen={setOpen}
              />
            </div>
          </li>
          {!question.isBlocked && (
            <li className="w-full">
              <button
                className="block w-full px-4 py-2 text-base font-semibold text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
                onClick={onReportOpen}
              >
                콘텐츠 신고
              </button>
            </li>
          )}
        </>
      )}
    </MobileMenu>
  );
}
