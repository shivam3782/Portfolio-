import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from 'node:url';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolveApiOrigin } from './config/api-config.js';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), ['VITE_', 'API_']);
  // A production build fails before emitting assets if an override points at development.
  resolveApiOrigin(env.VITE_API_URL, command === 'build');
  const proxy = { '/api': { target: env.API_PROXY_TARGET || 'http://127.0.0.1:3000', changeOrigin: true } };
  const publicReview = mode === 'public-review';
  return {
    plugins: [react(), tailwindcss(), publicReview && {
      name: 'public-project-review',
      configurePreviewServer(server) {
        server.middlewares.use('/api', async (request, response) => {
          response.setHeader('Content-Type', 'application/json');
          if (request.method !== 'GET' || request.url !== '/projects') {
            response.statusCode = 403;
            return response.end(JSON.stringify({ error: 'This preview only reads the public project list.' }));
          }
          try {
            const result = await fetch('https://www.shivam-sharma.me/api/projects', { signal: AbortSignal.timeout(60000) });
            response.statusCode = result.status;
            response.end(JSON.stringify(await result.json()));
          } catch {
            response.statusCode = 502;
            response.end(JSON.stringify({ error: 'The public project service is unavailable.' }));
          }
        });
      },
    }],
    server: { host: 'localhost', port: 5173, strictPort: true, proxy },
    preview: { host: 'localhost', port: 5173, strictPort: true, proxy: publicReview ? {} : proxy },
  };
});
