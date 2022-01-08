import { useReactiveVar } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  focusedQuestionVar,
  isQuestionLoadFinishVar,
} from "../../src/utils/questions.utils";
import { loginUserVar } from "../../src/utils/auth.utils";
import QuestionMasonry from "../questions/QuestionMasonry";

export default function CreatedQuestions({ questions, fetchMore }: any) {
  const loader = useRef(null);
  const [take, setTake] = useState(20);

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = isQuestionLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (questions && target.isIntersecting) {
        const lastId = questions[questions.length - 1]?.id;
        const more: any = await fetchMore({
          variables: {
            take,
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
        aria-labelledby="products-heading"
        className="relative w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8"
      >
        <h2 id="products-heading" className="sr-only">
          질문들
        </h2>
        <div>
          {questions?.length > 0 ? (
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
