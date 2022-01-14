import Link from "next/link";
import Layout from "../components/auth/Layout";
import ContentSection from "../components/ContentSection";
import { routes } from "../src/routes";
import { NextSeo } from "next-seo";

export default function Error500() {
  return (
    <>
      <NextSeo title="500" />
      <Layout>
        <ContentSection>
          <div className="flex-1 min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
            <div className="mx-auto max-w-max">
              <main className="sm:flex">
                <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
                  500
                </p>
                <div className="sm:ml-6">
                  <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                      페이지를 찾을 수 없습니다
                    </h1>
                    <p className="mt-1 text-base text-gray-500">
                      URL을 확인하시고 다시 시도해주세요.
                    </p>
                  </div>
                  <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                    <Link href={routes.home}>
                      <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        홈으로 이동
                      </a>
                    </Link>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </ContentSection>
      </Layout>
    </>
  );
}
