import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import { loginUserVar } from "../../src/utils/auth.utils";
import { focusedQuestionVar } from "../../src/utils/questions.utils";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import NoImage from "../NoImage";
import QuestionDropdown from "./QuestionDropdown";
import QuestionReportModal from "./QuestionReportModal";

interface Iquestion {
  question: showQuestions_showQuestions;
  showBlocked: boolean;
}

export default function Question({ question, showBlocked }: Iquestion) {
  const loginUser = loginUserVar();
  const focusedQuestion = useReactiveVar(focusedQuestionVar);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div>
      {question.isBlocked && showBlocked ? (
        <>
          <div className="relative w-full shadow-md rounded-2xl aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3 group">
            {loginUser && (
              <div className="absolute bottom-0 right-0 z-10 flex">
                <div
                  className={`${
                    focusedQuestion === question.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } p-3 hidden lg:block`}
                >
                  <QuestionDropdown
                    question={question}
                    setReportOpen={setReportOpen}
                  />
                </div>
              </div>
            )}
            {question.image?.Location ? (
              <img
                src={question.image?.Location}
                alt={question.content}
                className="object-cover object-center w-full h-full blur-md"
              />
            ) : (
              <NoImage title={question.content} className="blur-md" />
            )}
          </div>
          <div className="flex items-start justify-between">
            <div className="py-3 text-sm italic font-medium text-gray-600">
              사용자에 의해 숨겨진 콘텐츠입니다
            </div>
            <div className="relative z-10 lg:hidden">
              <QuestionDropdown
                question={question}
                setReportOpen={setReportOpen}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full shadow-md rounded-2xl aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3 group">
            {loginUser && (
              <div className="absolute z-10 flex bottom-3 right-3">
                <div
                  className={`${
                    focusedQuestion === question.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } bg-opacity-10 sm:bg-gray-100 rounded-full hidden lg:block`}
                >
                  <QuestionDropdown
                    question={question}
                    setReportOpen={setReportOpen}
                  />
                </div>
              </div>
            )}

            <Link href="/questions/[id]" as={`/questions/${question.id}`}>
              <a>
                <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-0 rounded-2xl group-hover:bg-opacity-50"></div>
                {question.image?.Location ? (
                  <img
                    src={question.image?.Location}
                    alt={question.content}
                    className="object-cover object-center w-full h-full rounded-2xl"
                  />
                ) : (
                  <NoImage title={question.content} className="rounded-2xl" />
                )}
              </a>
            </Link>
          </div>
          <div className="relative flex items-center justify-between">
            <Link href="/questions/[id]" as={`/questions/${question.id}`}>
              <a>
                <div className="py-3 text-sm font-medium text-gray-900">
                  <LinesEllipsis
                    text={question.content}
                    maxLine="2"
                    ellipsis="..."
                  />
                </div>
              </a>
            </Link>
            <div className="relative z-10 lg:hidden">
              <QuestionDropdown
                question={question}
                setReportOpen={setReportOpen}
              />
            </div>
          </div>
        </>
      )}

      {loginUser && (
        <QuestionReportModal
          question={question}
          reportOpen={reportOpen}
          setReportOpen={setReportOpen}
        />
      )}
    </div>
  );
}
