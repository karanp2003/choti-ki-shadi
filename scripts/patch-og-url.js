/**
 * Vercel build: injects absolute site URL into Open Graph meta tags.
 * VERCEL_URL is set automatically on Vercel (without protocol).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");

const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

let html = fs.readFileSync(indexPath, "utf8");
html = html.replaceAll("__SITE_URL__", siteUrl.replace(/\/$/, ""));
fs.writeFileSync(indexPath, html);

console.log(`Open Graph base URL set to: ${siteUrl.replace(/\/$/, "")}`);
