# Shivam Sharma’s portfolio

React and Vite serve the public studio and project management workspace. Vercel builds this directory and proxies `/api` to the existing Express service on Render.

Use Node 22.12 or newer. From the repository root, run `npm ci --prefix backend` and `npm ci --prefix frontend`. The frontend test suite imports the backend router.

From this directory run `npm run dev` for development, `npm run build` for the verified production bundle, `npm run preview` to serve the bundle, and `npm run lint` plus `npm test` for static and isolated regression checks. For browser CRUD regression, run a local preview on port 4187 and `npm run test:admin-browser` with Chrome installed. Set `QA_BASE_URL` to use a different loopback port.

The public API client uses same-origin requests by default. Local Vite forwards to port 3000 unless `API_PROXY_TARGET` selects another backend. For interactive CRUD, use a disposable database and local key. Backend secrets belong only on the server.

[Architecture and inventory](../PROJECT_STRUCTURE.md) · [Changes, screenshots and rollback](../REDESIGN_LOG.md) · [Continuation checkpoint](../CODEX_HANDOFF.md)
