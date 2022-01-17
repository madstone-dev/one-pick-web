import { Dispatch, Fragment, SetStateAction } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { focusedQuestionVar } from "../../src/utils/questions.utils";
import QuestionBlockButton from "./QuestionBlockButton";
import QuestionDeleteButton from "./QeustionDeleteButton";
import Link from "next/link";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";

interface IquestionDropdown {
  question: showQuestions_showQuestions;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionDropdown({
  question,
  setReportOpen,
}: IquestionDropdown) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center p-2 rounded-full sm:text-gray-600 bg-opacity-10 hover:bg-gray-100 sm:hover:text-gray-700 focus:outline-none">
          <span className="sr-only">Open options</span>
          <DotsVerticalIcon
            className="w-4 h-4 rotate-90 lg:w-5 lg:h-5"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        afterEnter={() => {
          focusedQuestionVar(question.id);
        }}
        afterLeave={() => {
          focusedQuestionVar(null);
        }}
      >
        <Menu.Items className="absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
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
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
