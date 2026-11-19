// Run against a local production preview. Every API response is an in-memory fixture.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4187');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Use a loopback preview');
const fixtureKey = 'browser-test-only';
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || 'chrome' });

async function exercise(width) {
  const context = await browser.newContext({
    viewport: { width, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block',
  });
  let records = ['Insurance fixture', 'Middle fixture', 'ARNav'].map((name, index) => ({
    _id: String(index), name, description: 'Browser fixture', tech: ['Python'],
    orderLocked: ['first', null, 'last'][index], liveUrl: index ? '' : 'https://example.org',
  }));
  let rejectNextEdit = false;
  const writes = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    if (url.origin !== base.origin) return route.abort();
    if (!url.pathname.startsWith('/api/')) return method === 'GET' ? route.continue() : route.abort();
    const send = (json, status = 200) => route.fulfill({ json, status });
    if (url.pathname === '/api/projects' && method === 'GET') {
      return send(records.map((record, index) => ({ ...record, position: index + 1 })));
    }
    if (request.headers()['x-admin-key'] !== fixtureKey) return send({ error: 'Unauthorized' }, 401);
    if (url.pathname === '/api/projects/session' && method === 'GET') return send({ authenticated: true });
    if (method === 'PUT' && rejectNextEdit) {
      rejectNextEdit = false;
      return send({ error: 'Expired fixture' }, 401);
    }
    const id = url.pathname.split('/').at(-1);
    if (method === 'POST' || method === 'PUT') {
      const record = { ...request.postDataJSON(), _id: method === 'POST' ? 'created-fixture' : id };
      records = records.filter(item => item._id !== record._id);
      records.splice(record.position - 1, 0, record);
      writes.push(method);
      return send(record, method === 'POST' ? 201 : 200);
    }
    if (method === 'DELETE') {
      records = records.filter(item => item._id !== id);
      writes.push(method);
      return send({ message: 'Deleted' });
    }
    return send({ error: 'Unknown fixture route' }, 404);
  });

  try {
    const page = await context.newPage();
    const exceptions = [];
    page.on('pageerror', error => exceptions.push(error.message));
    const button = name => page.getByRole('button', { name, exact: true });
    await page.goto(new URL('/admin', base).href);
    await page.getByLabel('Admin key', { exact: true }).fill('wrong-fixture');
    await button('Open workspace').click();
    await page.getByRole('alert').waitFor();
    await page.getByLabel('Admin key', { exact: true }).fill(fixtureKey);
    await button('Open workspace').click();
    await page.getByRole('button', { name: /Missing demo links/ }).click();
    assert.equal(await page.locator('tbody tr').count(), 2);
    await page.getByRole('button', { name: /Total projects/ }).click();
    assert.equal(await page.locator('tbody tr').count(), 3);
    await page.getByRole('link', { name: 'New project' }).first().click();
    await button('Create project').click();
    assert.equal(await page.locator(':focus').getAttribute('id'), 'editor-name');
    await page.getByLabel('Project name').fill('Browser-only project');
    await page.getByLabel('Full description').fill('Local isolated case study');
    await page.locator('#editor-position').fill('2');
    await button('Create project').click();
    const row = page.getByRole('row').filter({ hasText: 'Browser-only project' });
    await row.waitFor();
    assert.equal(records[1]._id, 'created-fixture');
    await row.locator('.row-edit').click();
    await page.getByLabel('Short summary').fill('Draft retained across verification');
    await page.locator('#editor-position').fill('3');
    rejectNextEdit = true;
    await button('Save changes').click();
    const verify = page.getByRole('dialog', { name: 'Verify admin access' });
    await verify.getByLabel('Admin key').fill(fixtureKey);
    await verify.getByRole('button', { name: 'Open workspace' }).click();
    assert.equal(await page.getByLabel('Short summary').inputValue(), 'Draft retained across verification');
    await button('Save changes').click();
    await row.waitFor();
    assert.equal(records[2]._id, 'created-fixture');
    assert.deepEqual(records.map(item => item._id), ['0','1','created-fixture','2']);
    await row.locator('.row-delete').click();
    await page.keyboard.press('Escape');
    assert.deepEqual(writes, ['POST', 'PUT']);
    await row.locator('.row-delete').click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete project' }).click();
    await row.waitFor({ state: 'detached' });
    assert.deepEqual(writes, ['POST', 'PUT', 'DELETE']);
    await page.getByRole('link', { name: 'Lock console' }).click();
    await page.locator('#admin-key').waitFor();
    assert.equal(await page.locator('#admin-key').inputValue(), '');
    assert.ok(!await page.evaluate(key => JSON.stringify([localStorage, sessionStorage]).includes(key), fixtureKey));
    assert.deepEqual(exceptions, []);
    console.log('PASS isolated admin flows at ' + width + 'px');
  } finally {
    await context.close();
  }
}

try {
  await exercise(1440);
  await exercise(390);
} finally {
  await browser.close();
}
