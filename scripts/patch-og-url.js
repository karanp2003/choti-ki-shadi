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

const configuredImage = normalizeSiteUrl(process.env.OG_IMAGE_URL);

let ogVersion = process.env.OG_VERSION || "7";
let imagePath = "/api/og-image";
let imageWidth = "800";
let imageHeight = "800";

if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    ogVersion = meta.version || ogVersion;
    imagePath = meta.whatsapp?.path || meta.apiPath || imagePath;
    if (meta.whatsapp?.width) imageWidth = String(meta.whatsapp.width);
    if (meta.whatsapp?.height) imageHeight = String(meta.whatsapp.height);
  } catch {
    /* use defaults */
  }
}

// No query string on image URL — WhatsApp breaks on ?v=; page URL ?i=1 busts page cache instead
const ogImageBase = configuredImage || `${siteUrl.replace(/\/$/, "")}${imagePath}`;

let html = fs.readFileSync(indexPath, "utf8");
html = html.replaceAll("__SITE_URL__", siteUrl.replace(/\/$/, ""));
html = html.replaceAll("__OG_IMAGE_URL__", ogImageBase);
html = html.replaceAll("__OG_IMAGE_WIDTH__", imageWidth);
html = html.replaceAll("__OG_IMAGE_HEIGHT__", imageHeight);

fs.writeFileSync(indexPath, html);

console.log(`Open Graph base URL: ${siteUrl.replace(/\/$/, "")}`);
console.log(`Open Graph image URL: ${ogImageBase}`);
