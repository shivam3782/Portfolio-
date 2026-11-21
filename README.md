# Shivam Sharma portfolio

Retro 3D inspired React/Vite portfolio with an Express/MongoDB content API and private admin CMS. The public home, five project pages and 404 are server-rendered at build time and hydrate in the browser. The CSS perspective scene has no WebGL dependency.

## Run locally

Requires Node 22.12+ and MongoDB. From `backend`, copy `.env.example` to `.env`, set `MONGO_URI` and a long random `ADMIN_KEY`, then run `npm ci` and `npm run dev`. From `frontend`, run `npm ci` and `npm run dev`. The frontend runs at `http://localhost:5173` and proxies `/api` to the backend on port 3000. Never put backend secrets in `VITE_` variables.

## Build and verify

From `frontend`: `npm run build`, `npm run preview`, `npm run lint`, `npm test`, `npm run test:e2e`, `node scripts/responsive.mjs`, and `node scripts/lighthouse.mjs final`. From `backend`: `npm run lint` and `npm test`. Playwright browser setup: `npx playwright install chromium firefox webkit`. `npm run build` regenerates favicon/OG assets, builds JS/CSS, writes server-rendered home/project/404 HTML, robots and sitemap, then scans output for dev URLs and backend secrets. Production preview uses the exact generated files. Test reports and screenshots are ignored under `frontend/artifacts`, `frontend/test-results`, and `frontend/playwright-report`.

## Edit content

Visit `/admin`, enter the private server key, and use **Profile & content**, **Projects**, and **Contact inbox**. The key stays in memory. Project case-study fields and screenshots are additive; old records work unchanged. Enter screenshots as `https://example.com/shot.webp | Descriptive alt text`, one per line. Missing image/demo links are hidden or show a labeled placeholder. The existing five-project order is preserved. Profile fields include tagline, availability, role, socials, resume URL, OG URL, stats, skills, education, leadership and certifications. Structured lists use JSON in the admin; keep their field names. Blank optional fields hide links; unverified case-study notes show a neutral coming-soon state publicly.

Replace `frontend/public/Shivam_Sharma_Resume.pdf` to keep the current stable URL, or set `resumeUrl` in Profile & content to a stable HTTPS PDF. The live client reads CMS changes immediately. Rebuild with `SNAPSHOT_API_URL` set to the backend origin to update the static HTML and share previews from CMS data. If that origin fails during a build, the build stops rather than silently publishing old metadata. Without it, the bundled verified snapshot is used. Update `frontend/src/data/projects.snapshot.json` when the real portfolio changes.

The contact form saves messages in MongoDB, visible in the authenticated admin inbox; it does not claim to send email. Honeypot, server validation, request-size limit and rate limiting are active. `ANALYTICS_ENABLED=true` on the backend and `VITE_ANALYTICS_ENABLED=true` on the frontend enable an aggregate resume-click counter without visitor tracking.

## Deploy and rollback

The frontend `vercel.json` serves prerendered project files. Set `VITE_API_URL` to the public HTTPS backend origin on hosts without a same-origin API proxy. Set `VITE_SITE_URL`, optionally `VITE_API_URL` or `SNAPSHOT_API_URL`, and configure backend `MONGO_URI`, `ADMIN_KEY`, `CORS_ORIGINS`, `NODE_ENV=production`, optional `TRUST_PROXY_HOPS` and analytics flags. Build command: `npm ci && npm run build` in `frontend`; backend start: `npm ci && npm start` in `backend`. Verify home, all five project URLs, `/404`, `/admin`, contact delivery/inbox, resume PDF, sitemap, robots and social preview after release. Roll back by redeploying the previous frontend build and backend revision; the MongoDB changes are additive and older code ignores new fields. No database migration or destructive transform is required. Do not publish until the owner requests deployment.

See [redesign plan](docs/REDESIGN_PLAN.md), [change log](docs/CHANGELOG-REDESIGN.md), and [verification](docs/VERIFICATION.md).
