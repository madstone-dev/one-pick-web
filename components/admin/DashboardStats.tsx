import { cardShadow } from "../../src/utils/utils";
import { showAdminDashboard_showAdminDashboard } from "../../src/__generated__/showAdminDashboard";

interface IdashboardStats {
  stats: showAdminDashboard_showAdminDashboard;
}

export default function DashboardStats({ stats }: IdashboardStats) {
  return (
    <div>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            관리자 메뉴 대시보드
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            오늘도 화이팅!! 😀
          </p>
        </div>
      </div>
      <div className="pb-12 mt-10 bg-white sm:pb-16">
        <div className="relative">
          <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl
                className="bg-white rounded-3xl sm:grid sm:grid-cols-3"
                style={{ boxShadow: cardShadow }}
              >
                <div className="flex flex-col p-6 text-center border-b border-gray-100 sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    총 유저 수
                  </dt>
                  <dd className="order-1 text-3xl font-extrabold text-indigo-600">
                    {stats.totalUsers}
                  </dd>
                </div>
                <div className="flex flex-col p-6 text-center border-t border-b border-gray-100 sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    신고 게시물
                  </dt>
                  <dd className="order-1 text-3xl font-extrabold text-indigo-600">
                    {stats.totalQuestionReports}
                  </dd>
                </div>
                <div className="flex flex-col p-6 text-center border-t border-gray-100 sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    신고 댓글
                  </dt>
                  <dd className="order-1 text-3xl font-extrabold text-indigo-600">
                    {stats.totalQuestionCommentReports}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
