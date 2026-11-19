# Portfolio architecture and file inventory

Verified November 19, 2026 against Git tree `d78f784` and the running frontend. The inventory includes Stage 1 changes on portfolio-polish-2026. The three root handoff documents are maintained together.

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

## Runtime and content

- `main.jsx` mounts React StrictMode. `App.jsx` creates the browser router and composes the public shell. Homepage order is Hero, Projects, compact-only Workbench, About, Skills, Education, Mentoring, Certifications, then Contact/Footer. On wider screens the workstation lives inside Hero. Static facts and links come from `data/content.js`. Project records come from the API.
- Public anchors are `#home`, `#projects`, `#about`, `#skills`, `#education`, `#mentoring`, `#proof` and `#contact`. Skip links target `#main-content`. Unknown paths render a client-side 404 after the SPA rewrite.
- The shell lazy-loads the command palette and admin bundle. Admin routes are `/admin`, `/admin/projects`, `/admin/projects/new`, `/admin/projects/:id/edit` and `/admin/lock`. Unauthenticated deep links render the access form. An unknown authenticated admin route has its own recovery link.
- HTML selects a theme before React starts. CSS variables define both palettes and feed Tailwind v4. Manrope and JetBrains Mono load via Google Fonts. `App.css` owns public layout, controls and responsive rules. Admin CSS ships separately. Motion drives selected reveal/progress effects. Scrolling uses browser APIs.
- A project request goes from `lib/api.js` through same-origin `/api` to Render, then Express and Mongoose. Deployment and local proxies are configured separately. Only the backend reads MongoDB credentials. `GET /api/projects` returns ordered records; `GET /api/projects/:id` returns the stored document. `GET /api/projects/session` checks the key. `POST /api/projects`, `PUT /api/projects/:id` and `DELETE /api/projects/:id` require the `x-admin-key` header. List errors use 503, invalid fields/identifiers use 400, missing items use 404 and rejected keys use 401. API responses specify no-store.
- Project fields are `_id`, `name`, `description`, `summary`, `order`, `tech[]`, `githubUrl`, `liveUrl`, `imageUrl` and `createdAt`, plus Mongoose metadata. The list computes one-based `position` and `orderLocked`. Insurance and ARNav are identified by the server's name/repository rules. Middle entries sort by rank, creation time and ID. A move computes a neighboring rank for the edited entry. Admin name sorting and search only affect the displayed list.
- To maintain projects, open the authenticated project library, create or edit, validate and save. The editor accepts a short summary, full account, technology list, optional complete URLs and permitted position. Omitting an image gives labeled concept art. Use the locked endpoint bounds displayed by the editor. Session key lives in a React ref, clears on lock/unmount, and a 401 can trigger re-verification while retaining the draft. Form navigation guards and delete confirmation are part of the contract.
- Public configuration names are `VITE_API_URL` (blank selects same-origin) and `API_PROXY_TARGET` (Vite proxy only). Server names are `MONGO_URI`, `ADMIN_KEY`, `NODE_ENV`, `PORT`, `CORS_ORIGINS` and `DNS_SERVERS`. Keep private environment files outside Git.

## Deployment

GitHub main → Vercel project `sam3782s-projects/portfolio`, root `frontend`, Vite, Node 24.x, build `npm run build`, output `dist`. Vercel rewrites API requests to the deployed Render service before applying the SPA fallback. The apex redirects with 308 to HTTPS www. GitHub deployment history shows feature previews and successful production deployments for the two prior merges. No tracked GitHub Actions workflows or Render infrastructure manifest. Render dashboard configuration, database settings and account-level analytics were not inspected. No client analytics SDK appears in the app.

