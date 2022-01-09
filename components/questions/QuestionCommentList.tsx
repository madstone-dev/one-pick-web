import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import { loginUserVar } from "../../src/utils/auth.utils";
import { isQuestionCommentLoadFinishVar } from "../../src/utils/questionComments.utils";
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

export default function QuestionCommentList({ question }: any) {
  const loginUser = loginUserVar();
  const loader = useRef(null);
  const { data, fetchMore, refetch } = useQuery(SHOW_QUESTION_COMMENTS_QUERY, {
    variables: {
      id: question.id,
    },
    onCompleted: () => {
      isQuestionCommentLoadFinishVar(false);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = isQuestionCommentLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.showQuestionComments && target.isIntersecting) {
        const lastId =
          data?.showQuestionComments[data.showQuestionComments.length - 1]?.id;
        const more: any = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (more?.data?.showQuestionComments?.length === 0) {
          isQuestionCommentLoadFinishVar(true);
        }
      }
    },
    [data]
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
        {data?.showQuestionComments?.map((comment: any) => (
          <QuestionComment
            key={comment.id}
            question={question}
            comment={comment}
          />
        ))}
      </div>
      <div ref={loader} />
    </div>
  );
}
