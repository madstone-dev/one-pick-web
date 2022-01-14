import { gql, useQuery } from "@apollo/client";
import AdminAside from "../../components/admin/AdminAside";
import DashboardStats from "../../components/admin/DashboardStats";
import Layout from "../../components/auth/Layout";
import { showAdminDashboard } from "../../src/__generated__/showAdminDashboard";
import { NextSeo } from "next-seo";
import AdminOnly from "../../components/auth/AdminOnly";

const SHOW_ADMIN_DASHBOARD = gql`
  query showAdminDashboard {
    showAdminDashboard {
      totalUsers
      totalQuestionReports
      totalQuestionCommentReports
    }
  }
`;

export default function AdminDashboard() {
  const { data } = useQuery<showAdminDashboard>(SHOW_ADMIN_DASHBOARD);

  return (
    <Layout>
      <NextSeo title="대시보드" />
      <AdminOnly>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <AdminAside />
            <div className="px-4 space-y-8 sm:px-6 lg:px-8 lg:col-span-9">
              {data && <DashboardStats stats={data.showAdminDashboard} />}
            </div>
          </div>
        </main>
      </AdminOnly>
    </Layout>
  );
}
