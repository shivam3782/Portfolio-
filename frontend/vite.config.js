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
  return {
    plugins: [react(), tailwindcss()],
    server: { host: 'localhost', port: 5173, strictPort: true, proxy },
    preview: { host: 'localhost', port: 5173, strictPort: true, proxy },
  };
});
