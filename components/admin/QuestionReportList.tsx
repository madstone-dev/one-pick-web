import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SHOW_QUESTIONS_FRAGMENT } from "../../src/fragments";
import { headerHeightVar } from "../../src/utils/auth.utils";
import { cardShadow, tabHeightVar } from "../../src/utils/utils";
import { showQuestionReports } from "../../src/__generated__/showQuestionReports";
import ScrollToTop from "../ScrollToTop";
import OffsetPaginator from "./OffsetPaginator";
import QuestionReport from "./QuestionReport";

const SHOW_QUESTION_REPORTS_QUERY = gql`
  query showQuestionReports($page: Int, $take: Int) {
    showQuestionReports(page: $page, take: $take) {
      totalReports
      lastPage
      reports {
        id
        type
        question {
          ...ShowQuestionsFragment
        }
        createdAt
      }
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

export default function QuestionReportList() {
  const [page, setPage] = useState(1);
  const take = 20;
  const { data, fetchMore } = useQuery<showQuestionReports>(
    SHOW_QUESTION_REPORTS_QUERY,
    {
      variables: {
        page,
        take,
      },
    }
  );

  useEffect(() => {
    fetchMore({
      variables: {
        page,
        take,
      },
    });
  }, [page, fetchMore]);

  const [scrollHeight, setScrollHeight] = useState(0);

  const trackScroll = () => {
    setScrollHeight(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", trackScroll);
    setScrollHeight(window.scrollY);
    return () => {
      window.removeEventListener("scroll", trackScroll);
    };
  }, []);

  return (
    <div>
      <div
        className={`${
          headerHeightVar() + tabHeightVar() < scrollHeight ? "shadow-sm" : ""
        } sticky py-2 bg-white px-4 z-30`}
        style={{
          top: `${headerHeightVar() + tabHeightVar()}px`,
        }}
      >
        <OffsetPaginator
          itemTotal={data?.showQuestionReports.totalReports}
          currentPage={page}
          take={take}
          lastPage={data?.showQuestionReports.lastPage}
          setPage={setPage}
        />
      </div>
      <div className="pb-20 sm:rounded-3xl sm:px-2">
        <div
          className="divide-y divide-gray-200 sm:rounded-3xl"
          style={{ boxShadow: cardShadow }}
        >
          {/* header */}
          <div className="overflow-hidden sm:rounded-t-3xl">
            <div className="flex items-start px-6 py-3 bg-gray-50">
              <div className="flex-1 min-w-0 md:grid md:grid-cols-2 md:gap-6">
                <div>
                  <p className="text-xs text-gray-500">????????? / ??????</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-500">?????????</p>
                </div>
              </div>
              <div className="sr-only">??????</div>
            </div>
          </div>
          {data?.showQuestionReports &&
            data?.showQuestionReports?.reports?.map((report, index) => (
              <QuestionReport
                report={report}
                key={index}
                isLast={
                  index > 1 &&
                  data.showQuestionReports.reports?.length === index + 1
                }
              />
            ))}
        </div>
      </div>
      <div className={`${scrollHeight > 0 ? "" : "hidden"}`}>
        <ScrollToTop />
      </div>
    </div>
  );
}
