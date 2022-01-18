import { Dispatch, SetStateAction } from "react";
import { Menu } from "@headlessui/react";
import { focusedQuestionVar } from "../../src/utils/questions.utils";
import QuestionBlockButton from "./QuestionBlockButton";
import QuestionDeleteButton from "./QeustionDeleteButton";
import Link from "next/link";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import DropdownMenu from "../DropdownMenu";

interface IquestionDropdown {
  question: showQuestions_showQuestions;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionDropdown({
  question,
  setReportOpen,
}: IquestionDropdown) {
  const afterEnter = () => {
    focusedQuestionVar(question.id);
  };

  const afterLeave = () => {
    focusedQuestionVar(null);
  };

  return (
    <DropdownMenu afterEnter={afterEnter} afterLeave={afterLeave}>
      {question.isMine ? (
        <>
          <Menu.Item>
            <Link href={`/questions/${question?.id}/edit`}>
              <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
                콘텐츠 수정
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <div>
              <QuestionDeleteButton question={question} />
            </div>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item>
            <div>
              <QuestionBlockButton question={question} />
            </div>
          </Menu.Item>
          {!question.isBlocked && (
            <Menu.Item>
              <button
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
                onClick={() => {
                  setReportOpen(true);
                }}
              >
                콘텐츠 신고
              </button>
            </Menu.Item>
          )}
        </>
      )}
    </DropdownMenu>
  );
}
