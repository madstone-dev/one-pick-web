import { useCallback, useEffect, useRef } from "react";
import { isQuestionLoadFinishVar } from "../../src/utils/questions.utils";
import { myBlockContents_me_questionBlocks } from "../../src/__generated__/myBlockContents";
import QuestionMasonry from "../questions/QuestionMasonry";

interface IblockedQuestions {
  questions: (myBlockContents_me_questionBlocks | null)[];
  fetchMore: any;
}

export default function BlockedQuestions({
  questions,
  fetchMore,
}: IblockedQuestions) {
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
    <div>
      <h2 id="question-heading" className="sr-only">
        숨긴 질문들
      </h2>
      <div>
        {questions?.length > 0 ? (
          <QuestionMasonry questions={questions} showBlocked={false} />
        ) : (
          <div className="text-lg font-bold text-center text-gray-600 sm:text-xl">
            <span className="block">숨겨둔 질문이 없습니다</span>
          </div>
        )}
      </div>
      <div ref={loader} />
    </div>
  );
}
