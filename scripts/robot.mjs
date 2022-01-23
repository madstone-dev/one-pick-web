import fs from "fs";

const generatedSitemap = `
User-agent: *
Disallow: /admin*/
`;

fs.writeFileSync("../public/robots.txt", generatedSitemap, "utf8");
