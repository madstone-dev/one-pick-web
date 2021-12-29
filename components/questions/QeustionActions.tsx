import { gql, useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { apolloClient } from "../../src/apolloClient";
import { routes } from "../../src/routes";

const DELETE_QUESTION_MUTATION = gql`
  mutation DeleteQuestion($id: Int!) {
    deleteQuestion(id: $id) {
      ok
      error
    }
  }
`;

export default function QuestionActions({ question }: any) {
  const router = useRouter();
  const deleteQuestionCache = (redirect: boolean) => {
    apolloClient.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "showQuestions",
      args: {
        id: question.id,
      },
    });
    apolloClient.cache.gc();
    if (redirect) {
      router.push(routes.home);
    }
  };

  const [deleteQuestion, { loading: deleteLoading }] = useMutation(
    DELETE_QUESTION_MUTATION,
    {
      variables: {
        id: question.id,
      },
      onCompleted: () => deleteQuestionCache(true),
    }
  );

  const onDeleteClick = () => {
    if (!window.confirm("해당 글을 삭제하시겠습니까?")) {
      return;
    }
    deleteQuestion();
  };

  return (
    <div className="flex items-center justify-end w-full mb-3">
      {question.isMine ? (
        <div className="flex items-center justify-between">
          {!deleteLoading && (
            <Link href={`/questions/${question?.id}/edit`}>
              <a className="inline-flex mr-2 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                수정
              </a>
            </Link>
          )}
          <button
            onClick={onDeleteClick}
            type="button"
            className={`${
              deleteLoading && "pointer-events-none"
            } inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            {deleteLoading ? "삭제중..." : "삭제"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="inline-flex mr-2 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            차단
          </button>
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            신고
          </button>
        </div>
      )}
    </div>
  );
}
