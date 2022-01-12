import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef } from "react";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import { loginUserVar } from "../../src/utils/auth.utils";
import { loadContentFinishVar } from "../../src/utils/utils";
import { showQuestion_showQuestion } from "../../src/__generated__/showQuestion";
import { showQuestionComments } from "../../src/__generated__/showQuestionComments";
import QuestionComment from "./QuestionComment";
import QuestionCommentForm from "./QuestionCommentForm";

const SHOW_QUESTION_COMMENTS_QUERY = gql`
  query showQuestionComments($id: Int!, $lastId: Int) {
    showQuestionComments(id: $id, lastId: $lastId) {
      ...ShowQuestionCommentFragment
    }
  }
  ${SHOW_QUESTION_COMMENT_FRAGMENT}
`;

interface IquestionCommentList {
  question: showQuestion_showQuestion;
}

export default function QuestionCommentList({
  question,
}: IquestionCommentList) {
  const loginUser = loginUserVar();
  const loader = useRef(null);
  const { data, fetchMore, refetch } = useQuery<showQuestionComments>(
    SHOW_QUESTION_COMMENTS_QUERY,
    {
      variables: {
        id: question.id,
      },
      onCompleted: () => {
        loadContentFinishVar(false);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = loadContentFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.showQuestionComments && target.isIntersecting) {
        const lastId =
          data?.showQuestionComments[data.showQuestionComments.length - 1]?.id;
        const more = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.showQuestionComments?.length === 0) {
          loadContentFinishVar(true);
        }
      }
    },
    [data, fetchMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [handleObserver]);

  return (
    <div className="flow-root">
      {loginUser && (
        <QuestionCommentForm question={question} refetch={refetch} />
      )}
      <div>
        {data?.showQuestionComments?.map(
          (comment) =>
            comment && (
              <QuestionComment
                key={comment.id}
                question={question}
                comment={comment}
              />
            )
        )}
      </div>
      <div ref={loader} />
    </div>
  );
}
