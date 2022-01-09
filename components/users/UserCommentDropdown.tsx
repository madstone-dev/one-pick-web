import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { focusedCommentVar } from "../../src/utils/questionComments.utils";
import { ApolloCache, useMutation } from "@apollo/client";
import { apolloClient } from "../../src/apolloClient";
import { classNames } from "../../src/utils/utils";
import { loginUserVar } from "../../src/utils/auth.utils";
import {
  DELETE_QUESTION_COMMENT_MUTATION,
  TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION,
} from "../questions/QuestionCommentDropdown";
import { deleteQuestionComment } from "../../src/__generated__/deleteQuestionComment";
import { toggleQuestionCommentBlock } from "../../src/__generated__/toggleQuestionCommentBlock";
import { myQuestionComments_me_questionComments } from "../../src/__generated__/myQuestionComments";

interface IuserCommentDropdown {
  comment: myQuestionComments_me_questionComments;
}

export default function UserCommentDropdown({ comment }: IuserCommentDropdown) {
  const loginUser = loginUserVar();
  const deleteQuestionCommentCache = () => {
    apolloClient.cache.evict({
      id: `QuestionComment:${comment.id}`,
    });
    apolloClient.cache.gc();
  };

  const [deleteQuestionCommentMutation] = useMutation<deleteQuestionComment>(
    DELETE_QUESTION_COMMENT_MUTATION,
    {
      variables: {
        id: comment.id,
      },
      onCompleted: () => deleteQuestionCommentCache(),
    }
  );

  const onDeleteClick = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteQuestionCommentMutation();
    }
  };

  const onUpdatedCommentBlock = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `QuestionComment:${comment.id}`,
      fields: {
        isBlocked(prev) {
          return !prev;
        },
      },
    });
  };

  const [toggleQuestionCommentBlockMutation] =
    useMutation<toggleQuestionCommentBlock>(
      TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION,
      {
        variables: {
          id: comment.id,
        },
        update: onUpdatedCommentBlock,
      }
    );

  const onBlockClick = () => {
    toggleQuestionCommentBlockMutation();
  };

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
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm w-full whitespace-nowrap"
                    )}
                    onClick={onDeleteClick}
                  >
                    댓글 삭제
                  </button>
                )}
              </Menu.Item>
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm w-full whitespace-nowrap"
                    )}
                    onClick={onBlockClick}
                  >
                    댓글 숨기기 {comment.isBlocked && "해제"}
                  </button>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
