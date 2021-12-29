import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import {
  isQuestionLoadFinishVar,
  shouldRefetchQuestionsVar,
} from "../src/utils/questions.utils";
import Link from "next/link";
import NoImage from "../components/NoImage";
import Layout from "../components/auth/Layout";
import { HashLoader } from "react-spinners";
import { SHOW_QUESTIONS_FRAGMENT } from "../src/fragments";
import LinesEllipsis from "react-lines-ellipsis";

const SHOW_QUESTIONS_QUERY = gql`
  query showQuestions($take: Int, $lastId: Int) {
    showQuestions(take: $take, lastId: $lastId) {
      ...ShowQuestionsFragment
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function Home() {
  const loader = useRef(null);
  const [take, setTake] = useState(20);
  const { data, loading, fetchMore, refetch } = useQuery(SHOW_QUESTIONS_QUERY, {
    variables: {
      take,
    },
    onCompleted: () => {
      isQuestionLoadFinishVar(false);
    },
  });

  useEffect(() => {
    const shouldRefetch = shouldRefetchQuestionsVar();
    if (shouldRefetch) {
      refetch();
      shouldRefetchQuestionsVar(false);
    }
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
  };

  const handleObserver = useCallback(
    (entries) => {
      const loadFinish = isQuestionLoadFinishVar();
      if (loadFinish) {
        return;
      }
      const target = entries[0];
      if (data?.showQuestions && target.isIntersecting) {
        const lastId = data?.showQuestions[data.showQuestions.length - 1]?.id;
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
    <Layout>
      <section
        aria-labelledby="products-heading"
        className={`py-4 sm:py-6 lg:py-8 w-full ${loading && "contents"}`}
      >
        <h2 id="products-heading" className="sr-only">
          질문들
        </h2>
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <HashLoader color="#777777" loading={true} size={60} />
          </div>
        )}
        <div className={`${loading && "hidden"}`}>
          {data?.showQuestions?.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {data?.showQuestions?.map((question: any) => (
                <Link
                  key={question.id}
                  href="/questions/[id]"
                  as={`/questions/${question.id}`}
                >
                  <a className="group">
                    <div
                      className={`relative w-full overflow-hidden rounded-lg shadow-md aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3`}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-0 group-hover:opacity-50"></div>
                      {question.image?.Location ? (
                        <img
                          src={question.image?.Location}
                          alt={question.content}
                          className="object-cover object-center w-full h-full"
                        />
                      ) : (
                        <NoImage title={question.content} />
                      )}
                    </div>
                    <div className="py-3 text-sm font-medium text-gray-900">
                      <LinesEllipsis
                        text={question.content}
                        maxLine="1"
                        ellipsis="..."
                      />
                    </div>
                  </a>
                </Link>
              ))}
            </Masonry>
          ) : (
            <div
              className="absolute text-2xl font-bold text-center text-gray-600"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <span className="block">당신이 처음입니다</span>
              <span className="block">첫 게시물을 작성해보세요!</span>
            </div>
          )}
        </div>
        <div ref={loader} />
      </section>
    </Layout>
  );
}
