import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import { createServer } from 'vite';

// Test the real frontend helper and real Express routes without touching MongoDB.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { projectRequest, safeUrl } = await vite.ssrLoadModule('/src/lib/api.js');
const originalFetch = globalThis.fetch;
after(async () => { globalThis.fetch = originalFetch; await vite.close(); });

test('project helper sends CRUD methods, payloads, key header and abort signal', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json([]);
  };
  try {
    assert.deepEqual(await projectRequest(), []);
    assert.match(calls[0].url, /\/api\/projects$/);
    const controller = new AbortController();
    const payload = { name: 'Review fixture', description: 'Disposable', tech: ['React'] };
    for (const method of ['POST', 'PUT', 'DELETE']) {
      await projectRequest(method === 'POST' ? '' : '/fixture-id', {
        method, headers: { 'x-admin-key': 'test-key' },
        body: JSON.stringify(payload), signal: controller.signal
      });
      assert.equal(calls.at(-1).options.method, method);
      assert.equal(calls.at(-1).options.headers['x-admin-key'], 'test-key');
      assert.equal(calls.at(-1).options.signal, controller.signal);
      assert.deepEqual(JSON.parse(calls.at(-1).options.body), payload);
    }
  } finally { globalThis.fetch = originalFetch; }
});

test('project helper distinguishes 401, server error, empty success and malformed JSON', async () => {
  try {
    for (const status of [401, 503]) {
      globalThis.fetch = async () => Response.json({ error: 'test' }, { status });
      await assert.rejects(projectRequest(), error => error.status === status);
    }
    globalThis.fetch = async () => new Response(null, { status: 204 });
    assert.equal(await projectRequest(), null);
    globalThis.fetch = async () => new Response('<html>wrong server</html>');
    await assert.rejects(projectRequest(), SyntaxError);
  } finally { globalThis.fetch = originalFetch; }
});

test('external project links reject script/data and malformed URLs', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '', undefined]) assert.equal(safeUrl(value), null);
  assert.equal(safeUrl('https://example.com'), 'https://example.com/');
});

