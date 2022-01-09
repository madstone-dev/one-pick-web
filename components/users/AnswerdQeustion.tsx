import { useReactiveVar } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import Link from "next/link";
import LinesEllipsis from "react-lines-ellipsis";
import {
  focusedQuestionVar,
  isQuestionLoadFinishVar,
} from "../../src/utils/questions.utils";
import { loginUserVar } from "../../src/utils/auth.utils";
import QuestionDropdown from "../questions/QuestionDropdown";
import NoImage from "../NoImage";

export default function AnswerdQuestions({ user, fetchMore }: any) {
  const focusedQuestion = useReactiveVar(focusedQuestionVar);
  const loginUser = useReactiveVar(loginUserVar);
  const loader = useRef(null);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    280: 1,
  };

  const handleObserver = useCallback(
    async (entries) => {
      const loadFinish = isQuestionLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (user.picks && target.isIntersecting) {
        const lastId = user.picks[user.picks.length - 1]?.id;
        const more: any = await fetchMore({
          variables: {
            lastId,
          },
        });
        if (!more?.data?.picks || more?.data?.picks?.length === 0) {
          isQuestionLoadFinishVar(true);
        }
      }
    },
    [user]
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
          {user?.picks?.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {user?.picks?.map((question: any) => (
                <div key={question.id} className="mb-3">
                  {question.isBlocked ? (
                    <>
                      <div className="relative w-full shadow-md rounded-2xl aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3 group">
                        {loginUser && (
                          <div className="absolute bottom-0 right-0 z-10 flex">
                            <div
                              className={`${
                                focusedQuestion === question.id
                                  ? "opacity-100"
                                  : "sm:opacity-0 group-hover:opacity-100"
                              } p-3`}
                            >
                              <QuestionDropdown question={question} />
                            </div>
                          </div>
                        )}
                        {question.image?.Location ? (
                          <img
                            src={question.image?.Location}
                            alt={question.content}
                            className="object-cover object-center w-full h-full blur-md"
                          />
                        ) : (
                          <NoImage
                            title={question.content}
                            className="blur-md"
                          />
                        )}
                      </div>
                      <div className="py-3 text-sm italic font-medium text-gray-600">
                        사용자에 의해 숨겨진 콘텐츠입니다
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative w-full shadow-md rounded-2xl aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3 group">
                        {loginUser && (
                          <div className="absolute z-10 flex bottom-3 right-3">
                            <div
                              className={`${
                                focusedQuestion === question.id
                                  ? "opacity-100"
                                  : "sm:opacity-0 group-hover:opacity-100"
                              } bg-opacity-10 sm:bg-gray-100 rounded-full`}
                            >
                              <QuestionDropdown question={question} />
                            </div>
                          </div>
                        )}

                        <Link
                          href="/questions/[id]"
                          as={`/questions/${question.id}`}
                        >
                          <a>
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-0 rounded-2xl group-hover:bg-opacity-50"></div>
                            {question.image?.Location ? (
                              <img
                                src={question.image?.Location}
                                alt={question.content}
                                className="object-cover object-center w-full h-full rounded-2xl"
                              />
                            ) : (
                              <NoImage
                                title={question.content}
                                className="rounded-2xl"
                              />
                            )}
                          </a>
                        </Link>
                      </div>
                      <Link
                        href="/questions/[id]"
                        as={`/questions/${question.id}`}
                      >
                        <a>
                          <div className="py-3 text-sm font-medium text-gray-900">
                            <LinesEllipsis
                              text={question.content}
                              maxLine="1"
                              ellipsis="..."
                            />
                          </div>
                        </a>
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </Masonry>
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