At audit time Vercel reported production `dpl_4mHPSv4DjyhoPYdy1Pmq6C38z4yP` Ready on both domain aliases. GitHub deployment 7786654366 identifies commit `d78f784c09b68340ac7e723c582efd995b737cc9`. See the [release ledger](REDESIGN_LOG.md) for verification and rollback.

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
│       └── stage-1/
│           ├── 1440-dark.png  — Desktop hero review, dark
│           ├── 1440-light.png  — Desktop hero review, light
│           ├── 390-dark.png  — Mobile hero review, dark
│           ├── 390-light.png  — Mobile hero review, light
│           └── checks.json  — Rendered dimensions, interaction run context and axe results
└── frontend/
    ├── .env.development  — Tracked Vite development mode configuration
    ├── .env.example  — Public list of configuration names and setup examples
    ├── .env.production  — Tracked Vite production mode configuration
    ├── .gitignore  — Local exclusions and tracked config exceptions
    ├── README.md  — Frontend setup and original Vite template notes
    ├── config/
    │   └── api-config.js  — Resolve and validate API origins at build time and runtime
    ├── eslint.config.js  — JSX, React hooks and refresh lint rules
    ├── index.html  — HTML entry, theme bootstrap, fonts and basic SEO metadata
    ├── package-lock.json  — npm reproducible dependency graph
    ├── package.json  — Dependencies, engine and run scripts
    ├── public/
    │   ├── Shivam_Sharma_Resume.pdf  — Recruiter download
    │   ├── favicon.svg  — Brand favicon
    │   └── icons.svg  — Public template icon sprite, no observed runtime reference
    ├── scripts/
    │   ├── verify-build-config.mjs  — Checks output for loopback endpoints and supplied secret values
    │   └── verify-live.mjs  — Historical localhost smoke harness with SSR, HTTP and real-list assumptions
    ├── src/
    │   ├── App.css  — Active public component styling, media queries and motion
    │   ├── App.jsx  — Router, lazy imports, page composition and global interactions
    │   ├── assets/
    │   │   ├── hero.png  — Unreferenced template artwork
    │   │   ├── react.svg  — Unreferenced React template artwork
    │   │   └── vite.svg  — Unreferenced Vite template artwork
    │   ├── components/
    │   │   ├── About.jsx  — Profile introduction and three technical practices
    │   │   ├── AdminPanel.jsx  — Workspace access, re-verification, lock, list loading and nested routes
    │   │   ├── Certifications.jsx  — Six learning milestones
    │   │   ├── CommandPalette.jsx  — Searchable native dialog, keyboard navigation and actions
    │   │   ├── Counter.jsx  — Legacy animated count component, outside app entry graph
    │   │   ├── Education.jsx  — Degree, institution, date and result rows
    │   │   ├── EngineeringScene.jsx  — Original interactive SVG, accessible description and mode controls
    │   │   ├── Footer.jsx  — Contact, download, live Mumbai time and motion toggle
    │   │   ├── Hero.jsx  — Opening identity, positioning, work/resume actions and desktop illustration
    │   │   ├── Icon.jsx  — Shared inline icon paths
    │   │   ├── Magnetic.jsx  — Legacy pointer-motion wrapper, outside app entry graph
    │   │   ├── Mascot.jsx  — Desktop assistant, shortcut and in-memory dismissal
    │   │   ├── Mentoring.jsx  — DevOps mentorship evidence
    │   │   ├── Navbar.jsx  — Sticky navigation, current section, mobile dialog and theme control
    │   │   ├── ProjectCard.jsx  — Ordered entry, preview, tech, disclosure and conditional destinations
    │   │   ├── ProjectIllustration.jsx  — Project-specific labeled vector concept art
    │   │   ├── Projects.jsx  — Fetch lifecycle, retry, filtered/empty views and featured gallery
    │   │   ├── RevealOnScroll.jsx  — One-time motion-aware entrance
    │   │   ├── ScrollProgress.jsx  — Public scroll indicator
    │   │   ├── SectionHeading.jsx  — Shared editorial section hierarchy
    │   │   ├── Skills.jsx  — Grouped technical skills
    │   │   ├── SocialLinks.jsx  — Standalone link group exercised by tests, outside current app entry graph
    │   │   ├── Surface.jsx  — Interactive article surface used by Mentoring
    │   │   └── admin/
    │   │       ├── ConfirmDialog.jsx  — Native confirmation dialog with focus restoration and pending states
    │   │       ├── ProjectEditor.jsx  — Create/edit form, validation, preview, save and dirty navigation guards
    │   │       ├── ProjectLibrary.jsx  — Overview, search, local sorting, refresh and delete entry points
    │   │       ├── ProjectMedia.jsx  — Admin image preview/error feedback and fallback artwork
    │   │       ├── TechnologyPicker.jsx  — Accessible suggestions, keyboard selection and custom tech tags
    │   │       └── admin.css  — Workspace layout, editor controls, dialogs and responsive styling
    │   ├── data/
    │   │   └── content.js  — Verified profile content, external links and section registry
    │   ├── hooks/
    │   │   ├── useCompactLayout.js  — Reactive 700px breakpoint and scene placement
    │   │   ├── useKonami.js  — Keyboard sequence and temporary celebration
    │   │   ├── useMagnetic.js  — Motion for legacy Magnetic component
    │   │   ├── useReducedMotion.js  — System preference and shared pause state
    │   │   ├── useScrollSpy.js  — Determine active navigation section while scrolling
    │   │   ├── useSmoothScroll.js  — Hash scrolling, focus and overlay body scroll lock
    │   │   ├── useSpotlight.js  — Pointer-aware surface highlight and optional tilt
    │   │   ├── useTheme.js  — Theme application and local preference persistence
    │   │   └── useTypewriter.js  — Legacy rotating text effect, outside app entry graph
    │   ├── index.css  — Tailwind import, dark/light tokens, base elements and focus styling
    │   ├── lib/
    │   │   ├── api.js  — Project fetch, structured errors and safe URL parsing
    │   │   └── projects.js  — Summary fallback, search/sort, metrics, position bounds and form validation
    │   └── main.jsx  — Mount React root
    ├── tests/
    │   ├── configuration.test.mjs  — 4 API origin, Vite and server configuration tests
    │   ├── interaction.test.mjs  — 17 isolated interactive component, focus and admin tests
    │   └── review.test.mjs  — 14 API, Express, ordering, rendering, contrast and asset tests
    ├── vercel.json  — Build output, ordered API/SPA rewrites and response header
    └── vite.config.js  — React and Tailwind plugins, API origin guard and local proxies
```

### Stage 2 update

App now places the workbench in a hero dialog, the mascot in About, and the education/mentoring sections in a responsive spread. `frontend/src/studio.css` owns the new public layouts; `frontend/public/workbench.webp` is the optimized original hero art. Added screenshot files `docs/qa/studio/hero-1440.png`, `hero-390.png`, `contact-1101.png` and `contact-390.png`. The Stage 0/1 inventory above describes the preceding baseline.

### Stage 3 update

`Projects.jsx` owns gallery/index mode, query and technology filters, and request status. `ProjectCard.jsx` supports a text-only index. `docs/qa/studio/projects.png` captures the gallery. The interaction suite now includes an index/filter regression.

### Stage 4 update

Added `frontend/scripts/test-admin-browser.mjs` and `npm run test:admin-browser`. Start a local built preview, set `QA_BASE_URL` to its loopback origin (default port 4187), then run the script from frontend with Chrome installed. `QA_BROWSER` optionally selects another installed Chromium channel. Fixtures exist only in the test context.
