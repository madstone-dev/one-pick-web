/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { focusedQuestionVar } from "../../src/utils/questions.utils";
import QuestionBlockButton from "./QuestionBlockButton";
import QuestionReportModal from "./QuestionReportModal";
import QuestionDeleteButton from "./QeustionDeleteButton";
import Link from "next/link";

export default function QuestionDropdown({ question }: any) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center p-2 rounded-full sm:text-gray-600 bg-opacity-10 hover:bg-gray-100 sm:hover:text-gray-700 focus:outline-none">
          <span className="sr-only">Open options</span>
          <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {question.isMine ? (
              <>
                <Menu.Item>
                  <Link href={`/questions/${question?.id}/edit`}>
                    <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      콘텐츠 수정
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <QuestionDeleteButton question={question} />
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item>
                  <QuestionBlockButton question={question} />
                </Menu.Item>
                {!question.isBlocked && (
                  <Menu.Item>
                    <QuestionReportModal question={question} />
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
