import { chromium, devices } from '@playwright/test';
import { mkdir, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
const version = process.argv[2] || 'v1';
if (!/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error('Use a simple version name such as v2.');
const output = path.join('docs/screenshots', version);
try {
  await access(path.join(output, 'capture.json'));
  throw new Error(
    'This version already has screenshots. Choose a new version to preserve history.',
  );
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
await mkdir(output, { recursive: true });
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const errors = [];
async function settle(page, canvas = false) {
  await page.evaluate(() => document.fonts.ready);
  if (canvas) await page.locator('canvas').waitFor();
  await page.waitForTimeout(650);
}
async function shot(page, name, fullPage = false) {
  await page.screenshot({
    path: path.join(output, name + '.png'),
    fullPage,
  });
  console.log(name);
}
try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const page = await desktop.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(baseURL);
  await settle(page, true);
  await shot(page, '01-home-desktop');
  await shot(page, '02-home-desktop-full', true);
  await page.getByRole('button', { name: 'Start creating', exact: true }).click();
  await shot(page, '03-new-project-desktop');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.goto(baseURL + '/editor');
  await settle(page, true);
  await page.locator('.layer-select').filter({ hasText: 'Headline' }).click();
  await settle(page);
  await shot(page, '04-editor-desktop');
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  await settle(page);
  await shot(page, '05-editor-dark-desktop');
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Editable project saved' }).waitFor();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await settle(page);
  await shot(page, '06-export-desktop');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.goto(baseURL + '/projects');
  await page.getByRole('button', { name: 'Open A little room to grow', exact: true }).waitFor();
  await settle(page);
  await shot(page, '07-projects-desktop');
  await page.goto(baseURL + '/mockups');
  await settle(page, true);
  await shot(page, '08-mockup-desktop');
  const mobile = await browser.newContext({
    ...devices['iPhone 13'],
    colorScheme: 'light',
  });
  const phone = await mobile.newPage();
  phone.on('pageerror', (e) => errors.push(e.message));
  await phone.goto(baseURL);
  await settle(phone, true);
  await shot(phone, '09-home-mobile', true);
  await phone.goto(baseURL + '/editor');
  await settle(phone, true);
  await shot(phone, '10-editor-mobile');
  await phone.locator('.mobile-panel-buttons').getByRole('button', { name: 'Layers' }).click();
  await phone.locator('.layer-select').filter({ hasText: 'Headline' }).click();
  await phone.getByRole('button', { name: 'Properties', exact: true }).click();
  await settle(phone);
  await shot(phone, '11-properties-mobile');
  await phone.goto(baseURL + '/mockups');
  await settle(phone, true);
  await shot(phone, '12-mockup-mobile', true);
  if (errors.length) throw new Error('Browser errors: ' + errors.join('; '));
  await writeFile(
    path.join(output, 'capture.json'),
    JSON.stringify(
      {
        version,
        capturedAt: new Date().toISOString(),
        browser: 'Chromium',
        desktop: { width: 1440, height: 1000 },
        mobile: 'iPhone 13 emulation (390 × 664 CSS viewport)',
        files: 12,
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}
