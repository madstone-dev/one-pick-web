import { useCallback, useEffect, useRef } from "react";
import { isQuestionLoadFinishVar } from "../../src/utils/questions.utils";
import {
  showUser_showUser_picks,
  showUser_showUser_questions,
} from "../../src/__generated__/showUser";
import QuestionMasonry from "../questions/QuestionMasonry";

interface IuserQuestions {
  questions:
    | (showUser_showUser_questions | showUser_showUser_picks | null)[]
    | null;
  fetchMore: any;
}

export default function UserQuestions({
  questions,
  fetchMore,
}: IuserQuestions) {
  const loader = useRef(null);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = isQuestionLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (questions && target.isIntersecting) {
        const lastId = questions[questions.length - 1]?.id;
        const more = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (!more?.data?.questions || more?.data?.questions?.length === 0) {
          isQuestionLoadFinishVar(true);
        }
      }
    },
    [questions]
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
    <div className="flex flex-1 py-4 md:px-6">
      <section
        aria-labelledby="question-heading"
        className="relative w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8"
      >
        <h2 id="question-heading" className="sr-only">
          질문들
        </h2>
        <div>
          {questions && questions?.length > 0 ? (
            <QuestionMasonry questions={questions} />
          ) : (
            <div
              className="absolute text-xl font-bold text-center text-gray-600 sm:text-2xl"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <span className="block">작성한 질문이 없습니다</span>
            </div>
          )}
        </div>
        <div ref={loader} />
      </section>
    </div>
  );
}