test('existing Express routes enforce authentication and complete isolated CRUD', async () => {
  const require = createRequire(new URL('../../backend/package.json', import.meta.url));
  const modelPath = require.resolve('./models/Project');
  const records = new Map();
  class ProjectFixture {
    constructor(data) { Object.assign(this, data, { _id: 'review-fixture-id' }); }
    async save() { records.set(this._id, { ...this }); return records.get(this._id); }
    static async find() { return [...records.values()]; }
    static async findById(id) { return records.get(id); }
    static async findByIdAndUpdate(id, data) {
      if (!records.has(id)) return null;
      const updated = { ...records.get(id), ...(data.$set || data) }; records.set(id, updated); return updated;
    }
    static async findByIdAndDelete(id) { const value = records.get(id); records.delete(id); return value; }
  }
  require.cache[modelPath] = { exports: ProjectFixture };
  const previousKey = process.env.ADMIN_KEY;
  process.env.ADMIN_KEY = 'isolated-review-key';
  const express = require('express');
  const app = express(); app.use(express.json());
  app.use('/api/projects', require('./routes/projectRoutes'));
  const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api/projects`;
  const request = (suffix, method, key, body) => originalFetch(base + suffix, {
    method, headers: { 'Content-Type': 'application/json', ...(key ? { 'x-admin-key': key } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  try {
    assert.deepEqual(await (await originalFetch(base)).json(), []);
    assert.equal((await request('/session', 'GET')).status, 401);
    assert.equal((await request('/session', 'GET', 'wrong-key')).status, 401);
    const session = await request('/session', 'GET', process.env.ADMIN_KEY);
    assert.equal(session.status, 200);
    assert.deepEqual(await session.json(), { authenticated: true });
    delete process.env.ADMIN_KEY;
    assert.equal((await request('/session', 'GET')).status, 401);
    assert.equal((await request('', 'POST', undefined, { name: 'No configuration' })).status, 401);
    assert.equal(records.size, 0);
    process.env.ADMIN_KEY = 'isolated-review-key';
    for (const method of ['POST', 'PUT', 'DELETE']) {
      for (const key of [undefined, 'wrong-key']) {
        const response = await request(method === 'POST' ? '' : '/review-fixture-id', method, key, { name: 'Unauthorised' });
        assert.equal(response.status, 401); assert.equal(records.size, 0);
      }
    }
    const created = await request('', 'POST', process.env.ADMIN_KEY, { name: 'Review fixture', description: 'In memory only', tech: ['React'] });
    assert.equal(created.status, 201); const project = await created.json();
    assert.equal((await (await originalFetch(base)).json()).length, 1);
    const updated = await request('/' + project._id, 'PUT', process.env.ADMIN_KEY, { name: 'Updated fixture', tech: ['Python'] });
    assert.equal(updated.status, 200); assert.equal((await updated.json()).name, 'Updated fixture');
    assert.equal((await request('/' + project._id, 'DELETE', process.env.ADMIN_KEY)).status, 200);
    assert.deepEqual(await (await originalFetch(base)).json(), []);
    assert.equal((await request('/missing', 'PUT', process.env.ADMIN_KEY, {})).status, 404);
    const invalid = await request('', 'POST', process.env.ADMIN_KEY, { name: '', description: '', imageUrl: 'javascript:alert(1)', tech: 'React' });
    assert.equal(invalid.status, 400);
    const validation = await invalid.json();
    for (const field of ['name', 'description', 'imageUrl', 'tech']) assert.ok(validation.errors[field]);
    assert.equal(records.size, 0);
  } finally {
    await new Promise(resolve => server.close(resolve)); delete require.cache[modelPath];
    if (previousKey === undefined) delete process.env.ADMIN_KEY; else process.env.ADMIN_KEY = previousKey;
  }
});

test('project presentation preserves API content, hides unavailable links and labels concept artwork', async () => {
  const { default: ProjectCard } = await vite.ssrLoadModule('/src/components/ProjectCard.jsx');
  const fixture = { _id: 'fixture', name: 'ARNav', description: 'A documented navigation project for indoor spaces. Additional engineering detail from the API.', tech: ['Flutter', 'Firebase'], githubUrl: '', liveUrl: '', imageUrl: '' };
  const html = renderToStaticMarkup(createElement(ProjectCard, { project: fixture, index: 0, featured: true }));
  for (const value of ['ARNav', 'CONCEPT ILLUSTRATION', 'Flutter', 'Firebase', 'Additional engineering detail from the API.']) assert.ok(html.includes(value));
  assert.ok(html.includes('<details'));
  assert.ok(!html.includes('coming soon'));
  assert.ok(!html.includes('<a '));
  const preview = renderToStaticMarkup(createElement(ProjectCard, { project: { ...fixture, imageUrl: 'https://example.com/real-preview.png', githubUrl: 'https://github.com/example/project' }, index: 1 }));
  assert.ok(preview.includes('src="https://example.com/real-preview.png"'));
  assert.ok(preview.includes('href="https://github.com/example/project"'));
  assert.ok(!preview.includes('CONCEPT ILLUSTRATION'));
});


test('social buttons and command palette use the supplied LinkedIn and resume destinations', async () => {
  const { default: SocialLinks } = await vite.ssrLoadModule('/src/components/SocialLinks.jsx');
  const { default: CommandPalette } = await vite.ssrLoadModule('/src/components/CommandPalette.jsx');
  const linkedin = 'https://www.linkedin.com/in/shivam-sharma-ba2a4823a/';
  const cv = '/Shivam_Sharma_Resume.pdf';
  for (const buttons of [false, true]) {
    const html = renderToStaticMarkup(createElement(SocialLinks, { buttons }));
    assert.ok(html.includes(`href="${linkedin}"`));
    assert.ok(!html.includes('disabled'));
    if (buttons) assert.match(html, /href="\/Shivam_Sharma_Resume\.pdf" download=""/);
  }
  const html = renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(CommandPalette, { open: false, onClose() {}, onTheme() {}, onMotion() {}, motionPaused: false })));
  assert.ok(html.includes(`href="${linkedin}"`));
  assert.ok(html.includes(`href="${cv}"`));
});

test('public resume is a real PDF, not a missing asset or HTML fallback', () => {
  const pdf = readFileSync(new URL('../public/Shivam_Sharma_Resume.pdf', import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdf.length > 1000);
});

test('both themes meet AA text contrast and essential control boundary contrast', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  function luminance(hex) {
    const channels = hex.match(/[a-f\d]{2}/gi).map(channel => parseInt(channel, 16) / 255)
      .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  }
  function contrast(a, b) {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (values[0] + .05) / (values[1] + .05);
  }
  for (const [name, pattern] of [['dark', /:root\s*\{([^}]+)\}/], ['light', /:root\[data-theme=light\]\s*\{([^}]+)\}/]]) {
    const tokens = Object.fromEntries([...css.match(pattern)[1].matchAll(/--([\w-]+):\s*(#[a-f\d]{6})\s*;/gi)].map(match => [match[1], match[2]]));
    for (const background of ['bg', 'surface', 'surface-raised', 'sidebar', 'input']) {
      for (const foreground of ['text', 'muted', 'accent', 'accent-2', 'error']) {
        const ratio = contrast(tokens[foreground], tokens[background]);
        assert.ok(ratio >= 4.5, name + ': ' + foreground + ' on ' + background + ' = ' + ratio.toFixed(2));
      }
      assert.ok(contrast(tokens['control-border'], tokens[background]) >= 3, name + ': essential control border');
    }
    assert.ok(contrast(tokens['on-accent'], tokens.accent) >= 4.5, name + ': primary button text');
    assert.ok(contrast(tokens['on-danger'], tokens.danger) >= 4.5, name + ': destructive button text');
  }
});

test('authoritative order preserves middle projects and pinned endpoints through edits and insertion', () => {
  const require = createRequire(new URL('../../backend/package.json', import.meta.url));
  const { presentProjects, rankForPosition } = require('./lib/projectPresentation');
  const records = [
    { _id: 'ar', name: 'ARNav', order: 4000 },
    { _id: 'h', name: 'The HangMan Game', order: 1000 },
    { _id: 'k', name: 'KrushiPal', order: 2000 },
    { _id: 'c', name: 'CultivateConnect', order: 3000 },
    { _id: 'p', name: 'Proactive Insurance Policy Guardian', order: 0 }
  ];
  const snapshot = JSON.stringify(records);
  const order = rows => presentProjects(rows).map(p => p._id);
  assert.deepEqual(order(records), ['p', 'h', 'k', 'c', 'ar']);
  const moved = records.map(p => p._id === 'c' ? { ...p, order: rankForPosition(records, p, 2) } : p);
  assert.deepEqual(order(moved), ['p', 'c', 'h', 'k', 'ar']);
  assert.deepEqual(order([...records, { _id: 'new', name: 'New work', order: rankForPosition(records, { name: 'New work' }) }]), ['p', 'h', 'k', 'c', 'new', 'ar']);
  for (const target of [0, 1, 999]) {
    const rank = rankForPosition(records, records[2], target);
    const result = presentProjects(records.map(p => p._id === 'k' ? { ...p, order: rank } : p));
    assert.equal(result[0]._id, 'p'); assert.equal(result.at(-1)._id, 'ar');
  }
  assert.equal(JSON.stringify(records), snapshot);
});

test('library search and display sorting leave the saved portfolio order untouched', async () => {
  const { findProjects, projectMetrics } = await vite.ssrLoadModule('/src/lib/projects.js');
  const projects = [
    { name: 'Zeta', summary: 'Policy assistant', description: 'Semantic retrieval', tech: ['FAISS'], imageUrl: '', liveUrl: '' },
    { name: 'Alpha', description: 'Fresh produce', tech: ['React'], imageUrl: 'https://example.com/preview.png', liveUrl: 'https://example.com' }
  ];
  assert.equal(findProjects(projects, '  faiss ')[0].name, 'Zeta');
  assert.equal(findProjects(projects, 'policy')[0].name, 'Zeta');
  assert.equal(findProjects(projects, 'fresh')[0].name, 'Alpha');
  assert.equal(findProjects(projects, 'absent').length, 0);
  assert.deepEqual(findProjects(projects, '', 'name').map(p => p.name), ['Alpha', 'Zeta']);
  assert.deepEqual(projects.map(p => p.name), ['Zeta', 'Alpha']);
  assert.deepEqual(projectMetrics(projects), { total: 2, missingImages: 1, missingDemos: 1 });
});

test('server validation rejects malformed URLs and restricts writes to supported project fields', () => {
  const require = createRequire(new URL('../../backend/package.json', import.meta.url));
  const { validateProject } = require('./lib/projectValidation');
  const invalid = validateProject({ name: '', description: '', summary: 'x'.repeat(241), tech: [''], imageUrl: 'data:image/png,test', position: 1.5 }, true);
  for (const key of ['name', 'description', 'summary', 'tech', 'imageUrl', 'position']) assert.ok(invalid.errors[key]);
  const valid = validateProject({ name: ' Example ', description: ' Built a useful thing ', tech: ['React', 'react', ' Flask '], githubUrl: 'https://github.com/user/project', order: -99999, featured: true, $set: { name: 'Injected' } }, true);
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.data.name, 'Example');
  assert.deepEqual(valid.data.tech, ['react', 'Flask']);
  assert.equal(valid.data.order, undefined);
  assert.equal(valid.data.featured, undefined);
  assert.equal(valid.data.$set, undefined);
});

test('Leadership is available to desktop/mobile navigation and the command palette', async () => {
  const { sections } = await vite.ssrLoadModule('/src/data/content.js');
  assert.deepEqual(sections.map(p => p[1]), ['About', 'Projects', 'Skills', 'Education', 'Leadership', 'Contact']);
  const { default: Navbar } = await vite.ssrLoadModule('/src/components/Navbar.jsx');
  const { default: CommandPalette } = await vite.ssrLoadModule('/src/components/CommandPalette.jsx');
  const nav = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Navbar, { theme: 'dark', onCommand() {}, onTheme() {}, onMenu() {} })));
  assert.equal((nav.match(/href="\/#mentoring"/g) || []).length, 2);
  const palette = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(CommandPalette, { open: false, onClose() {}, onTheme() {}, onMotion() {}, motionPaused: false })));
  assert.ok(palette.includes('Go to Leadership'));
});

test('dedicated editor renders supported fields, pinned placement and concept preview without fake upload controls', async () => {
  const { default: ProjectEditor } = await vite.ssrLoadModule('/src/components/admin/ProjectEditor.jsx');
  const project = { _id: 'insurance', name: 'Proactive Insurance', summary: '', description: 'A real project description.', tech: ['Python', 'FAISS'], position: 1, orderLocked: 'first', githubUrl: 'https://github.com/example/project' };
  const router = createMemoryRouter([{ path: '/admin/projects/:id/edit', element: createElement(ProjectEditor, { projects: [project], api() {}, onSaved() {}, onUnauthorized() {} }) }], { initialEntries: ['/admin/projects/insurance/edit'] });
  try {
    const html = renderToStaticMarkup(createElement(RouterProvider, { router }));
    for (const field of ['Project name', 'Short summary', 'Full description', 'Technologies', 'Image URL', 'GitHub repository', 'Live demo', 'Display position']) assert.ok(html.includes(field));
    assert.ok(html.includes('role="combobox"'));
    assert.ok(html.includes('CONCEPT ILLUSTRATION'));
    assert.ok(html.includes('id="editor-position"'));
    assert.ok(html.includes('disabled=""'));
    assert.ok(!html.includes('type="file"'));
    assert.ok(!html.includes('Featured toggle'));
  } finally { router.dispose(); }
});

test('editor positions reserve the real pinned first and last projects', async () => {
  const { positionBounds, validateDraft } = await vite.ssrLoadModule('/src/lib/projects.js');
  const records = [{ _id: 'p', orderLocked: 'first' }, { _id: 'middle' }, { _id: 'ar', orderLocked: 'last' }];
  assert.deepEqual(positionBounds(records), { min: 2, max: 3 });
  assert.deepEqual(positionBounds(records, records[1]), { min: 2, max: 2 });
  assert.deepEqual(positionBounds([], undefined), { min: 1, max: 1 });
  const form = { name: 'Example', summary: '', description: 'Useful software', tech: [], githubUrl: '', liveUrl: '', imageUrl: '', position: 1 };
  assert.ok(validateDraft(form, positionBounds(records)).position);
  assert.deepEqual(validateDraft({ ...form, position: 2 }, positionBounds(records)), {});
});
