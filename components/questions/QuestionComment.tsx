import { ApolloCache, gql, useMutation, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  editingCommentVar,
  focusedCommentVar,
} from "../../src/utils/questionComments.utils";
import QuestionCommentDropdown from "./QuestionCommentDropdown";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import moment from "moment";
import QuestionCommentReportModal from "./QuestionCommentReportModal";
import { loginUserVar } from "../../src/utils/auth.utils";

const UPDATE_QUESTION_COMMENT_MUTATION = gql`
  mutation updateQuestionComment($id: Int!, $content: String!) {
    updateQuestionComment(id: $id, content: $content) {
      ok
      error
      comment {
        ...ShowQuestionCommentFragment
      }
    }
  }
  ${SHOW_QUESTION_COMMENT_FRAGMENT}
`;

export default function QuestionComment({ question, comment }: any) {
  moment.locale();
  const createdAt = moment(moment.unix(comment.createdAt / 1000)).fromNow();
  const loginUser = loginUserVar();
  const focusedComment = useReactiveVar(focusedCommentVar);
  const editingComment = useReactiveVar(editingCommentVar);
  const [editable, setEditable] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      content: comment.content,
    },
  });
  const onUpdateQuestionComment = (cache: ApolloCache<any>, result: any) => {
    cache.modify({
      id: `QuestionComment:${comment.id}`,
      fields: {
        content() {
          return watch("content");
        },
      },
    });
    setEditable(false);
  };
  const [updateQuestionComment, { loading }] = useMutation(
    UPDATE_QUESTION_COMMENT_MUTATION,
    {
      update: onUpdateQuestionComment,
    }
  );
  const onSubmitValid = (data: any) => {
    updateQuestionComment({
      variables: {
        id: comment.id,
        content: data.content,
      },
    });
  };

  const onCancelClick = () => {
    setValue("content", comment.content);
    setEditable(false);
  };

  useEffect(() => {
    if (editingComment !== comment.id) {
      setEditable(false);
    }
  }, [editingComment]);

  return (
    <div className="py-6 group">
      <div className="flex items-start">
        <img
          src={
            comment.user.avatar ||
            encodeURI(
              `https://ui-avatars.com/api/?name=${comment.user.username}&color=7F9CF5&background=EBF4FF`
            )
          }
          alt={`${comment.user.username}.`}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 ml-4">
          <h4>
            <span className="text-sm font-bold text-gray-900">
              {comment.user.username}
            </span>
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
                <>
                  <div className="mt-2">
                    <TextareaAutosize
                      {...register("content", {
                        required: "내용은 필수 항목입니다.",
                      })}
                      id="content"
                      name="content"
                      placeholder={
                        !question.myPick
                          ? "답변 선택 후 댓글을 남길 수 있습니다."
                          : "댓글을 남겨보세요."
                      }
                      minRows={2}
                      disabled={!question.myPick}
                      className={`${
                        !question.myPick && "bg-gray-100"
                      } block w-full border-gray-300 rounded-md shadow-sm resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={onCancelClick}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSubmit(onSubmitValid)}
                      disabled={loading}
                      className={`inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading && "opacity-50 pointer-events-none"
                      }`}
                    >
                      {loading ? "저장 중..." : "수정"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {loginUser && (
          <div
            className={
              focusedComment === comment.id
                ? "opacity-100"
                : "sm:opacity-0 group-hover:opacity-100"
            }
          >
            <QuestionCommentDropdown
              comment={comment}
              setEditable={setEditable}
              setReportOpen={setReportOpen}
            />
          </div>
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
