import { Dispatch, Fragment, SetStateAction } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { focusedCommentVar } from "../../src/utils/questionComments.utils";
import { loginUserVar } from "../../src/utils/auth.utils";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import QuestionCommentDeleteButton from "./QuestionCommentDeleteButton";
import QuestionCommentEditButton from "./QuestionCommentEditButton";
import QuestionCommentBlockButton from "./QuestionCommentBlockButton";

interface IquestionCommentDropdown {
  comment: showQuestionComments_showQuestionComments;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentDropdown({
  comment,
  setEditable,
  setReportOpen,
}: IquestionCommentDropdown) {
  const loginUser = loginUserVar();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center p-1 text-gray-400 rounded-full hover:text-gray-600 focus:outline-none active:bg-gray-200 hover:bg-gray-100">
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
          focusedCommentVar(comment.id);
        }}
        afterLeave={() => {
          focusedCommentVar(null);
        }}
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {loginUser?.id === comment.user.id ? (
              <>
                <Menu.Item>
                  <div>
                    <QuestionCommentEditButton
                      comment={comment}
                      setEditable={setEditable}
                    />
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div>
                    <QuestionCommentDeleteButton comment={comment} />
                  </div>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item>
                  <div>
                    <QuestionCommentBlockButton comment={comment} />
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
                    onClick={() => {
                      setReportOpen(true);
                    }}
                  >
                    댓글 신고
                  </button>
                </Menu.Item>
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
