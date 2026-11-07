/**
 * Serves OG image with HTTP 200 only (no 206 ranges) — WhatsApp preview compatibility.
 */
const fs = require("fs");
const path = require("path");

const CANDIDATES = ["og-wa.jpg", "og-share-square.jpg", "og-share.jpg"];

module.exports = (req, res) => {
  let filePath = null;
  for (const name of CANDIDATES) {
    const p = path.join(process.cwd(), name);
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("OG image not found");
    return;
  }

  const buf = fs.readFileSync(filePath);
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Length", buf.length);
  res.setHeader("Accept-Ranges", "none");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(buf);
};
