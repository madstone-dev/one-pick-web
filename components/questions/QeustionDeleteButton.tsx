import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
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
}

export default function QuestionDeleteButton({
  question,
}: IquestionDeleteButton) {
  const router = useRouter();
  const deleteQuestionCache = () => {
    apolloClient.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "showQuestions",
      args: {
        id: question.id,
      },
    });
    apolloClient.cache.gc();
    router.push(routes.home);
  };

  const [deleteQuestionMutation, { loading: deleteLoading }] =
    useMutation<deleteQuestion>(DELETE_QUESTION_MUTATION, {
      variables: {
        id: question.id,
      },
      onCompleted: () => deleteQuestionCache(),
    });

  const onDeleteClick = () => {
    if (window.confirm("해당 글을 삭제하시겠습니까?")) {
      deleteQuestionMutation();
    }
  };

  return (
    <button
      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
      onClick={onDeleteClick}
    >
      {deleteLoading ? "삭제중..." : "콘텐츠 삭제"}
    </button>
  );
}
