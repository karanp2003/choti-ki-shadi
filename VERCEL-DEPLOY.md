# Deploy on Vercel + WhatsApp preview

## 1. Deploy

1. Push this folder to GitHub (or import directly in Vercel).
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Other** (static site).
4. Build command: `npm run build` (already in `vercel.json`).
5. Output directory: `.` (project root).

After deploy you get a link like:

`https://your-project.vercel.app`

**Optional — custom domain:** Vercel → Project → Settings → Domains.

**Optional — stable OG URLs:** Settings → Environment Variables → add:

- `SITE_URL` = `https://your-project.vercel.app` (or your custom domain, no trailing slash)

Redeploy once so WhatsApp always sees the correct preview image URL.

## 2. WhatsApp link preview

The site includes:

- `og-share.jpg` — card image for link previews (1200×630 style).
- Open Graph meta tags in `index.html` (URLs filled at build time).

**Share this message:**

```text
With love and blessings 💛
Antima & Saksham — Wedding Invitation
4 & 5 December 2026

Tap to open: https://YOUR-VERCEL-URL.vercel.app
```

Paste the URL on its own line — WhatsApp loads title, text, and `og-share.jpg`.

## 3. Refresh preview after changes

WhatsApp caches previews. To refresh:

1. Change the image or add `?v=2` to `og:image` in `index.html`, or replace `og-share.jpg`.
2. Redeploy.
3. Test: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — paste your URL → **Scrape Again**.

## 4. Couple photo on the preview card

- Source photo: `share-source.jpg` (from your WhatsApp/couple image).
- Build generates `og-share.jpg` with your photo + **dark “Wedding Invitation”** title bar.
- To change the photo: replace `share-source.jpg`, commit, redeploy (Vercel runs `npm run build`).

## 5. Replace preview image manually

Or swap `og-share.jpg` directly (recommended **1200×630**, under ~300 KB), then redeploy.
