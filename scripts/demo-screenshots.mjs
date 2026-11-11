import { chromium, devices } from '@playwright/test';
import { mkdir, access, writeFile } from 'node:fs/promises';
const version = process.argv[2] || 'v4';
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
  await page.goto(base + '/editor?template=transaction-demo');
  await page.locator('canvas').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page
    .getByRole('textbox', { name: 'Heading', exact: true })
    .fill('Demo withdrawal · 250 USDT');
  await page
    .getByRole('textbox', { name: 'Address (fictional)', exact: true })
    .fill('DEMO CLASSROOM WALLET');
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${dir}/01-educational-fields-desktop.png` });
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByAltText('Your exported design preview').waitFor();
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${dir}/02-educational-export-desktop.png` });
  const mobile = await browser.newContext({
    ...devices['iPhone 13'],
    defaultBrowserType: undefined,
    colorScheme: 'light',
  });
  const phone = await mobile.newPage();
  await phone.goto(base + '/editor?template=transaction-demo');
  await phone.locator('canvas').waitFor();
  await phone.evaluate(() => document.fonts.ready);
  await phone.waitForTimeout(250);
  await phone.screenshot({ path: `${dir}/03-educational-canvas-mobile.png` });
  await phone.getByRole('button', { name: 'Edit template fields', exact: true }).click();
  await phone
    .getByRole('textbox', { name: 'Heading', exact: true })
    .fill('Demo withdrawal · 250 USDT');
  await phone.waitForTimeout(150);
  await phone.screenshot({ path: `${dir}/04-educational-fields-mobile.png` });
  await writeFile(
    `${dir}/capture.json`,
    JSON.stringify(
      {
        version,
        capturedAt: new Date().toISOString(),
        feature:
          'Educational transaction layout with fictional data and permanent demonstration markings',
        browser: 'Chromium',
        files: 4,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`Saved four educational template captures to ${dir}`);
} finally {
  await browser.close();
}
