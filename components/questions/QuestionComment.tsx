import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  editingCommentVar,
  focusedCommentVar,
} from "../../src/utils/questionComments.utils";
import QuestionCommentDropdown from "./QuestionCommentDropdown";
import QuestionCommentReportModal from "./QuestionCommentReportModal";
import { getAvatar, loginUserVar } from "../../src/utils/auth.utils";
import moment from "moment";
import "moment/locale/ko";
import Link from "next/link";
import { showQuestion_showQuestion } from "../../src/__generated__/showQuestion";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import UpdateQuestionCommentForm from "./UpdateQuestionCommentForm";
import QuestionCommentMobileMenu from "./QuestionCommentMobileMenu";

interface IquestionComment {
  question: showQuestion_showQuestion;
  comment: showQuestionComments_showQuestionComments;
}

export default function QuestionComment({
  question,
  comment,
}: IquestionComment) {
  const createdAt = moment(
    moment.unix(Number(comment.createdAt) / 1000)
  ).fromNow();
  const loginUser = loginUserVar();
  const focusedComment = useReactiveVar(focusedCommentVar);
  const editingComment = useReactiveVar(editingCommentVar);
  const [editable, setEditable] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (editingComment !== comment.id) {
      setEditable(false);
    }
  }, [editingComment, comment.id]);

  return (
    <div className="py-6 group">
      <div className="flex items-start">
        <Link href={`/users/${comment.user.id}`}>
          <a>
            <img
              src={
                comment.user.avatar?.Location ||
                getAvatar(comment.user.username)
              }
              alt={`${comment.user.username}.`}
              className="object-cover object-center w-10 h-10 rounded-full"
            />
          </a>
        </Link>
        <div className="flex-1 ml-4">
          <h4>
            <Link href={`/users/${comment.user.id}`}>
              <a>
                <span className="text-sm font-bold text-gray-900">
                  {comment.user.username}
                </span>
              </a>
            </Link>
            <span className="ml-3 text-xs">{createdAt}</span>
          </h4>
          {comment.isBlocked ? (
            <div className="text-sm italic text-gray-600">
              차단한 댓글입니다
            </div>
          ) : (
            <>
              <div className="mt-1">
                <span
                  className={`${
                    question.myPick === comment.pick
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `}
                >
                  선택{comment.pick}
                </span>
              </div>
              {!editable ? (
                <div className="mt-2 text-base text-gray-600 6">
                  {comment.content}
                </div>
              ) : (
                <UpdateQuestionCommentForm
                  comment={comment}
                  setEditable={setEditable}
                />
              )}
            </>
          )}
        </div>
        {loginUser && (
          <>
            <div
              className={`${
                focusedComment === comment.id
                  ? "opacity-100"
                  : "sm:opacity-0 group-hover:opacity-100"
              }
                hidden lg:block`}
            >
              <QuestionCommentDropdown
                comment={comment}
                setEditable={setEditable}
                setReportOpen={setReportOpen}
              />
            </div>
            <div className="block lg:hidden">
              <QuestionCommentMobileMenu
                comment={comment}
                setEditable={setEditable}
                setReportOpen={setReportOpen}
              />
            </div>
          </>
        )}
      </div>
      {loginUser && (
        <QuestionCommentReportModal
          comment={comment}
          reportOpen={reportOpen}
          setReportOpen={setReportOpen}
        />
      )}
    </div>
  );
}
