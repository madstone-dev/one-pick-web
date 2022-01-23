import axios from "axios";
import fs from "fs";
import prettier from "prettier";

// 오늘 날짜 가져오기 & 도메인 설정
const getDate = new Date().toISOString();
const API_URL = "https://graphql.onepick.fun";
const DOMAIN = "https://www.onepick.fun";

const formatted = (sitemap) => prettier.format(sitemap, { parser: "html" });
(async () => {
  // axios를 이용해 questions 리스트 가져오기
  const response = await axios.post(
    API_URL,
    {
      query: `query showQuestions($take: Int) {
        showQuestions(take: $take) {
            id
        }
      }`,
      variables: {
        take: 100,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const questions = [];
  // 적절히 파싱
  response.data.data.showQuestions.forEach((question) =>
    questions.push({ id: question.id })
  );

  // xml 구조에 맞게 파싱하여 재조립
  const questionsSitemap = `
  ${questions
    .map((question) => {
      return `
        <url>
          <loc>${`${DOMAIN}/questions/${question.id}`}</loc>
          <lastmod>${getDate}</lastmod>
        </url>`;
    })
    .join("")}
`;

  const generatedSitemap = `
	<?xml version="1.0" encoding="UTF-8"?>
  	<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  >
    ${questionsSitemap}
  </urlset>
`;

  const formattedSitemap = [formatted(generatedSitemap)][0];

  fs.writeFileSync(
    "../public/sitemap/sitemap-questions.xml",
    formattedSitemap,
    "utf8"
  );
})();
