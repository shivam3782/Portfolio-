# Portfolio redesign ledger

## Stage 0 · November 19, 2026 · Discovery

**Production baseline** `d78f784c09b68340ac7e723c582efd995b737cc9`. Branch `portfolio-polish-2026` started from freshly fetched `origin/main`. Audit commit **4023dac**. Locate it with `git log -1 --format=%H --grep="^Document verified portfolio baseline"`. The ledger uses a history lookup for the commit containing the ledger itself.

### What is already deployed

The earlier redesign is live. The initial clean checkout was on `codex/new_protfolio` at `1543fda`. Its tracked tree matched fetched main byte-for-byte. Local main still pointed to `ab77575`; neither existing local branch needed modification. GitHub merged the editorial redesign in [PR #1](https://github.com/shivam3782/Portfolio-/pull/1) and favicon in [PR #2](https://github.com/shivam3782/Portfolio-/pull/2). Both were closed, with no open PR at baseline. The earlier redesign commit was `08f4460`. Historical ignored review documents described browser checks as blocked. This session captured real Chrome evidence.

The continuation brief describes the deployed system more accurately than the original four-project/JRPG plan. The CV and LinkedIn destination already exist. The active CSS, two themes, original vector workstation, native anchor scrolling, mobile relocation of the scene, palette, motion controls and authenticated workspace all have consumers. Existing project summary, edit, ordering and reauthentication contracts supersede the earlier simplified API list. The handoff ZIP contains the five supplied Markdown files, not a newer code snapshot. The [annotated tree](PROJECT_STRUCTURE.md) covers every tracked file.

### Production verification

- Vercel CLI inspection reported project `portfolio`, root `frontend`, Vite, Node 24.x, target Production and Ready. Deployment `dpl_4mHPSv4DjyhoPYdy1Pmq6C38z4yP` has both production aliases. GitHub recorded success for deployment 7786654366 at the baseline SHA. Previous feature pushes produced Preview deployments. [Production deployment](https://portfolio-i3ui30hgr-sam3782s-projects.vercel.app)
- HTTPS apex returned 308 to www, then 200. Direct Render GET and same-origin GET returned JSON. Public list in order: **Proactive Insurance Policy Guardian**, **The HangMan Game**, **KrushiPal**, **CultivateConnect**, **ARNav**. Positions 1–5 and endpoint locks matched. All five had empty/absent summary, image and live-demo fields. Four had GitHub destinations. ARNav had none. Keep current descriptions and labeled concept art as the fallback.
- The GitHub profile and four supplied repository URLs responded 200. The CultivateConnect body stalled on one request; a subsequent HEAD returned 200. LinkedIn returned 999 to automation, so the profile destination still needs human verification. The configured mail link is `mailto:shivam3782@gmail.com`. PDF returned 200, application/pdf, 61,477 bytes with a PDF signature. Favicon returned SVG. Admin deep link returned the SPA. Public session GET without a key returned 401. All production operations were read-only.
- Canonical currently points to the redirecting apex. No OG/Twitter metadata, share image, Person JSON-LD or custom router error boundary found. Both crawler-file URLs returned 200 HTML from the SPA fallback. Neither admin response headers nor rendered metadata contained noindex. Private Render deployment settings and field performance data remain unverified.

### Checks and evidence

| Check | Measured outcome |
| --- | --- |
| `npm run build` | Vite 8.3.8, 491 modules. Output guard passed. Main JS 479.94 kB / 155.33 kB gzip, public CSS 37.15 / 9.03, lazy admin JS 30.81 / 9.22 and CSS 25.91 / 5.26. |
| `npm run lint` | Exit 0. |
| `npm test` | **34 passed**, 0 failed or skipped. Configuration 4, interactions 16, review 14. An incidental Vite HMR port 24678 collision was logged. Check test-server HMR configuration during cleanup. |
| Real browser | Windows headless Chrome 157, local production build, both themes at widths 360, 390, 430, 768, 1024, 1440 and 1920. All five records rendered each time, no horizontal document overflow or uncaught page exceptions at those widths. Live and local at 390×844 and 1440×900 matched headings, ordering, section offsets and stylesheet hash. Mobile uses emulated touch. |
| Browser interactions | Desktop workbench switched to Explore, native project details expanded, search returned ARNav, Ctrl+K opened and Escape closed, PDF download event fired. Mobile menu navigated to Leadership and closed. Theme persisted across reload. Reduced motion suppressed the desktop mascot. Deep admin entry showed the access form; an unknown public route showed the styled 404. |
| Failure and admin coverage | Isolated browser interception delayed the list, returned 503, retried once and rendered an empty library. Initial status text was still identical at four seconds. A fixture 401 displayed the invalid-key message. Existing isolated tests exercised protected Express CRUD, position bounds and locks, failed saves, re-verification, discard/cancel and delete confirmation. Full signed-in browser walkthrough remains Stage 4. |
| Accessibility | axe WCAG 2 A/AA and 2.1 AA tags on local desktop homepage, both themes: zero detected violations. Token-pair checks passed. Assistive technology and physical mobile checks remain outside this baseline. |
| Lighthouse | One localhost production-preview navigation, Lighthouse 13.6.0 mobile simulated throttling, Chrome 157. Performance **96**, Accessibility **100**, Best Practices **100**, SEO **92**. LCP 2.8 s, CLS 0, TBT 30 ms. Invalid robots response flagged. This is lab data collected alongside browser QA. Field INP and production scores were not measured. |

[Machine-readable baseline](docs/qa/stage-0/baseline.json) · [Desktop dark](docs/qa/stage-0/live-1440-dark.png) · [Desktop light](docs/qa/stage-0/live-1440-light.png) · [Mobile dark](docs/qa/stage-0/live-390-dark.png) · [Mobile light](docs/qa/stage-0/live-390-light.png) · [Featured project](docs/qa/stage-0/project.png).

### Design decisions

| Decision | Reason | Alternative considered | Visitor impact |
| --- | --- | --- | --- |
| Keep the orange/teal palette, expressive type, workbench and project illustrations | Distinctive existing identity and working light theme | Template replacement | Returning visitors retain familiar navigation and personality. |
| Make Shivam's name and engineering focus lead the hero | Current 82px slogan consumes three lines at 1440px, while the name is 16px | Add another identity badge | Recruiters can identify the person and role immediately. |
| Keep Resume and Projects as primary paths | Real, independently testable destinations | More animated hero interactions | Short path to evidence. |
| Keep the API authoritative and the backend read-only | Ordered public data and working production admin | Hardcoded case studies or reseeding | UI reflects the records the owner maintains. |

Reference review: Himanshu Singh puts named products close to identity, Kunal Ghosh exposes a résumé and projects early, and Brittany Chiang pairs name and role with direct work evidence. Apply the information hierarchy to Shivam's own assets and verified content. [Himanshu Singh](https://himanshuhq.in/) · [Kunal Ghosh](https://kunal.wiki/) · [Brittany Chiang](https://brittanychiang.com/).

### Prioritized continuation plan

| Stage / priority | Observation and proposed change | Benefit and risk | Acceptance test |
| --- | --- | --- | --- |
| 1 · High · Hero | Name and role compete with a three-line slogan, separate identity row and closing strapline. At 1440×900 Projects begins at y=949, at 390×844 at y=737. Lead with name, one concrete work statement and the two primary actions. Adjust framing around the same artwork. | Faster identification. Typography can wrap at tablet widths. | Clear identity, actions visible without scrolling at 360×800, both modes still work, remeasure Projects offset in both themes. |
| 1 · High · Navigation and focus | Nav leads with About while the page leads with Projects. Initial programmatic focus paints orange lines around the whole main landmark. Align reading order and fix initial focus without losing keyboard skip/hash navigation. | Cleaner first paint and predictable navigation. Focus regressions would affect keyboard users. | First Tab reaches skip link on fresh visit; activation, deep links and cross-page anchors still focus their target. |
| 2 · Medium · Content | About and Mentoring repeat the same teaching evidence. Several headings hide their subject behind a slogan. Certification arrows imply links on static articles. | Faster scan and truthful affordances. Keep verified qualifications intact. | Read headings in isolation; preserve both education records, six credentials, email, accurate Mumbai clock and actual links. |
| 3 · High · Projects | All five use concept art. Art duplicates titles, and the slow-service message appears immediately and never changes. 45 s abort can end a long cold start. | More room for technical evidence and clearer recovery. Timing changes risk duplicate fetches or stale updates. | Fixture tests for fast, delayed, timeout, failure/retry, true empty, filtered empty, missing/failed image and locked order. |
| 4 · High · Admin | Existing tests cover important mutations but happy-dom cannot establish real dialog focus, keyboard placement or small-screen edit flow. | Protect a working owner workflow. Data mutation is the highest-risk operation. | Intercept every API operation in an isolated browser context; test rejected/accepted access, new/edit/reorder, 401 draft retention, delete cancel/confirm and lock. |
| 5 · Medium · Interaction | Certifications lack a direct command, and scroll spy maps Proof to Leadership. Several tiny controls/metadata deserve a usability pass; theme initializes a stored preference even on first visit. | Better discovery and ongoing accessibility. Preserve working keyboard paths. | Test menu, palette, focus return, system preference, reduced motion, keyboard-only and emulated touch through the width matrix. |
| 6 · High · SEO and reliability | Crawler URLs serve HTML, admin missing noindex, canonical redirects, no branded social preview or custom render-failure recovery. Main bundle gzip 155.33 kB, render-blocking third-party fonts. | Accurate crawl/share responses and robust loading. Asset and routing changes can regress API or deep links. | Verify content types, metadata, resume and API responses on preview; trigger isolated render error; compare measured lab runs under like conditions. |
| 6 · Low · Cleanup | Counter, Magnetic, useTypewriter and template assets outside the active app graph. SocialLinks still has a test consumer. Legacy blog code unmounted. | Less confusion for future maintainers. Deleting shared/tested modules carries risk. | Check import graph and tests before any deletion. Backend cleanup requires separate approval. |
| 7–8 · Release | Deliver screenshots, all gates and candidate Vercel URL in a PR to main. | Review the exact candidate on its real host. | Explicit owner approval of that candidate, then merge, verify production SHA/aliases/API/CV, record deployment or roll back. |

**Preserve:** current records, proxy, authentication, validated drafts, order rules, original illustration modes, theme contrast and real CV. **Optional/deferred:** new effects, a new framework, additional filters, synthetic demos or unapproved internship copy. The current five-entry library and measured baseline do not justify those additions.

### Stage 0 file ledger

All entries below are additions. No application, backend, dependency or deployment file changed.

| File | Purpose |
| --- | --- |
| `REDESIGN_LOG.md` | Verified audit, ranked plan, checks, release/rollback record |
| `PROJECT_STRUCTURE.md` | Annotated complete tree, API contracts, commands and deployment topology |
| `CODEX_HANDOFF.md` | Restart point and next stage |
| `docs/qa/stage-0/baseline.json` | Captured viewport observations and Lighthouse measurements |
| `docs/qa/stage-0/live-1440-dark.png`, `live-1440-light.png` | Live desktop baseline in both themes |
| `docs/qa/stage-0/live-390-dark.png`, `live-390-light.png` | Live mobile baseline in both themes |
| `docs/qa/stage-0/project.png` | Local production-build screenshot of featured card |

No repository dependency changes. Playwright, axe and Lighthouse ran from a temporary directory outside the project. No database migrations, seeds, production credentials or production mutations were involved. Existing isolated admin coverage uses fixtures.

## Stage 1 · November 19, 2026 · Hero and navigation review

**Branch** `portfolio-polish-2026`. Parent audit commit `4023dac`. Resolve the visual checkpoint with `git log -1 --format=%H --grep="^Lead the portfolio with identity"`. This is the first material visual checkpoint and awaits owner review.

Shivam's name leads the page, followed by a statement grounded in the insurance assistant and indoor navigation work. Projects and résumé are the two primary actions. The original SVG has a quieter frame with readable Build/Explore controls. Mobile still prioritizes project evidence before the workstation. Availability and location share one line. Projects now precedes About throughout the shared navigation registry.

| Modified file | Change and reason |
| --- | --- |
| `frontend/src/components/Hero.jsx` | Reworked title, real project examples and actions; consolidated repeated identity and removed the closing slogan. |
| `frontend/src/data/content.js` | Centralized hero role, introduction and location; matched navigation to document order. |
| `frontend/src/components/EngineeringScene.jsx` | Kept SVG geometry and both modes; simplified caption, language indicator and control labels. |
| `frontend/src/index.css` | Added shared metadata and control font sizes. |
| `frontend/src/App.css` | Adjusted type, frame, control spacing, responsive sizes and hero height; removed rules for retired elements. |
| `frontend/src/hooks/useSmoothScroll.js` | Initial entry and unanchored history traversal preserve browser focus. Explicit navigation still moves focus; changing motion preference no longer retriggers anchor navigation. |
| `frontend/tests/interaction.test.mjs` | Added regression for initial keyboard focus and explicit skip navigation. |
| `frontend/tests/review.test.mjs` | Updated navigation order assertion, retaining coverage for every section. |
| `CODEX_HANDOFF.md`, `PROJECT_STRUCTURE.md`, `REDESIGN_LOG.md` | Recorded new checkpoint, evidence tree, test inventory, pending work and decisions. |

Added `docs/qa/stage-1/1440-dark.png`, `1440-light.png`, `390-dark.png` and `390-light.png` for direct comparison with the live baseline. Added `docs/qa/stage-1/checks.json` for viewport measurements. No deleted files or dependency changes.

**Verification.** Build and output guard passed, 491 modules, main JS 155.23 kB gzip and public CSS 8.91 kB gzip. Lint passed. The first test run caught an existing assertion for the former menu order; after aligning that expectation with the intentional change, **35/35 passed**. Chrome 157 verified all 14 viewport/theme combinations. Each rendered five projects, had no document overflow or uncaught page errors, and placed both hero actions inside the viewport. First Tab reached the skip link, Enter focused main, View projects focused the gallery, and Explore changed mode. Both 390px themes passed the mobile Leadership navigation check. At 1440px both themes passed axe (zero tagged violations), résumé download and direct admin → command palette → Projects focus checks. Tests used read-only production GET or isolated fixtures. The Stage 0 Lighthouse scores have not been remeasured for Stage 1.

The Projects section boundary moved from 949 to **740px** at 1440×900 and from 737 to **617px** at 390×844. At 360×800 the bottom of the CTA group measured 545px. The first project card is further down the section. Keyboard focus remains visible when a visitor explicitly activates a skip or section link.

[Desktop after](docs/qa/stage-1/1440-dark.png) · [Mobile after](docs/qa/stage-1/390-light.png) · [All Stage 1 measurements](docs/qa/stage-1/checks.json).

**Next:** Review the hero and workbench before continuing to Stage 2. Planned content work reduces duplicated mentoring copy, clarifies headings and removes misleading certification link affordances. Next authenticated browser testing uses a local fixture. Rollback for this visual stage is a single revert of its commit on the feature branch.

## Release and rollback

Branch is local. PR, candidate preview, approval, merge and new deployment are pending. Before release, refresh the known-good SHA and deployment ID in case main advances. Re-run lint/build/tests and the browser suite on the release candidate. Verify the candidate's Vercel target says Preview before sharing.

If an approved release fails, restore the preceding verified deployment using the Vercel project's Rollback action and verify both domain aliases resolve to the restored deployment. At baseline that target is `dpl_4mHPSv4DjyhoPYdy1Pmq6C38z4yP` / `d78f784c09b68340ac7e723c582efd995b737cc9`. Reconcile Git through a revert PR for the release merge (`git revert -m 1 <merge-sha>` for a merge commit, ordinary revert for a squash). Recheck homepage, ordered GET, unauthenticated session 401, deep admin route and PDF. No MongoDB rollback is required for frontend-only changes.

## Stage 2 · Studio redesign and contact · November 19, 2026

Branch `portfolio-polish-2026`, parent `5e366be`. Commit subject **Rebuild the public portfolio around a studio workbench and contact panel**.

The owner requested a complete new UI after reviewing Stage 1. Rebuilt the hero, navigation, About, toolkit, records, credentials and contact as one composition. The forest-green contact panel offers copy-to-clipboard, live Mumbai time and direct destinations. Moved the mascot into About to clear footer controls. The original SVG opens in a native workbench dialog. Chose code-first project presentation from [Paco Coursey](https://paco.me), scannable experience from [Brittany Chiang](https://brittanychiang.com) and optional direct interaction from [Bruno Simon](https://bruno-simon.com). No new dependencies. The 108,342-byte WebP is illustrative artwork. Built-in ImageGen prompt: “Editorial product photograph of an imaginary personal engineering workbench for a software engineer's portfolio. Close three-quarter elevated view of a beautiful orange enamel retro-futurist compact CRT computer, broad curved dark glass screen with a single glowing pale aqua pixel cursor on its left, meticulously detailed vented orange casing, detachable tiny ivory mechanical keyboard and black coiled cable resting on a warm bone-white drafting desk. A small orange robot assistant with teal eyes sits next to the computer. Single coherent sculptural industrial design, tactile fine grain, restrained analog electronics. Warm sun from upper left through studio window, crisp geometric shadows on a matte apricot-orange seamless background. Full-bleed square still life, objects large in frame, polished industrial design magazine cover. No typography, no humans, no logos, no overlays, no watermark.”

Build, lint and 35/35 tests passed. Chrome tested both themes at 360, 390, 430, 768, 1024, 1101, 1440 and 1920px, including the marked viewport width. No horizontal overflow or page exceptions. Open, change scene mode, Escape, clipboard feedback and both desktop axe scans passed. Screenshots in `docs/qa/studio`.

Changed paths (including checkpoint documents):

- `docs/qa/studio/contact-1101.png`
- `docs/qa/studio/contact-390.png`
- `docs/qa/studio/hero-1440.png`
- `docs/qa/studio/hero-390.png`
- `frontend/public/workbench.webp`
- `frontend/src/studio.css`
- `frontend/src/App.jsx`
- `frontend/src/components/About.jsx`
- `frontend/src/components/Certifications.jsx`
- `frontend/src/components/Education.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/components/Hero.jsx`
- `frontend/src/components/Icon.jsx`
- `frontend/src/components/Mentoring.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Skills.jsx`
- `frontend/src/data/content.js`
- `frontend/src/index.css`
- `REDESIGN_LOG.md`
- `PROJECT_STRUCTURE.md`
- `CODEX_HANDOFF.md`

Next: Continue with the project gallery, compact project index and technology filtering.

## Stage 3 · Project discovery · November 19, 2026

Branch `portfolio-polish-2026`, parent `904d76b`. Commit subject **Add a compact work index and technology filtering to the live gallery**.

The Gallery pairs a featured brief with project-specific concept art. Index removes artwork for quick scanning. Both views combine free-text search with an exact technology filter derived from the API. Empty and error states remain distinct, the delayed cold-start notice appears at four seconds and the timeout allows 65 seconds. A failed image now only suppresses that URL. The list remains server-ordered and missing links stay hidden.

Build and lint passed, 36/36 tests passed. Chrome verified the five live projects, matching order across views, technology filtering, no-match recovery, slow→503→retry→empty fixture with two GETs. See `docs/qa/studio/projects.png`.

Changed paths (including checkpoint documents):

- `docs/qa/studio/projects.png`
- `frontend/src/components/ProjectCard.jsx`
- `frontend/src/components/ProjectIllustration.jsx`
- `frontend/src/components/Projects.jsx`
- `frontend/src/studio.css`
- `frontend/tests/interaction.test.mjs`
- `REDESIGN_LOG.md`
- `PROJECT_STRUCTURE.md`
- `CODEX_HANDOFF.md`

Next: Test and refine the authenticated workspace using isolated API fixtures.
