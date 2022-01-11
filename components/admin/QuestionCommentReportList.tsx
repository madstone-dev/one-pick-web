import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SHOW_QUESTION_COMMENT_FRAGMENT } from "../../src/fragments";
import { headerHeightVar } from "../../src/utils/auth.utils";
import { tabHeightVar } from "../../src/utils/utils";
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
  }, [page]);

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
      <div className="flex flex-col">
        <div className="pb-16 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full max-w-full min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      댓글 / 사유
                    </th>
                    <th
                      scope="col"
                      className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell"
                    >
                      신고일
                    </th>
                    <th
                      scope="col"
                      className="relative hidden px-6 py-3 md:table-cell"
                    >
                      <span className="sr-only">보기 / 삭제</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.showQuestionCommentReports &&
                    data?.showQuestionCommentReports?.reports?.map(
                      (report, index) => (
                        <QuestionCommentReport report={report} key={index} />
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={`${scrollHeight > 0 ? "" : "hidden"}`}>
        <ScrollToTop />
      </div>
    </div>
  );
}
