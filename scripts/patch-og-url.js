/**
 * Vercel build: injects absolute site + OG image URLs into Open Graph meta tags.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");
const metaPath = path.join(root, "og-meta.json");

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

let configuredImage = normalizeSiteUrl(process.env.OG_IMAGE_URL);
if (!configuredImage) {
  try {
    const cfgPath = path.join(root, "wedding-config.js");
    const cfgText = fs.readFileSync(cfgPath, "utf8");
    const m = cfgText.match(/ogImageUrl:\s*"([^"]+)"/);
    if (m) configuredImage = normalizeSiteUrl(m[1]);
  } catch {
    /* optional */
  }
}

let ogVersion = process.env.OG_VERSION || "7";
let imagePath = "/og-wa.jpg";
let imageWidth = "800";
let imageHeight = "800";

if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    ogVersion = meta.version || ogVersion;
    imagePath = meta.whatsapp?.path || imagePath;
    if (meta.whatsapp?.width) imageWidth = String(meta.whatsapp.width);
    if (meta.whatsapp?.height) imageHeight = String(meta.whatsapp.height);
  } catch {
    /* use defaults */
  }
}

// Clean absolute image URL (no query string)
const ogImageBase = configuredImage || `${siteUrl.replace(/\/$/, "")}${imagePath}`;

let html = fs.readFileSync(indexPath, "utf8");
html = html.replaceAll("__SITE_URL__", siteUrl.replace(/\/$/, ""));
html = html.replaceAll("__OG_IMAGE_URL__", ogImageBase);
html = html.replaceAll("__OG_IMAGE_WIDTH__", imageWidth);
html = html.replaceAll("__OG_IMAGE_HEIGHT__", imageHeight);

fs.writeFileSync(indexPath, html);

console.log(`Open Graph base URL: ${siteUrl.replace(/\/$/, "")}`);
console.log(`Open Graph image URL: ${ogImageBase}`);
