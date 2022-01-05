import { ApolloCache, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

export const TOGGLE_QUESTION_BLOCK_MUTATION = gql`
  mutation toggleQuestionBlock($id: Int!) {
    toggleQuestionBlock(id: $id) {
      ok
      error
    }
  }
`;

export default function QuestionBlockButton({ question }: any) {
  const router = useRouter();
  const onUpdatedBlock = (cache: ApolloCache<any>, result: any) => {
    cache.modify({
      id: `Question:${question.id}`,
      fields: {
        isBlocked(prev) {
          return !prev;
        },
      },
    });
    router.push("/");
  };

  const [toggleQuestionBlock] = useMutation(TOGGLE_QUESTION_BLOCK_MUTATION, {
    variables: {
      id: question.id,
    },
    update: onUpdatedBlock,
  });

  const onBlockClick = () => {
    toggleQuestionBlock();
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
