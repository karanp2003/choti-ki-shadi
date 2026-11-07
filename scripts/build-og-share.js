/**
 * Builds og-share.jpg (1200×630) — couple photo + dark "Wedding Invitation" title bar.
 */
const fs = require("fs");
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.warn("sharp not installed — skipping og-share.jpg build (run npm install).");
  process.exit(0);
}

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "share-source.jpg");
const outPath = path.join(root, "og-share.jpg");
const outSquarePath = path.join(root, "og-share-square.jpg");
const version = process.env.OG_VERSION || "6";

if (!fs.existsSync(sourcePath)) {
  console.warn("share-source.jpg missing — skipping OG image build.");
  process.exit(0);
}

const title = "Wedding Invitation";
const subtitle = "Antima & Saksham  ·  4 & 5 December 2026";

const overlaySvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)" />
      <stop offset="55%" stop-color="rgba(0,0,0,0.05)" />
      <stop offset="100%" stop-color="rgba(44,24,24,0.55)" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)" />
  <rect y="468" width="1200" height="162" fill="rgba(250,248,252,0.96)" />
  <rect y="468" width="1200" height="3" fill="#b8956a" opacity="0.85"/>
  <text x="600" y="528" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="46" font-weight="700" fill="#1f1414" letter-spacing="0.06em">WEDDING INVITATION</text>
  <text x="600" y="578" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" font-weight="600" fill="#2c1818">${subtitle.replace(/&/g, "&amp;")}</text>
</svg>`;

const squareOverlaySvg = `
<svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
  <rect y="940" width="1200" height="260" fill="rgba(250,248,252,0.96)" />
  <rect y="940" width="1200" height="3" fill="#b8956a" opacity="0.85"/>
  <text x="600" y="1015" text-anchor="middle" font-family="Georgia, serif"
        font-size="52" font-weight="700" fill="#1f1414">WEDDING INVITATION</text>
  <text x="600" y="1075" text-anchor="middle" font-family="Georgia, serif"
        font-size="34" font-weight="600" fill="#2c1818">${subtitle.replace(/&/g, "&amp;")}</text>
</svg>`;

async function build() {
  await sharp(sourcePath)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(outPath);

  await sharp(sourcePath)
    .resize(1200, 1200, { fit: "cover", position: "centre" })
    .composite([{ input: Buffer.from(squareOverlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(outSquarePath);

  const meta = await sharp(outSquarePath).metadata();
  fs.writeFileSync(
    path.join(root, "og-meta.json"),
    JSON.stringify(
      {
        version,
        landscape: { path: "/og-share.jpg", width: 1200, height: 630 },
        square: {
          path: "/og-share-square.jpg",
          width: meta.width || 1200,
          height: meta.height || 1200,
        },
      },
      null,
      2
    )
  );

  console.log("Created og-share.jpg and og-share-square.jpg for link previews.");
}

build().catch((err) => {
  console.error("OG image build failed:", err.message);
  process.exit(1);
});
