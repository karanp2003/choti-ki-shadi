/**
 * Vercel build: injects absolute site URL into Open Graph meta tags.
 * VERCEL_URL is set automatically on Vercel (without protocol).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");

function normalizeSiteUrl(raw) {
  if (!raw) return "";
  const trimmed = String(raw).trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const siteUrl =
  normalizeSiteUrl(process.env.SITE_URL) ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  "https://antima-saksham.vercel.app";

let html = fs.readFileSync(indexPath, "utf8");
html = html.replaceAll("__SITE_URL__", siteUrl.replace(/\/$/, ""));
fs.writeFileSync(indexPath, html);

console.log(`Open Graph base URL set to: ${siteUrl.replace(/\/$/, "")}`);
