import { chromium, expect } from '@playwright/test';
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(baseURL);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.goto(baseURL + '/editor');
  await page.locator('canvas').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Add text', exact: true }).click();
  await page.getByRole('textbox', { name: 'Content', exact: true }).fill('Offline creativity');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Editable project saved');
  if (errors.length) throw new Error(errors.join('; '));
  console.log(
    'PASS: production service worker controls the page; offline reload, text editing, and IndexedDB save work.',
  );
} finally {
  await browser.close();
}
