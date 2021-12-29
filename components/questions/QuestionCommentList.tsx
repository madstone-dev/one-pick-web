import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { isQuestionCommentLoadFinishVar } from "../../src/utils/questionComments.utils";
import QuestionCommentForm from "./QuestionCommentForm";

const SHOW_QUESTION_COMMENTS_QUERY = gql`
  query Query($id: Int!, $take: Int, $lastId: Int) {
    showQuestionComments(id: $id, take: $take, lastId: $lastId) {
      id
      user {
        id
        email
        username
        avatar
        isBlocked
      }
      content
      isBlocked
      pick
    }
  }
`;

export default function QuestionCommentList({ question }: any) {
  const loader = useRef(null);
  const [take, setTake] = useState(20);
  const { data, loading, fetchMore, refetch } = useQuery(
    SHOW_QUESTION_COMMENTS_QUERY,
    {
      variables: {
        id: question.id,
        take,
      },
      onCompleted: () => {
        isQuestionCommentLoadFinishVar(false);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const handleObserver = useCallback(
    (entries) => {
      const loadFinish = isQuestionCommentLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.showQuestionComments && target.isIntersecting) {
        const lastId =
          data?.showQuestionComments[data.showQuestionComments.length - 1]?.id;
        fetchMore({
          variables: {
            take,
            lastId,
          },
        });
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
      <QuestionCommentForm question={question} refetch={refetch} />
      <div>
        {data?.showQuestionComments?.map((comment: any) => (
          <div key={comment.id} className="py-6">
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
              <div className="ml-4">
                <h4>
                  <span className="text-sm font-bold text-gray-900">
                    {comment.user.username}
                  </span>
                  <span className="ml-3 text-xs">한 시간 전</span>
                </h4>
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
                <div className="mt-2 text-base text-gray-600 6">
                  {comment.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={loader} />
    </div>
  );
}
