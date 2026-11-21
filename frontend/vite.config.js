import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { resolveApiOrigin } from "./config/api-config.js";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), [
    "VITE_",
    "API_",
  ]);
  // A production build fails before emitting assets if an override points at development.
  resolveApiOrigin(env.VITE_API_URL, command === "build");
  const proxy = {
    "/api": {
      target: env.API_PROXY_TARGET || "http://127.0.0.1:3000",
      changeOrigin: true,
    },
  };
  return {
    plugins: [
      react(),
      {
        name: "static-route-preview",
        configurePreviewServer(server) {
          server.middlewares.use((req, res, next) => {
            const path = new URL(req.url, "http://preview.local").pathname;
            if (
              path.startsWith("/projects/") &&
              existsSync(resolve("dist", "." + path, "index.html"))
            )
              req.url = path + "/index.html";
            if (path === "/admin" || path.startsWith("/admin/"))
              req.url = "/app.html";
            else if (
              path !== "/" &&
              !path.startsWith("/api/") &&
              !existsSync(resolve("dist", "." + path))
            ) {
              res.statusCode = 404;
              res.setHeader("Content-Type", "text/html");
              res.end(readFileSync("dist/404.html"));
              return;
            }
            next();
          });
        },
      },
    ],
    server: { host: "localhost", port: 5173, strictPort: true, proxy },
    preview: { host: "localhost", port: 5173, strictPort: true, proxy },
  };
});
