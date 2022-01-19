import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { routes } from "../../src/routes";
import { deleteQuestion } from "../../src/__generated__/deleteQuestion";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";

const DELETE_QUESTION_MUTATION = gql`
  mutation deleteQuestion($id: Int!) {
    deleteQuestion(id: $id) {
      ok
      error
    }
  }
`;

interface IquestionDeleteButton {
  question: showQuestions_showQuestions;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionDeleteButton({
  question,
  fontSize,
  setOpen,
}: IquestionDeleteButton) {
  const router = useRouter();

  const deleteQuestionCache = () => {
    apolloClient.cache.evict({
      id: `Question:${question.id}`,
    });
    apolloClient.cache.gc();
    if (
      router.pathname !== routes.adminReport &&
      router.pathname !== "/users/[id]" &&
      router.pathname !== routes.home
    ) {
      router.push(routes.home);
    }
    if (setOpen) {
      setOpen(false);
    }
  };

  const onCompleted = (data: deleteQuestion) => {
    if (data.deleteQuestion.ok) {
      deleteQuestionCache();
      apolloClient.cache.modify({
        id: `User:${question.user?.id}`,
        fields: {
          totalQuestions(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteQuestionMutation, { loading }] = useMutation<deleteQuestion>(
    DELETE_QUESTION_MUTATION,
    {
      variables: {
        id: question.id,
      },
      onCompleted,
    }
  );

  const onDeleteClick = () => {
    if (window.confirm("해당 글을 삭제하시겠습니까?")) {
      deleteQuestionMutation();
    }
  };

  return (
    <button
      className={`${fontSize ? fontSize : "text-sm"} ${
        loading ? "pointer-events-none bg-gray-100" : ""
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
      onClick={onDeleteClick}
    >
      {loading ? "콘텐츠 삭제중..." : "콘텐츠 삭제"}
    </button>
  );
}
