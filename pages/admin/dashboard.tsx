import { gql, useQuery } from "@apollo/client";
import AdminAside from "../../components/admin/AdminAside";
import AdminGuard from "../../components/admin/AdminGuard";
import DashboardStats from "../../components/admin/DashboardStats";
import Layout from "../../components/auth/Layout";
import { routes } from "../../src/routes";
import { getRefreshToken } from "../../src/utils/auth.utils";
import { showAdminDashboard } from "../../src/__generated__/showAdminDashboard";

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
    <AdminGuard>
      <Layout>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <AdminAside />

            <div className="px-4 space-y-8 sm:px-6 lg:px-8 lg:col-span-9">
              {data && <DashboardStats stats={data.showAdminDashboard} />}
            </div>
          </div>
        </main>
      </Layout>
    </AdminGuard>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const token = getRefreshToken({ req, res });
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: routes.home,
      },
    };
  }
  return {
    props: {},
  };
}
