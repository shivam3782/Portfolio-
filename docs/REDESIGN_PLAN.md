# Retro 3D portfolio redesign

## Audit — 21 November 2026

- React 19 / Vite, plain JSX and global CSS; React Router; lazy admin. Express 5 / Mongoose 9, project CRUD protected by an in-memory admin key. Existing database and all five projects are reachable locally. No production writes performed.
- Existing dependencies on disk differ from lockfile: initial build fails resolving motion/react. Restore with npm ci; Windows preview processes must stop to unlock native binaries.
- Public content outside projects is hard-coded. Projects have a 45-second loading path and no offline snapshot. Captured the public API's actual five records as a bundled fallback.
- Current design is editorial, not retro. Remote Google fonts, motion/Lenis, scroll handlers, large CSS, no project routes, contact delivery, error boundary, social cards, sitemap or bot-visible project metadata.
- Admin supports projects only, with safe URL validation, dirty-form guard, accessible dialogs, and server-authenticated session. Preserve these capabilities and authentication.
- Project model has no case-study/gallery/status fields. Resume PDF exists. Education, skills, leadership and existing metrics are sourced from src/data/content.js, not invented.
- Existing blog model/routes are retained. Production API rewrite stays compatible. Existing untracked PORTFOLIO_CHANGE_REPORT.md is user-owned and excluded from commits.

## Direction and architecture

An understated console title screen: charcoal, orange and teal, oversized name, pixel display accents, readable sans text, a CSS perspective workstation, cartridge project cards, restrained grid and depth. Light theme uses cool white surfaces and darker accessible accents. No WebGL dependency or audio. Effects toggle and reduced-motion support.

Order: hero → About → Projects → Skills → Education → Leadership → Contact → footer. Preserve navbar labels and /#mentoring compatibility. Add /projects/:slug, retain /admin/*, custom 404. Keep JSX; document new public interfaces with JSDoc.

Primitives: Button/ResumeLink, Badge, SectionHeader, Card, Modal, Skeleton; shared content context, safe links, route focus/anchor handler, metadata. Domain components for hero, project card/detail/gallery, contact, profile editor. Native dialog provides modal focus containment. CSS/IntersectionObserver replace animation libraries.

CMS: additive Profile singleton with typed/validated profile, links, resume, stats, sections and OG fields; existing project fields gain status, problem, solution, role, features, architecture, challenges, learning, screenshot entries. Defaults derive from existing content; missing narratives use explicit TODO values in CMS and neutral public unavailable states. No destructive data migration.

SEO: generate static HTML snapshots for home and known project routes at build time with unique metadata and JSON-LD; retain SPA admin fallback. Rebuild after CMS edits to refresh crawler snapshots; runtime content refreshes from API. Set the public backend origin through `VITE_API_URL` when the host has no same-origin API proxy.

Contact: validated, rate-limited Express endpoint stores messages in MongoDB as the delivery path, with an authenticated inbox in admin. A successful response requires durable persistence; no simulated success in production. Optional anonymous aggregate resume click counter, no cookies or visitor identifiers.

## Phases and verification

- [x] Inspect repository, API data, configuration and current architecture.
- [x] Restore dependencies, inspect baseline and record mobile/desktop Lighthouse.
- [x] Implement design tokens, fonts, responsive public shell and scene.
- [x] Implement data fallback, project routes, gallery, command menu, contact, error states.
- [x] Add backward-compatible CMS fields, validation, profile editor/inbox, server protections.
- [x] Generate share assets, static route metadata, sitemap and favicons.
- [x] Run lint/format, unit/component, server and browser tests.
- [x] Run axe for every public route in both themes; inspect screenshots at 360/390/768/1024/1280/1440/1920.
- [x] Run final production Lighthouse, degraded mode checks, links/resume and admin regression checks. **Open gate:** mobile Performance is 77, below the requested 90; see `docs/VERIFICATION.md`.
- [x] Document setup, new fields, deployment/rollback and owner tasks; commit logical phases.

## Risks and decisions

- Use CSS 3D: no GPU render loop, no pixel-ratio cost, static on mobile/reduced-motion/low-power. Lazily import the decorative scene.
- Content claims remain verbatim or conservative summaries of verified repository/API data. No skill percentages or inferred proficiency. Empty categories are not fabricated.
- Existing MongoDB is real: integration writes run against a separate ephemeral test database, never the live project records. Mail forwarding needs owner SMTP configuration; the admin inbox works without it.
- Lighthouse synthetic metrics vary. Record exact reports; do not claim field INP from a lab run. Hosting/DNS and actual mail receipt remain post-release checks.
- Tests exercise contracts and interactions, not CSS implementation details. Browser binaries may require installation. All limitations will be explicit.

## Evidence

Baseline/final reports and screenshot inventory will be recorded in docs/VERIFICATION.md. Automated reports remain ignored to avoid committing large machine-specific artifacts.
