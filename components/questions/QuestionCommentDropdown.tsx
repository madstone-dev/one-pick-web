import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  DotsVerticalIcon,
  PencilAltIcon,
  TrashIcon,
  BanIcon,
  FlagIcon,
} from "@heroicons/react/solid";
import {
  editingCommentVar,
  focusedCommentVar,
} from "../../src/utils/questionComments.utils";
import { ApolloCache, gql, useMutation } from "@apollo/client";
import { apolloClient } from "../../src/apolloClient";
import { loginUserVar } from "../../src/utils/auth.utils";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const DELETE_QUESTION_COMMENT_MUTATION = gql`
  mutation deleteQuestionComment($id: Int!) {
    deleteQuestionComment(id: $id) {
      ok
      error
    }
  }
`;

const TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION = gql`
  mutation toggleQuestionCommentBlock($id: Int!) {
    toggleQuestionCommentBlock(id: $id) {
      ok
      error
    }
  }
`;

export default function QuestionCommentDropdown({
  comment,
  setEditable,
  setReportOpen,
}: any) {
  const loginUser = loginUserVar();
  const deleteQuestionCommentCache = () => {
    apolloClient.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "showQuestionComments",
      args: {
        id: comment.id,
      },
    });
    apolloClient.cache.gc();
  };

  const [deleteQuestionComment] = useMutation(
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
      deleteQuestionComment();
    }
  };

  const onUpdatedCommentBlock = (cache: ApolloCache<any>, result: any) => {
    cache.modify({
      id: `QuestionComment:${comment.id}`,
      fields: {
        isBlocked(prev) {
          return !prev;
        },
      },
    });
  };

  const [toggleQuestionCommentBlock] = useMutation(
    TOGGLE_QUESTION_COMMENT_BLOCK_MUTATION,
    {
      variables: {
        id: comment.id,
      },
      update: onUpdatedCommentBlock,
    }
  );

  const onBlockClick = () => {
    toggleQuestionCommentBlock();
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
        <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {loginUser?.id === comment.user.id ? (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        editingCommentVar(comment.id);
                        setEditable(true);
                      }}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex items-center px-4 py-2 text-sm w-full"
                      )}
                    >
                      <PencilAltIcon
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      수정
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex items-center px-4 py-2 text-sm w-full"
                      )}
                      onClick={onDeleteClick}
                    >
                      <TrashIcon
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      삭제
                    </button>
                  )}
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex items-center px-4 py-2 text-sm w-full"
                      )}
                      onClick={onBlockClick}
                    >
                      <BanIcon
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      차단 {comment.isBlocked && "해제"}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex items-center px-4 py-2 text-sm w-full"
                      )}
                      onClick={() => {
                        setReportOpen(true);
                      }}
                    >
                      <FlagIcon
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      신고
                    </button>
                  )}
                </Menu.Item>
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
