import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import { apolloClient } from "../src/apolloClient";
import { showQuestions } from "../src/__generated__/showQuestions";

const SHOW_QUESTIONS_ID_QUERY = gql`
  query showQuestionsId($take: Int) {
    showQuestions(take: $take) {
      id
    }
  }
`;

export default function SitemapXML() {
  return null;
}

SitemapXML.getInitialProps = async (context: NextPageContext) => {
  const {
    data: { showQuestions },
  } = await apolloClient.query<showQuestions>({
    query: SHOW_QUESTIONS_ID_QUERY,
    variables: {
      take: 100,
    },
  });

  const getDate = new Date().toISOString();
  const DOMAIN = "https://www.onepick.fun";
  const staticRoutes = [
    "",
    "login",
    "register",
    "forgot-password",
    "reset-password",
    "search",
  ];
  const staticUrls = staticRoutes
    .map(
      (route) =>
        `
        <url>
            <loc>${`${DOMAIN}/${route}`}</loc>
            <lastmod>${getDate}</lastmod>
        </url>
        `
    )
    .join("");

  const questionsUrls = showQuestions
    ?.map(
      (question) =>
        `
        <url>
            <loc>${`${DOMAIN}/questions/${question.id}`}</loc>
            <lastmod>${getDate}</lastmod>
        </url>
      `
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${questionsUrls}
      </urlset>`;

  if (context.res) {
    const res = context.res;
    res.setHeader("Content-Type", "text/xml");
    res.write(xml);
    res.end();
  }
};
