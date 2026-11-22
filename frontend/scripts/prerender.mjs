import { createServer, loadEnv } from "vite";
import { createElement } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
const env = loadEnv("production", process.cwd(), ["VITE_", "SNAPSHOT_"]);
const origin = (env.VITE_SITE_URL || "https://www.shivam-sharma.me").replace(
  /\/$/,
  "",
);
let profile = JSON.parse(await readFile("src/data/profile.json", "utf8"));
let projects = JSON.parse(
  await readFile("src/data/projects.snapshot.json", "utf8"),
);
if (env.SNAPSHOT_API_URL) {
  [profile, projects] = await Promise.all(
    ["/profile", "/projects"].map(async (path) => {
      const response = await fetch(
        env.SNAPSHOT_API_URL.replace(/\/$/, "") + "/api" + path,
        { signal: AbortSignal.timeout(15000) },
      );
      if (!response.ok)
        throw new Error(
          "CMS snapshot unavailable. Build stopped to avoid silently stale SEO.",
        );
      return response.json();
    }),
  );
}
const template = await readFile("dist/index.html", "utf8");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const slugFor = (project) =>
  project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
try {
  const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
  for (const route of [
    "/",
    ...projects.map((p) => "/projects/" + slugFor(p)),
    "/404",
  ]) {
    const markup = await new Promise((resolve, reject) => {
      const stream = new PassThrough();
      let result = "";
      stream.on("data", (chunk) => {
        result += chunk;
      });
      stream.on("end", () => resolve(result));
      stream.on("error", reject);
      const rendered = renderToPipeableStream(
        createElement(App, {
          url: route,
          initialContent: { profile, projects },
        }),
        {
          onAllReady() {
            rendered.pipe(stream);
          },
          onError: reject,
        },
      );
    });
    const project = projects.find((p) => route === "/projects/" + slugFor(p));
    const title = project
      ? project.name + " | " + profile.name
      : route === "/"
        ? profile.name + " | Software Engineer"
        : "Page not found | " + profile.name;
    const description =
      project?.summary || project?.description || profile.valueProposition;
    const image = new URL(profile.ogImage || "/og-image.png", origin).href;
    let html = template
      .replace('<div id="root"></div>', '<div id="root">' + markup + "</div>")
      .replace(/<title>.*?<\/title>/, "<title>" + escape(title) + "</title>");
    for (const [selector, value] of [
      ['name="description"', description],
      ['property="og:title"', title],
      ['property="og:description"', description],
      ['property="og:url"', origin + route],
      ['property="og:image"', image],
      ['name="twitter:title"', title],
      ['name="twitter:description"', description],
      ['name="twitter:image"', image],
    ])
      html = html.replace(
        new RegExp("(<meta " + selector + ' content=")[^"]*("[^>]*>)'),
        "$1" + escape(value).replace(/\$/g, "$$$$") + "$2",
      );
    html = html.replace(
      /(<link rel="canonical" href=")[^"]*/,
      "$1" + origin + route,
    );
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      url: origin,
      jobTitle: profile.role,
      sameAs: [profile.githubUrl, profile.linkedinUrl].filter(Boolean),
      subjectOf: projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.name,
        url: origin + "/projects/" + slugFor(p),
      })),
    };
    html = html
      .replace(
        "</head>",
        `<script type="application/ld+json">${json(schema)}</script>${route === "/404" ? '<meta name="robots" content="noindex" />' : ""}</head>`,
      )
      .replace(
        "</body>",
        `<script id="portfolio-data" type="application/json">${json({ profile, projects })}</script></body>`,
      );
    const output =
      route === "/"
        ? "dist/index.html"
        : route === "/404"
          ? "dist/404.html"
          : "dist" + route + "/index.html";
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  await writeFile(
    "dist/app.html",
    template.replace(
      "</head>",
      '<meta name="robots" content="noindex" /></head>',
    ),
  );
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`,
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", ...projects.map((p) => "/projects/" + slugFor(p))].map((route) => `<url><loc>${escape(origin + route)}</loc></url>`).join("")}</urlset>`,
  );
  console.log(
    `Server-rendered home, ${projects.length} project routes and 404. Client hydrates existing HTML.`,
  );
} finally {
  await vite.close();
}
