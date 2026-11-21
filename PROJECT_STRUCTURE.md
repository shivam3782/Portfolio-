# Portfolio architecture and file inventory

Verified November 21, 2026 against the release candidate on `portfolio-polish-2026` and its built frontend. The three root handoff documents are maintained together.

## Run locally

Use Node 22.12+ (Vercel uses 24.x). Baseline used Node 24.13.1 and npm 11.8.0 with existing dependencies. For a fresh checkout install **both** lockfiles. Some frontend tests import the real Express router and backend libraries.

```powershell
npm ci --prefix backend
npm ci --prefix frontend
cd frontend
npm run lint
npm test
npm run build
npm run preview
```

Vite dev and preview default to localhost port 5173. Use `npm run dev` for source edits. For interactive admin work use an isolated database: from `backend`, configure a disposable local MongoDB connection and a local test key, then `npm run dev` (or `npm start`). Only start the service after checking which database the environment selects. The default local frontend proxy targets port 3000. The automated CRUD suite uses an in-memory stand-in and needs no running database. For a read-only public baseline the audit used the built frontend, a loopback-only port and the public Render upstream. Logged-in production CRUD is outside this review.

For a public design review, build the frontend and run `npm run preview:public` from `frontend/`. Open `http://127.0.0.1:4187/`. This mode fetches the published project list anonymously. Other API routes and methods return 403 locally. The ordinary dev/preview commands still support a local backend for interactive editing.

With the preview open, run `npm run test:public-browser` and `npm run test:admin-browser` in another frontend terminal. Both suites intercept API traffic with isolated fixtures. Installed Chrome is the default. Set `QA_BROWSER=msedge` for Edge.

## Runtime and content

- `main.jsx` mounts React StrictMode. `App.jsx` creates the browser router and composes the public shell. Homepage order is Hero, Projects, About, Skills, Education and Mentoring, Certifications, then Contact/Footer. The original interactive workstation opens from the hero in a native dialog on every screen size. Static facts and links come from `data/content.js`. Project records come from the API.
- Public anchors are `#home`, `#projects`, `#about`, `#skills`, `#education`, `#mentoring`, `#proof` and `#contact`. Project headings link to `/#project-<record ID>`; a direct visit waits for the API response before focusing the card. Skip links target `#main-content`. Unknown paths render a client-side 404 after the SPA rewrite.
- The shell lazy-loads the command palette and admin bundle. Admin routes are `/admin`, `/admin/projects`, `/admin/projects/new`, `/admin/projects/:id/edit` and `/admin/lock`. Unauthenticated deep links render the access form. An unknown authenticated admin route has its own recovery link.
- HTML selects a theme before React starts. CSS variables define both palettes and feed Tailwind v4. Manrope is self-hosted with its OFL license. Metadata uses system monospace. `App.css` owns public layout, controls and responsive rules. Admin CSS ships separately. Studio layout is in `studio.css`. A CSS route transition and browser-native scroll indicator respect motion preferences. Scrolling uses browser APIs.
- A project request goes from `lib/api.js` through same-origin `/api` to Render, then Express and Mongoose. Deployment and local proxies are configured separately. Only the backend reads MongoDB credentials. `GET /api/projects` returns ordered records; `GET /api/projects/:id` returns the stored document. `GET /api/projects/session` checks the key. `POST /api/projects`, `PUT /api/projects/:id` and `DELETE /api/projects/:id` require the `x-admin-key` header. List errors use 503, invalid fields/identifiers use 400, missing items use 404 and rejected keys use 401. API responses specify no-store.
- Project fields are `_id`, `name`, `description`, `summary`, `order`, `tech[]`, `githubUrl`, `liveUrl`, `imageUrl` and `createdAt`, plus Mongoose metadata. The list computes one-based `position` and `orderLocked`. Insurance and ARNav are identified by the server's name/repository rules. Middle entries sort by rank, creation time and ID. A move computes a neighboring rank for the edited entry. Admin name sorting and search only affect the displayed list.
- To maintain projects, open the authenticated project library, create or edit, validate and save. The editor accepts a short summary, full account, technology list, optional complete URLs and permitted position. Omitting an image gives labeled concept art. Use the locked endpoint bounds displayed by the editor. Session key lives in a React ref, clears on lock/unmount, and a 401 can trigger re-verification while retaining the draft. Form navigation guards and delete confirmation are part of the contract.
- Public configuration names are `VITE_API_URL` (blank selects same-origin) and `API_PROXY_TARGET` (Vite proxy only). Server names are `MONGO_URI`, `ADMIN_KEY`, `NODE_ENV`, `PORT`, `CORS_ORIGINS` and `DNS_SERVERS`. Keep private environment files outside Git.

## Deployment

GitHub main → Vercel project `sam3782s-projects/portfolio`, root `frontend`, Vite, Node 24.x, build `npm run build`, output `dist`. Vercel rewrites API requests to the deployed Render service before applying the SPA fallback. The apex redirects with 308 to HTTPS www. GitHub deployment history shows feature previews and successful production deployments for the two prior merges. No tracked GitHub Actions workflows or Render infrastructure manifest. Render dashboard configuration, database settings and account-level analytics were not inspected. No client analytics SDK appears in the app.

