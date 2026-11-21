# Redesign verification — 22 November 2026

## Build and automated checks

- Frontend production build and emitted-secret/development-URL scan: pass.
- Frontend ESLint and repository Prettier check: pass.
- Frontend legacy tests: 34 passed. Vitest component tests: 10 passed.
- Backend ESLint and isolated MongoDB API tests: 8 passed.
- Playwright production-preview suite: 62 passed, 34 planned skips, 0 failures across Chromium, Firefox and WebKit. The skips are duplicate axe checks and the Chromium-only network-throttling case. Tests cover project order and all five routes, navigation, themes, command palette, contact validation/delivery/error, resume PDF, admin editing/inbox, gallery, 404, static HTML without JavaScript, API failure, reduced motion and no WebGL.
- Axe serious/critical violations: 0 on home, all five project routes, 404 and admin in dark and light themes (Chromium). Browser console error/warning assertions pass in Chromium, Firefox and WebKit. Playwright's Node process emits a `NO_COLOR`/`FORCE_COLOR` environment warning; it is outside the website.
- Responsive sweep at 360, 390, 768, 1024, 1280, 1440 and 1920 pixels in both themes: document width equals viewport width in all 14 cases. Captured full-page screenshots under `frontend/artifacts/responsive/`; inspected mobile and tablet layouts. Decorative scene elements extend within their clipped container without causing document overflow.

## Lighthouse

Scores are Performance / Accessibility / Best Practices / SEO, from production previews with Lighthouse 13.6 and the actual mobile and desktop presets. The first audit script mislabeled mobile emulation as desktop; those reports were discarded. Baseline was rebuilt from commit `b25d6a6` in an isolated worktree and audited again with the corrected script.

| Build                     | Mobile               | Desktop              | Mobile LCP / CLS | Desktop LCP / CLS |
| ------------------------- | -------------------- | -------------------- | ---------------- | ----------------- |
| Before redesign           | 85 / 100 / 100 / 92  | 87 / 100 / 100 / 92  | 3.07 s / 0       | 0.83 s / 0.0005   |
| Redesign, final local run | 77 / 100 / 100 / 100 | 88 / 100 / 100 / 100 | 0.93 s / 0       | 0.41 s / 0.0038   |

The mobile Performance target of 90 is **not met**. The final mobile run reported 1,063 ms total blocking time: its longest tasks were 621 ms unattributed browser work, 291 ms in the document, and 237 ms plus 169 ms in the main JavaScript. Desktop total blocking time was 280 ms. Local runs varied substantially, including desktop Performance from 79 to 97 on the same build; the table uses the final unchanged-build run. LCP, CLS, accessibility, best practices and SEO meet their requested targets in that run. Lab Lighthouse does not measure field INP, so the INP target is not verified. The current build must not be described as meeting the mobile Performance acceptance criterion. Further profiling on an idle/CI machine and reduction of initial document/render and hydration work remain before release.

The JSON reports are in ignored `frontend/artifacts/lighthouse-baseline-corrected-*.json` and `frontend/artifacts/lighthouse-stable-layout-*.json`. A static-server diagnostic without the API and no-SSR/font experiments were discarded; the final build retains the prerendered pages and original CSS scene.

## Content and deployment boundaries

- CMS data is the runtime source. The static snapshot provides bot-visible content and API-down fallback; rebuild after CMS edits to refresh crawler metadata.
- Missing real screenshots and demo links render labeled placeholders or hidden links. Case-study fields with no verified owner content show neutral coming-soon copy. The contact form stores messages durably in the private MongoDB inbox; no email notification is claimed.
- The resume path resolves to a real PDF, but the owner should review and replace the file when ready. The generated OG image, canonical URLs, contact details and social links need owner review before publishing. Production hosting, DNS, CMS connectivity and contact delivery have not been exercised because deployment was not authorized.

## Pre-deploy checklist

1. Profile mobile performance on an idle machine and bring Lighthouse mobile Performance to at least 90 without sacrificing accessibility, SEO, or interaction readiness; verify field INP when traffic exists.
2. Add verified project screenshots, case-study narratives and available demo links through `/admin`; review the resume PDF and OG image. Do not add unsupported metrics or testimonials.
3. Set frontend `VITE_SITE_URL` and the public HTTPS `VITE_API_URL` on Vercel (or provide a same-origin `/api` proxy). Set `SNAPSHOT_API_URL` for builds that should reflect current CMS content. Set backend `MONGO_URI`, a long private `ADMIN_KEY`, exact `CORS_ORIGINS`, `NODE_ENV=production`, and host-specific proxy settings. Never expose backend secrets as `VITE_` variables.
4. Use `npm ci && npm run build` in `frontend` and `npm ci && npm start` in `backend`. Verify home, every project route, `/admin`, PDF, contact inbox, sitemap, robots, social preview, both themes and mobile navigation against the production hostname.
5. Roll back by redeploying the previous frontend build and backend revision. The new MongoDB fields are additive; no destructive migration was run.

No deployment was performed.
