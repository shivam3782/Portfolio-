// Read-only integration review against the configured API and local Vite server.
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
const originalFetch = globalThis.fetch;
// Node has no document origin; resolve the browser-relative API through local Vite's proxy.
globalThis.fetch = (input, options) =>
  originalFetch(
    typeof input === "string" && input.startsWith("/")
      ? new URL(input, "http://localhost:5173")
      : input,
    options,
  );
try {
  const { projectRequest } = await vite.ssrLoadModule("/src/lib/api.js");
  const { default: ProjectCard } = await vite.ssrLoadModule(
    "/src/components/ProjectCard.jsx",
  );
  const { default: Navbar } = await vite.ssrLoadModule(
    "/src/components/Navbar.jsx",
  );
  const { default: ProjectLibrary } = await vite.ssrLoadModule(
    "/src/components/admin/ProjectLibrary.jsx",
  );
  const { sections, links } = await vite.ssrLoadModule("/src/data/content.js");
  const projects = await projectRequest("", {
    signal: AbortSignal.timeout(20000),
  });
  assert.deepEqual(
    projects.map((p) => p.name),
    [
      "Proactive Insurance Policy Guardian",
      "The HangMan Game",
      "KrushiPal",
      "CultivateConnect",
      "ARNav",
    ],
  );
  assert.match(projects[0].name, /Proactive Insurance/);
  assert.equal(projects.at(-1).name, "ARNav");
  assert.deepEqual(
    projects.map((p) => p.position),
    projects.map((p, i) => i + 1),
  );
  assert.equal(
    projects.filter(
      (p) =>
        p.githubUrl === "https://github.com/shivam3782/proactive_insurance",
    ).length,
    1,
  );
  assert.equal(projects.filter((p) => p.name === "KrushiPal").length, 1);
  assert.equal(
    projects.find((p) => p.name === "KrushiPal").githubUrl,
    "https://github.com/shivam3782/KrushiPal",
  );
  for (const [index, project] of projects.entries()) {
    const html = renderToStaticMarkup(
      createElement(ProjectCard, { project, index, featured: index === 0 }),
    );
    assert.ok(html.includes(project.name));
    for (const tech of project.tech || []) assert.ok(html.includes(tech));
    assert.ok(!html.includes("coming soon"));
    if (project.githubUrl)
      assert.ok(html.includes('href="' + project.githubUrl + '"'));
  }
  const nav = renderToStaticMarkup(
    createElement(
      MemoryRouter,
      null,
      createElement(Navbar, {
        onCommand() {},
        theme: "dark",
        onTheme() {},
        onMenu() {},
      }),
    ),
  );
  for (const [id] of sections) assert.ok(nav.includes('href="/#' + id + '"'));
  assert.ok(nav.includes('href="/#mentoring"'));
  assert.ok(nav.includes("Leadership"));
  const library = renderToStaticMarkup(
    createElement(
      MemoryRouter,
      null,
      createElement(ProjectLibrary, {
        projects,
        overview: true,
        loading: false,
        loadedAt: new Date(),
        onRefresh() {},
        onDelete() {},
      }),
    ),
  );
  assert.ok(library.includes("Missing preview images"));
  assert.ok(library.includes("Missing demo links"));
  for (const project of projects) assert.ok(library.includes(project.name));
  assert.equal((library.match(/<option /g) || []).length, 2);
  const root = await fetch("http://localhost:5173/");
  const admin = await fetch("http://localhost:5173/admin");
  const adminRoutes = [
    "/admin/projects",
    "/admin/projects/new",
    "/admin/projects/" +
      projects.find((p) => p.name === "KrushiPal")._id +
      "/edit",
  ];
  for (const route of adminRoutes) {
    const response = await fetch("http://localhost:5173" + route);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get("content-type").includes("text/html"));
  }
  const resume = await fetch("http://localhost:5173" + links.cv);
  assert.equal(root.status, 200);
  assert.equal(admin.status, 200);
  assert.equal(resume.status, 200);
  assert.ok(resume.headers.get("content-type").includes("application/pdf"));
  const bytes = Buffer.from(await resume.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  console.log(
    JSON.stringify(
      {
        projectCount: projects.length,
        projects: projects.map((p) => p.name),
        serverRendering: "PASS",
        adminLibraryRendering: "PASS",
        compactSortOptions: 2,
        navigationHrefs: "PASS",
        leadershipHref: "PASS",
        homeHttp: root.status,
        adminHttp: admin.status,
        editorRouteHttp: "PASS (SPA shells only)",
        resumeBytes: bytes.length,
        linkedinHref: links.linkedin,
        projectAssets: projects.map((p) => ({
          name: p.name,
          imageUrl: p.imageUrl || null,
          liveUrl: p.liveUrl || null,
        })),
        browserInteraction: "NOT TESTED",
      },
      null,
      2,
    ),
  );
} finally {
  globalThis.fetch = originalFetch;
  await vite.close();
}
