import { globby } from "globby";
import fs from "fs";
import prettier from "prettier";

const getDate = new Date().toISOString();
const DOMAIN = "https://www.onepick.fun";

const formatted = (sitemap) => prettier.format(sitemap, { parser: "html" });

(async () => {
  // 포함할 페이지와 제외할 페이지 등록
  const pages = await globby([
    // include
    "../pages/**/*.tsx",
    "../pages/*.tsx",
    // exclude
    "!../pages/_app.tsx",
    "!../pages/_document.tsx",
    "!../pages/500.tsx",
    "!../pages/404.tsx",
    "!../pages/admin/*.tsx",
    "!../pages/users/blocks.tsx",
    "!../pages/users/comments.tsx",
    "!../pages/users/profile.tsx",
    "!../pages/**/[id].tsx",
    "!../pages/**/[id]/*.tsx",
    "!../pages/**/[id]/**/*.tsx",
  ]);

  // 파일 경로를 도메인 형태로 변경
  const pagesSitemap = `
    ${pages
      .map((page) => {
        const path = page
          .replace("../pages/", "")
          .replace(".tsx", "")
          .replace(/\/index/g, "");
        const routePath = path === "index" ? "" : path;
        return `
          <url>
            <loc>${DOMAIN}/${routePath}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
      })
      .join("")}`;

  const generatedSitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${pagesSitemap}
    </urlset>`;

  const formattedSitemap = [formatted(generatedSitemap)][0];

  fs.writeFileSync(
    "../public/sitemap/sitemap-common.xml",
    formattedSitemap,
    "utf8"
  );
})();
