import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import LinesEllipsis from "react-lines-ellipsis";
import Masonry from "react-masonry-css";
import { loginUserVar } from "../../src/utils/auth.utils";
import { focusedQuestionVar } from "../../src/utils/questions.utils";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import NoImage from "../NoImage";
import QuestionDropdown from "./QuestionDropdown";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  280: 1,
};

interface IquestionMasonry {
  questions: (showQuestions_showQuestions | null)[] | null;
  showBlocked?: boolean;
}

export default function QuestionMasonry({
  questions,
  showBlocked = true,
}: IquestionMasonry) {
  const focusedQuestion = useReactiveVar(focusedQuestionVar);
  const loginUser = loginUserVar();

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="px-4 my-masonry-grid sm:px-6 lg:px-8"
      columnClassName="my-masonry-grid_column"
    >
      {questions?.map(
        (question) =>
          question && (
            <div key={question.id} className="mb-3">
              {question.isBlocked && showBlocked ? (
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
                      <NoImage title={question.content} className="blur-md" />
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
                  <Link href="/questions/[id]" as={`/questions/${question.id}`}>
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
          )
      )}
    </Masonry>
  );
}
