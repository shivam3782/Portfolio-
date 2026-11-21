import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

// Exercise the built client with an independent API response and no external requests.
const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4187');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname));
const records = ['Document search', 'Wayfinding'].map((name, index) => ({
  _id: String(index), name, description: 'A browser fixture with enough detail for the overview. Additional engineering notes.',
  tech: ['Python'],
}));
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || 'chrome' });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  let releaseProjects;
  const delayed = new Promise(resolve => { releaseProjects = resolve; });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== base.origin || route.request().method() !== 'GET') return route.abort();
    if (url.pathname !== '/api/projects') return route.continue();
    await delayed;
    await route.fulfill({ json: records });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('/#project-1', base).href, { waitUntil: 'domcontentloaded' });
  await page.getByText('Loading projects…').waitFor();
  releaseProjects();
  await page.waitForFunction(() => document.activeElement.id === 'project-1');
  const article = page.locator('#project-1');
  assert.ok(Math.abs((await article.boundingBox()).y - 100) < 5);
  assert.equal(await article.getByRole('heading').getByRole('link').getAttribute('href'), '/#project-1');
  await article.locator('summary').click();
  await article.getByText('Additional engineering notes.').waitFor();
  await page.getByRole('button', { name: 'Index', exact: true }).click();
  assert.equal(await article.getByRole('heading').getByRole('link').getAttribute('href'), '/#project-1');
  await page.locator('.menu-toggle').click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Certifications' }).click();
  await page.waitForFunction(() => document.activeElement.id === 'proof');
  await page.locator('.menu-toggle').click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForFunction(() => !document.querySelector('#mobile-menu').open);
  assert.equal(await page.locator(':focus').getAttribute('class'), 'wordmark');
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  assert.equal(await page.locator('.studio-colophon button').count(), 0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Pause motion' }).click();
  assert.equal(await page.locator('html').getAttribute('data-motion'), 'paused');
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await page.locator('.studio-colophon a').click();
  await page.waitForFunction(() => document.activeElement.id === 'home');
  await page.getByRole('button', { name: 'Explore scene' }).click();
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY), 'hidden');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('link', { name: /My work as a mentor/ }).click();
  await page.waitForFunction(() => document.activeElement.id === 'mentoring');
  assert.deepEqual(errors, []);
  console.log('PASS delayed project permalink, gallery/index details, certification navigation, responsive dialog focus, workbench scroll lock, motion preferences and mentoring link.');
} finally {
  await browser.close();
}
