import { useState } from "react";
import AdminAside from "../../components/admin/AdminAside";
import QuestionCommentReportList from "../../components/admin/QuestionCommentReportList";
import QuestionReportList from "../../components/admin/QuestionReportList";
import Layout from "../../components/auth/Layout";
import Tabs from "../../components/Tabs";
import { NextSeo } from "next-seo";
import AdminOnly from "../../components/auth/AdminOnly";

export default function AdminReports() {
  const tabs = [
    { name: "신고 게시물", to: "questions" },
    { name: "신고 댓글", to: "comments" },
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0].to);

  return (
    <Layout>
      <NextSeo title="신고 목록" />
      <AdminOnly>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <AdminAside />
            <div className="sm:px-6 lg:px-8 lg:col-span-9">
              <Tabs
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
              {currentTab === tabs[0].to && <QuestionReportList />}
              {currentTab === tabs[1].to && <QuestionCommentReportList />}
            </div>
          </div>
        </main>
      </AdminOnly>
    </Layout>
  );
}
