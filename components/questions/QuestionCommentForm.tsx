import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import { getAvatar, loginUserVar } from "../../src/utils/auth.utils";
import { createQuestionComment } from "../../src/__generated__/createQuestionComment";
import { showQuestion_showQuestion } from "../../src/__generated__/showQuestion";
import { apolloClient } from "../../src/apolloClient";

const CREATE_QUESTION_COMMENT_MUTATION = gql`
  mutation createQuestionComment($id: Int!, $content: String!) {
    createQuestionComment(id: $id, content: $content) {
      ok
      error
      comment {
        ...ShowQuestionCommentFragment
      }
    }
  }
  ${SHOW_QUESTION_COMMENT_FRAGMENT}
`;

interface IquestionCommentForm {
  question: showQuestion_showQuestion;
  refetch: any;
}

interface Icomment {
  content: string;
}

export default function QuestionCommentForm({
  question,
  refetch: refetchComments,
}: IquestionCommentForm) {
  const [formFocused, setFormFocused] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const loginUser = loginUserVar();

  const onCompleted = (data: createQuestionComment) => {
    if (data.createQuestionComment.ok) {
      refetchComments();
      apolloClient.cache.modify({
        id: `Question:${question.id}`,
        fields: {
          totalComments(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createQuestionCommentMutation, { loading }] =
    useMutation<createQuestionComment>(CREATE_QUESTION_COMMENT_MUTATION, {
      onCompleted,
    });

  const onSubmitValid = (data: Icomment) => {
    createQuestionCommentMutation({
      variables: {
        id: question.id,
        content: data.content,
      },
    });
    setValue("content", "");
  };

  const onCancelClick = () => {
    setValue("content", "");
    setFormFocused(false);
  };

  return (
    <div>
      <div className="flex">
        <img
          src={loginUser?.avatar?.Location || getAvatar(loginUser?.username)}
          alt={`${loginUser?.username}의 프로필`}
          className="w-10 h-10 mr-3 rounded-full"
        />
        <TextareaAutosize
          {...register("content", {
            required: "내용은 필수 항목입니다.",
          })}
          onFocus={() => setFormFocused(true)}
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
            !question.myPick ? "bg-gray-100" : ""
          } block w-full border-gray-300 rounded-md shadow-sm resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
      {formFocused && (
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
              loading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            댓글
          </button>
        </div>
      )}
    </div>
  );
}
