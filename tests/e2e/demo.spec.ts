import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
test('educational fields edit, save, reopen and export with persistent demo marks', async ({
  page,
}) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: /Open educational template/ }).click();
  await expect(page.getByRole('textbox', { name: 'Project name', exact: true })).toHaveValue(
    'Transaction layout · educational demo',
  );
  await page.locator('canvas').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Edit template fields', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Heading', exact: true })
    .fill('Demo withdrawal · 250 USDT');
  await page
    .getByRole('textbox', { name: 'Address (fictional)', exact: true })
    .fill('DEMO CLASSROOM WALLET');
  await page
    .getByRole('textbox', { name: 'Submitted time (sample)', exact: true })
    .fill('Sample lesson · 2030-01-02');
  const close = page.getByRole('button', { name: 'Close properties', exact: true });
  if (await close.isVisible()) await close.click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Editable project saved');
  await page.goto('/projects');
  await page
    .getByRole('button', { name: 'Open Transaction layout · educational demo', exact: true })
    .click();
  await expect(page.getByRole('textbox', { name: 'Project name', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit template fields', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Heading', exact: true })).toHaveValue(
    'Demo withdrawal · 250 USDT',
  );
  await expect(page.getByRole('textbox', { name: 'Address (fictional)', exact: true })).toHaveValue(
    'DEMO CLASSROOM WALLET',
  );
  if (await close.isVisible()) await close.click();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  for (const format of ['png', 'jpeg', 'webp']) {
    await page.getByRole('combobox', { name: 'Format', exact: true }).selectOption(format);
    const downloading = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download image', exact: true }).click();
    const file = await downloading;
    const bytes = await fs.readFile((await file.path())!);
    const output = await page.evaluate(
      async ({ data, format }) => {
        const img = new Image();
        img.src = `data:image/${format};base64,${data}`;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        return {
          size: [img.width, img.height],
          top: Array.from(ctx.getImageData(5, 5, 1, 1).data),
          middle: Array.from(ctx.getImageData(5, 950, 1, 1).data),
          bottom: Array.from(ctx.getImageData(5, 1790, 1, 1).data),
        };
      },
      { data: bytes.toString('base64'), format },
    );
    expect(output.size).toEqual([900, 1800]);
    for (const pixel of [output.top, output.middle, output.bottom]) {
      expect(pixel[0]).toBeGreaterThan(230);
      expect(pixel[1]).toBeGreaterThan(180);
      expect(pixel[2]).toBeLessThan(120);
      expect(pixel[3]).toBe(255);
    }
  }
});
