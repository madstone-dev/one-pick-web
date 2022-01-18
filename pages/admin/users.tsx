import AdminAside from "../../components/admin/AdminAside";
import UserList from "../../components/admin/UserList";
import Layout from "../../components/auth/Layout";
import { NextSeo } from "next-seo";
import AdminOnly from "../../components/auth/AdminOnly";

export default function AdminUsers() {
  return (
    <Layout>
      <NextSeo title="유저 목록" />
      <AdminOnly>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <AdminAside />
            <div className="sm:px-6 lg:px-8 lg:col-span-9">
              <UserList />
            </div>
          </div>
        </main>
      </AdminOnly>
    </Layout>
  );
}
