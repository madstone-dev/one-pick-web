import { ApolloCache, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { routes } from "../../src/routes";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import { toggleQuestionBlock } from "../../src/__generated__/toggleQuestionBlock";

export const TOGGLE_QUESTION_BLOCK_MUTATION = gql`
  mutation toggleQuestionBlock($id: Int!) {
    toggleQuestionBlock(id: $id) {
      ok
      error
    }
  }
`;

interface IquestionBlockButton {
  question: showQuestions_showQuestions;
}

export default function QuestionBlockButton({
  question,
}: IquestionBlockButton) {
  const router = useRouter();
  const onUpdatedBlock = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Question:${question.id}`,
      fields: {
        isBlocked(prev) {
          return !prev;
        },
      },
    });
    if (router.pathname === "/questions/[id]") {
      router.push(routes.home);
    }
  };

  const [toggleQuestionBlockMutation] = useMutation<toggleQuestionBlock>(
    TOGGLE_QUESTION_BLOCK_MUTATION,
    {
      variables: {
        id: question.id,
      },
      update: onUpdatedBlock,
    }
  );

  const onBlockClick = () => {
    toggleQuestionBlockMutation();
  };

  return (
    <button
      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
      onClick={onBlockClick}
    >
      {question.isBlocked ? "숨기기 해제" : "콘텐츠 숨기기"}
    </button>
  );
}
