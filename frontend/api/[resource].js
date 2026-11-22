import { env } from "node:process";
import { resolveApiOrigin } from "../config/api-config.js";

const publicPaths = new Set(["/api/profile", "/api/projects"]);

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  const { pathname } = new URL(request.url, "https://localhost");
  if (!publicPaths.has(pathname))
    return response.status(404).json({ message: "Not found." });
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    const origin = resolveApiOrigin(
      env.VITE_API_URL ||
        (env.VERCEL_ENV === "preview" && env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
          : ""),
      true,
    );
    if (!origin)
      return response.status(503).json({ message: "Content API unavailable." });

    const upstream = await fetch(new URL(pathname, origin), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(9000),
    });
    if (upstream.ok) {
      return response.status(200).json(await upstream.json());
    }
  } catch {
    // The browser falls back to its bundled snapshot if the upstream is down.
  }
  return response.status(502).json({ message: "Content API unavailable." });
}
