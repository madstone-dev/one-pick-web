import Masonry from "react-masonry-css";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";
import Question from "./Question";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  280: 1,
};

interface IquestionMasonry {
  questions: showQuestions_showQuestions[] | null;
  showBlocked?: boolean;
}

export default function QuestionMasonry({
  questions,
  showBlocked = true,
}: IquestionMasonry) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid sm:px-6 lg:px-8"
      columnClassName="my-masonry-grid_column"
    >
      {questions?.map(
        (question, index) =>
          question && (
            <div key={index} className="mb-3">
              <Question question={question} showBlocked={showBlocked} />
            </div>
          )
      )}
    </Masonry>
  );
}
