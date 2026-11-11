import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
test('studio uploads an image, adjusts placement, resets, and exports', async ({
  page,
  context,
  isMobile,
}) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Export mockup', exact: true })).toBeDisabled();
  for (const model of ['15', '16', '17']) {
    await page.getByRole('button', { name: `iPhone ${model}-style`, exact: true }).click();
    await expect(
      page.getByRole('button', { name: `iPhone ${model}-style`, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByLabel('Upload interface screenshot').setInputFiles('public/icon-192.png');
  await expect(page.getByAltText('Uploaded screenshot thumbnail')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export mockup', exact: true })).toBeEnabled();
  await page.locator('canvas').scrollIntoViewIfNeeded();
  const bounds = await page.locator('canvas').boundingBox();
  if (!bounds) throw new Error('Preview missing');
  const ratio = bounds.width / 800;
  if (isMobile) {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: bounds.x + 400 * ratio, y: bounds.y + 400 * ratio, id: 1 }],
    });
    for (let i = 1; i <= 5; i++)
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          { x: bounds.x + (400 + 4 * i) * ratio, y: bounds.y + (400 + 6 * i) * ratio, id: 1 },
        ],
      });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(bounds.x + 400 * ratio, bounds.y + 400 * ratio);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 420 * ratio, bounds.y + 430 * ratio, { steps: 10 });
    await page.mouse.up();
  }
  await expect
    .poll(async () =>
      Number(await page.getByRole('spinbutton', { name: 'Image X %', exact: true }).inputValue()),
    )
    .toBeGreaterThan(3);
  await expect
    .poll(async () =>
      Number(await page.getByRole('spinbutton', { name: 'Image Y %', exact: true }).inputValue()),
    )
    .toBeGreaterThan(1);
  await page.getByRole('button', { name: 'Fill screen', exact: true }).click();
  await page.getByRole('slider', { name: 'Image zoom', exact: true }).fill('1.4');
  await page.getByRole('spinbutton', { name: 'Image X %', exact: true }).fill('12');
  await page.getByRole('spinbutton', { name: 'Image Y %', exact: true }).fill('-8');
  await page.getByRole('spinbutton', { name: 'Image rotation', exact: true }).fill('15');
  await expect(page.getByRole('spinbutton', { name: 'Image rotation', exact: true })).toHaveValue(
    '15',
  );
  await page.getByText('Screen details', { exact: true }).click();
  await expect(
    page.getByRole('checkbox', { name: 'Add standard status bar', exact: true }),
  ).not.toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: 'Add plain Dynamic Island', exact: true }),
  ).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Add plain Dynamic Island', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Add standard status bar', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Replace screenshot status area', exact: true }).check();
  await expect(page.getByLabel('Status background', { exact: true })).toHaveValue('#000000');
  await page.getByLabel('Status background', { exact: true }).fill('#334455');
  await page.getByRole('textbox', { name: 'Status time', exact: true }).fill('20:38');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('spinbutton', { name: 'Image X %', exact: true })).toHaveValue('0');
  await expect(page.getByRole('spinbutton', { name: 'Image Y %', exact: true })).toHaveValue('0');
  await expect(page.getByRole('spinbutton', { name: 'Image rotation', exact: true })).toHaveValue(
    '0',
  );
  await expect(page.getByRole('slider', { name: 'Image zoom', exact: true })).toHaveValue('1');
  await expect(page.getByRole('button', { name: 'Fit whole image', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('combobox', { name: 'Frame finish', exact: true }).selectOption('silver');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export mockup', exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('forma-iphone17-design-preview.png');
  const bytes = await fs.readFile((await download.path())!);
  const size = await page.evaluate(async (base64) => {
    const i = new Image();
    i.src = 'data:image/png;base64,' + base64;
    await i.decode();
    const c = document.createElement('canvas');
    c.width = i.width;
    c.height = i.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(i, 0, 0);
    return { size: [i.width, i.height], header: Array.from(ctx.getImageData(662, 276, 1, 1).data) };
  }, bytes.toString('base64'));
  expect(size.size).toEqual([1600, 1600]);
  expect(size.header).toEqual([51, 68, 85, 255]);
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 6000 });
});