At audit time Vercel reported production `dpl_4mHPSv4DjyhoPYdy1Pmq6C38z4yP` Ready on both domain aliases. GitHub deployment 7786654366 identifies commit `d78f784c09b68340ac7e723c582efd995b737cc9`. See the [release ledger](REDESIGN_LOG.md) for verification and rollback.

The November 21 release checkpoint verified the same production baseline. PR #3 carries the studio redesign and the subsequent owner-requested quality pass. Vercel publishes an authenticated preview for this branch. [Pull request](https://github.com/shivam3782/Portfolio-/pull/3) · [Branch preview](https://portfolio-git-portfolio-polish-2026-sam3782s-projects.vercel.app)

## File tree

Paths are repository relative. Generated dependencies, build output, Git internals and private environment files are omitted. Tracked mode configuration files are listed by name only. An empty local `backend/controllers/` directory has no Git entry. Seven ignored historical root documents exist only in this checkout: `DEPLOYMENT_GUIDE.md`, `PROJECT_ASSETS.md`, `REDESIGN_REVIEW.md`, `REVIEW_GUIDE.md`, `REVIEW_REPORT.md`, `SOURCE_CODE.md`, `VISUAL_QA.md`. They capture the earlier release and its then-blocked browser checks.

```text
├── .gitignore  — Local exclusions and tracked config exceptions
├── CODEX_HANDOFF.md  — Resume point, remaining gates and checkpoint references
├── PROJECT_STRUCTURE.md  — File inventory and operational architecture
├── REDESIGN_LOG.md  — Baseline evidence, design decisions and release ledger
├── backend/
│   ├── .env.example  — Public list of configuration names and setup examples
│   ├── index.js  — Connect MongoDB before binding Express, mount project routes and no-store middleware
│   ├── lib/
│   │   ├── projectPresentation.js  — Stable list ordering, endpoint locks and single-record rank calculation
│   │   ├── projectValidation.js  — Validate and allowlist the write payload
│   │   └── serverConfig.js  — Port, DNS and exact CORS configuration
│   ├── middleware/
│   │   └── checkAdmin.js  — Validate the transient request header, reject missing or incorrect keys
│   ├── models/
│   │   ├── Blog.js  — Legacy Mongoose blog schema, outside the running application
│   │   └── Project.js  — Stored portfolio project schema
│   ├── package-lock.json  — npm reproducible dependency graph
│   ├── package.json  — Dependencies, engine and run scripts
│   ├── routes/
│   │   ├── blogRoutes.js  — Legacy unmounted blog router
│   │   └── projectRoutes.js  — Public list/detail and protected session/CRUD
│   └── scripts/
│       ├── add-requested-projects.cjs  — Historical data-writing maintenance script
│       └── initialize-project-order.cjs  — Historical MongoDB ordering migration
├── docs/
│   └── qa/
│       ├── stage-0/
│       │   ├── baseline.json  — Measured baseline viewport and Lighthouse results
│       │   ├── live-1440-dark.png  — Live homepage screenshot, named by viewport width and theme
│       │   ├── live-1440-light.png  — Live homepage screenshot, named by viewport width and theme
│       │   ├── live-390-dark.png  — Live homepage screenshot, named by viewport width and theme
│       │   ├── live-390-light.png  — Live homepage screenshot, named by viewport width and theme
│       │   └── project.png  — Baseline featured project capture from local build
│       ├── stage-1/
│       │   ├── 1440-dark.png  — Desktop hero review, dark
│       │   ├── 1440-light.png  — Desktop hero review, light
│       │   ├── 390-dark.png  — Mobile hero review, dark
│       │   ├── 390-light.png  — Mobile hero review, light
│       │   └── checks.json  — Rendered dimensions, interaction run context and axe results
│       └── studio/
│           ├── contact-1101.png  — Contact at the review viewport width
│           ├── contact-390.png  — Mobile contact layout
│           ├── hero-1440.png  — Final desktop opening viewport
│           ├── hero-390.png  — Final mobile opening viewport
│           ├── projects.png  — Final live-data project gallery
│           └── results.json  — Final mobile Lighthouse measurement and browser matrix
└── frontend/
    ├── .env.development  — Tracked Vite development mode configuration
    ├── .env.example  — Public list of configuration names and setup examples
    ├── .env.production  — Tracked Vite production mode configuration
    ├── .gitignore  — Local exclusions and tracked config exceptions
    ├── README.md  — Local setup, scripts and current documentation links
    ├── config/
    │   └── api-config.js  — Resolve and validate API origins at build time and runtime
    ├── eslint.config.js  — JSX, React hooks and refresh lint rules
    ├── index.html  — Prepaint theme, font preload, canonical, structured data and social metadata
    ├── package-lock.json  — npm reproducible dependency graph
    ├── package.json  — Dependencies, engine and run scripts
    ├── public/
    │   ├── Shivam_Sharma_Resume.pdf  — Recruiter download
    │   ├── favicon.svg  — Brand favicon
    │   ├── fonts/
    │   │   ├── Manrope-OFL.txt  — Font copyright and SIL Open Font License
    │   │   └── manrope-latin.woff2  — Self-hosted Manrope Latin variable font
    │   ├── icons.svg  — Public template icon sprite, no observed runtime reference
    │   ├── robots.txt  — Crawler policy and canonical sitemap location
    │   ├── share.jpg  — 1200×630 social preview
    │   ├── sitemap.xml  — Canonical public URL
    │   └── workbench.webp  — Original compressed hero artwork, also used in sign-in
    ├── scripts/
    │   ├── test-admin-browser.mjs  — Local-only Chrome suite for authentication, drafts, placement and CRUD
    │   ├── test-public-browser.mjs  — Isolated browser checks for project permalinks, navigation, dialogs and motion
    │   ├── verify-build-config.mjs  — Checks output for loopback endpoints and supplied secret values
    │   └── verify-live.mjs  — Historical localhost smoke harness with SSR, HTTP and real-list assumptions
    ├── src/
    │   ├── App.css  — Active public component styling, media queries and motion
    │   ├── App.jsx  — Public shell, lazy admin/palette, routes, indexing metadata and recovery
    │   ├── components/
    │   │   ├── About.jsx  — Profile narrative and in-flow optional mascot
    │   │   ├── AdminPanel.jsx  — Workspace access, re-verification, lock, list loading and nested routes
    │   │   ├── Certifications.jsx  — Six learning milestones
    │   │   ├── CommandPalette.jsx  — Searchable native dialog, keyboard navigation and actions
    │   │   ├── Education.jsx  — Degree, institution, date and result rows
    │   │   ├── EngineeringScene.jsx  — Original interactive SVG, accessible description and mode controls
    │   │   ├── Footer.jsx  — Direct contact, copy email, Mumbai time and preferences
    │   │   ├── Hero.jsx  — Studio introduction, original cover and native workbench dialog
    │   │   ├── Icon.jsx  — Shared inline icon paths
    │   │   ├── Mascot.jsx  — Desktop assistant, shortcut and in-memory dismissal
    │   │   ├── Mentoring.jsx  — DevOps mentorship evidence
    │   │   ├── Navbar.jsx  — Sticky navigation, current section, mobile dialog and theme control
    │   │   ├── ProjectCard.jsx  — Ordered entry, preview, tech, disclosure and conditional destinations
    │   │   ├── ProjectIllustration.jsx  — Project-specific labeled vector concept art
    │   │   ├── Projects.jsx  — Slow/error/retry states, live filters and gallery/index selection
    │   │   ├── ScrollProgress.jsx  — Native scroll progress with resize observation
    │   │   ├── Skills.jsx  — Technical toolkit grid
    │   │   ├── SocialLinks.jsx  — Standalone link group exercised by tests, outside current app entry graph
    │   │   └── admin/
    │   │       ├── ConfirmDialog.jsx  — Native confirmation dialog with focus restoration and pending states
    │   │       ├── ProjectEditor.jsx  — Create/edit form, validation, preview, save and dirty navigation guards
    │   │       ├── ProjectLibrary.jsx  — Search, temporary sort and actionable missing-asset metrics
    │   │       ├── ProjectMedia.jsx  — Admin image preview/error feedback and fallback artwork
    │   │       ├── TechnologyPicker.jsx  — Accessible suggestions, keyboard selection and custom tech tags
    │   │       └── admin.css  — Workspace layout, editor controls, dialogs and responsive styling
    │   ├── data/
    │   │   └── content.js  — Verified profile content, external links and section registry
    │   ├── hooks/
    │   │   ├── useKonami.js  — Keyboard sequence and temporary celebration
    │   │   ├── useReducedMotion.js  — System preference and shared pause state
    │   │   ├── useScrollSpy.js  — Determine active navigation section while scrolling
    │   │   ├── useSmoothScroll.js  — Hash scrolling, focus and overlay body scroll lock
    │   │   └── useTheme.js  — Theme application and local preference persistence
    │   ├── index.css  — Self-hosted font, palette, Tailwind bridge and accessibility primitives
    │   ├── lib/
    │   │   ├── api.js  — Project fetch, structured errors and safe URL parsing
    │   │   └── projects.js  — Summary fallback, search/sort, metrics, position bounds and form validation
    │   ├── main.jsx  — Mount React root
    │   └── studio.css  — Studio typography, exhibit, gallery/index, personal records and contact layouts
    ├── tests/
    │   ├── configuration.test.mjs  — 4 API origin, Vite and server configuration tests
    │   ├── interaction.test.mjs  — 18 isolated interaction, navigation and project tests
    │   └── review.test.mjs  — 14 API, Express, ordering, rendering, contrast and asset tests
    ├── vercel.json  — Build output, ordered API/SPA rewrites and response header
    └── vite.config.js  — React and Tailwind plugins, API origin guard, local backend proxy and read-only public review mode
```

### Stage 6 update

The tree above is the current tracked inventory. Vercel applies an X-Robots-Tag on admin routes. Manrope is bundled with its license. Runtime no longer imports Motion or Lenis. Native route recovery handles failed lazy chunks. Measurements and final screens are in `docs/qa/studio`.
