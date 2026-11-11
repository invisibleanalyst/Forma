import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
test('opens the framed image and downloads the same original mockup bytes', async ({ page }) => {
  await page.goto('/mockups');
  await page.getByText('Reference mockup', { exact: true }).click();
  await page.getByRole('button', { name: 'View framed screenshot', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Your framed screenshot', exact: true });
  await expect(dialog.getByAltText('Full framed screenshot mockup')).toBeVisible();
  await expect(dialog).toContainText('single image');
  const image = dialog.getByAltText('Full framed screenshot mockup');
  await expect
    .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
    .toBe(true);
  const downloading = page.waitForEvent('download');
  await dialog.getByRole('link', { name: 'Download PNG', exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('forma-iphone17-style-mockup.png');
  const actual = await fs.readFile((await download.path())!);
  const expected = await fs.readFile('public/examples/iphone17-style-framed-screenshot.png');
  const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
  expect(hash(actual)).toBe(hash(expected));
  await dialog.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
