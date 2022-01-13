import { ApolloCache, gql, useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import { updateQuestionComment } from "../../src/__generated__/updateQuestionComment";

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

interface IupdateQuestionCommentForm {
  comment: showQuestionComments_showQuestionComments;
  setEditable: Dispatch<SetStateAction<boolean>>;
}

interface Icomment {
  content: string;
}

export default function UpdateQuestionCommentForm({
  comment,
  setEditable,
}: IupdateQuestionCommentForm) {
  const { register, handleSubmit, setValue, watch } = useForm<Icomment>({
    mode: "onChange",
    defaultValues: {
      content: comment.content,
    },
  });
  const onUpdateQuestionComment = (
    cache: ApolloCache<showQuestionComments_showQuestionComments>
  ) => {
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
  const [updateQuestionCommentMutation, { loading }] =
    useMutation<updateQuestionComment>(UPDATE_QUESTION_COMMENT_MUTATION, {
      update: onUpdateQuestionComment,
    });
  const onSubmitValid = (data: Icomment) => {
    updateQuestionCommentMutation({
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

  return (
    <>
      <div className="mt-2">
        <TextareaAutosize
          {...register("content", {
            required: "내용은 필수 항목입니다.",
          })}
          id="content"
          name="content"
          minRows={2}
          className="block w-full border-gray-300 rounded-md shadow-sm resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {loading ? "저장 중..." : "수정"}
        </button>
      </div>
    </>
  );
}
