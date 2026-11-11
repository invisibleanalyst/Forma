import { chromium, devices } from '@playwright/test';
import { mkdir, access, writeFile } from 'node:fs/promises';
const version = process.argv[2] || 'v6';
if (!/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error('Use a simple version name.');
const dir = `docs/screenshots/${version}`;
try {
  await access(`${dir}/capture.json`);
  throw new Error('Use a new version to preserve completed captures.');
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
await mkdir(dir, { recursive: true });
const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base);
  await page.locator('canvas').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${dir}/01-studio-light.png` });
  const image = await page.evaluate(() => {
    const stage = window.Konva.stages[0];
    const screen = stage.findOne('.screen-content');
    const copy = screen.clone({ x: 0, y: 0 });
    try {
      return copy.toDataURL({ x: 0, y: 0, width: 278, height: 604, pixelRatio: 3 });
    } finally {
      copy.destroy();
    }
  });
  const buffer = Buffer.from(image.split(',')[1], 'base64');
  await page
    .getByLabel('Upload interface screenshot')
    .setInputFiles({ name: 'forma-original-ui-study.png', mimeType: 'image/png', buffer });
  await page.getByRole('button', { name: 'Export mockup', exact: true }).waitFor();
  await page.getByRole('status').waitFor({ state: 'hidden' });
  await page.getByRole('combobox', { name: 'Color theme', exact: true }).selectOption('dark');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${dir}/02-studio-dark.png` });
  await page.getByRole('combobox', { name: 'Color theme', exact: true }).selectOption('black');
  await page.getByRole('button', { name: 'Background Ink', exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${dir}/03-studio-black.png` });
  await page.getByRole('button', { name: 'iPhone 15-style', exact: true }).click();
  await page.getByRole('combobox', { name: 'Frame finish', exact: true }).selectOption('silver');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${dir}/04-iphone15-silver.png` });
  const mobile = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'light' });
  const phone = await mobile.newPage();
  phone.on('pageerror', (e) => errors.push(e.message));
  await phone.goto(base);
  await phone.locator('canvas').waitFor();
  await phone.evaluate(() => document.fonts.ready);
  await phone
    .getByLabel('Upload interface screenshot')
    .setInputFiles({ name: 'forma-original-ui-study.png', mimeType: 'image/png', buffer });
  await phone.getByRole('combobox', { name: 'Color theme', exact: true }).selectOption('black');
  await phone.getByRole('status').waitFor({ state: 'hidden' });
  await phone.screenshot({ path: `${dir}/05-studio-mobile.png`, fullPage: true });
  if (errors.length) throw new Error(errors.join('; '));
  await writeFile(
    `${dir}/capture.json`,
    JSON.stringify(
      {
        version,
        capturedAt: new Date().toISOString(),
        browser: 'Chromium',
        feature: 'Studio-first iPhone-style mockups, Light/Dark/Black themes and image placement',
        sampleImage:
          'Captured from the original placeholder UI rendered by Forma, then uploaded through the real file input',
        files: 5,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`Saved five studio captures to ${dir}`);
} finally {
  await browser.close();
}
