import { chromium, devices } from '@playwright/test';
import { mkdir, access, writeFile } from 'node:fs/promises';
const version = process.argv[2] || 'v5';
if (!/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error('Use a simple version name.');
const dir = `docs/screenshots/${version}`;
try {
  await access(`${dir}/capture.json`);
  throw new Error('Choose a new version to preserve existing captures.');
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
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
  });
  await page.goto(base + '/mockups');
  await page.getByText('Reference mockup', { exact: true }).click();
  await page.getByRole('button', { name: 'View framed screenshot', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.framed-example-card img').evaluate((i) => i.decode());
  await page.screenshot({ path: `${dir}/01-framed-example-studio.png` });
  await page.getByRole('button', { name: 'View framed screenshot', exact: true }).click();
  await page.getByAltText('Full framed screenshot mockup').evaluate((i) => i.decode());
  await page.screenshot({ path: `${dir}/02-framed-example-desktop.png` });
  const context = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'light' });
  const phone = await context.newPage();
  await phone.goto(base + '/mockups');
  await phone.getByText('Reference mockup', { exact: true }).click();
  await phone.getByRole('button', { name: 'View framed screenshot', exact: true }).click();
  await phone.evaluate(() => document.fonts.ready);
  await phone.getByAltText('Full framed screenshot mockup').evaluate((i) => i.decode());
  await phone.screenshot({ path: `${dir}/03-framed-example-mobile.png` });
  await writeFile(
    `${dir}/capture.json`,
    JSON.stringify(
      {
        version,
        capturedAt: new Date().toISOString(),
        feature: 'Fixed generated phone-frame image viewer and original PNG download',
        browser: 'Chromium',
        files: 3,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`Saved three framed-example captures to ${dir}`);
} finally {
  await browser.close();
}
