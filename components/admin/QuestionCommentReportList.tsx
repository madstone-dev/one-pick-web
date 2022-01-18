import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import { headerHeightVar } from "../../src/utils/auth.utils";
import { cardShadow, tabHeightVar } from "../../src/utils/utils";
import { showQuestionCommentReports } from "../../src/__generated__/showQuestionCommentReports";
import ScrollToTop from "../ScrollToTop";
import OffsetPaginator from "./OffsetPaginator";
import QuestionCommentReport from "./QuestionCommentReport";

const SHOW_QUESTION_REPORTS_QUERY = gql`
  query showQuestionCommentReports($page: Int, $take: Int) {
    showQuestionCommentReports(page: $page, take: $take) {
      totalReports
      lastPage
      reports {
        id
        type
        questionComment {
          ...ShowQuestionCommentFragment
        }
        createdAt
      }
    }
  }
  ${SHOW_QUESTION_COMMENT_FRAGMENT}
`;

export default function QuestionCommentReportList() {
  const [page, setPage] = useState(1);
  const take = 20;
  const { data, fetchMore } = useQuery<showQuestionCommentReports>(
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
          itemTotal={data?.showQuestionCommentReports?.totalReports}
          currentPage={page}
          take={take}
          lastPage={data?.showQuestionCommentReports?.lastPage}
          setPage={setPage}
        />
      </div>
      <div className="pb-20 bg-white sm:rounded-3xl sm:px-2">
        <div
          className="border border-gray-100 divide-y divide-gray-200 sm:rounded-3xl"
          style={{ boxShadow: cardShadow }}
        >
          {/* header */}
          <div className="overflow-hidden sm:rounded-t-3xl">
            <div className="flex items-start px-6 py-3 bg-gray-50">
              <div className="flex-1 min-w-0 md:grid md:grid-cols-2 md:gap-6">
                <div>
                  <p className="text-xs text-gray-500">댓글 / 사유</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-500">신고일</p>
                </div>
              </div>
              <div className="sr-only">메뉴</div>
            </div>
          </div>
          {data?.showQuestionCommentReports &&
            data?.showQuestionCommentReports?.reports?.map((report, index) => (
              <QuestionCommentReport
                report={report}
                key={index}
                isLast={
                  index > 1 &&
                  data.showQuestionCommentReports.reports?.length === index + 1
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
