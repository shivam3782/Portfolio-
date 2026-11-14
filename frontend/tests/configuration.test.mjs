// Configuration-only coverage; existing application regression tests are unchanged.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { resolveApiOrigin } from '../config/api-config.js';

const require = createRequire(new URL('../../backend/package.json', import.meta.url));
const { serverConfig } = require('./lib/serverConfig');

test('API configuration supports same-origin and separate HTTPS backends', () => {
  assert.equal(resolveApiOrigin('', true), '');
  assert.equal(resolveApiOrigin('/', true), '');
  assert.equal(resolveApiOrigin('https://api.example.com/', true), 'https://api.example.com');
  assert.equal(resolveApiOrigin('http://localhost:3000', false), 'http://localhost:3000');
});

test('production API configuration rejects loopback, insecure, credential and path overrides', () => {
  for (const value of ['http://localhost:3000', 'https://localhost:3000', 'https://api.localhost', 'https://127.1', 'https://[::1]', 'http://api.example.com', 'https://user:secret@api.example.com', 'https://api.example.com/api', '//api.example.com', 'https://api.example.com?token=bad']) assert.throws(() => resolveApiOrigin(value, true));
});

test('Vite production env and API-first rewrite are safe despite generic local env files', () => {
  const env = loadEnv('production', fileURLToPath(new URL('../', import.meta.url)), 'VITE_');
  assert.doesNotThrow(() => resolveApiOrigin(env.VITE_API_URL, true));
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.rewrites[0].source, '/api/:path*');
  assert.ok(config.rewrites[0].destination.endsWith('/api/:path*'));
  assert.doesNotThrow(() => resolveApiOrigin(new URL(config.rewrites[0].destination).origin, true));
  assert.equal(config.rewrites[1].destination, '/index.html');
});

test('backend honors hosting ports and exact CORS origins without a production wildcard', () => {
  const production = serverConfig({ NODE_ENV: 'production', PORT: '10000' });
  assert.equal(production.port, 10000);
  assert.deepEqual(production.dnsServers, []);
  const allowed = (options, origin) => { let result; options.origin(origin, (_error, value) => { result = value; }); return result; };
  assert.equal(allowed(production.cors, 'https://shivam-sharma.me'), true);
  assert.equal(allowed(production.cors, 'http://localhost:5173'), false);
  assert.equal(allowed(production.cors, 'https://untrusted.example'), false);
  assert.equal(allowed(production.cors, undefined), true);
  assert.ok(production.cors.allowedHeaders.includes('x-admin-key'));
  const custom = serverConfig({ CORS_ORIGINS: 'https://preview.example.com' });
  assert.equal(allowed(custom.cors, 'https://preview.example.com'), true);
  assert.equal(allowed(custom.cors, 'https://preview.example.com.evil.test'), false);
  assert.throws(() => serverConfig({ PORT: 'not-a-port' }));
  assert.throws(() => serverConfig({ CORS_ORIGINS: '*' }));
  assert.throws(() => serverConfig({ CORS_ORIGINS: 'https://example.com/path' }));
});
