import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs/promises';
async function openEditor(page: Page) {
  await page.goto('/editor');
  await expect(page.getByRole('textbox', { name: 'Project name', exact: true })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
}
async function showLayers(page: Page) {
  await expect(page.getByRole('textbox', { name: 'Project name', exact: true })).toBeVisible();
  if (await page.locator('.mobile-panel-buttons').isVisible())
    await page.locator('.mobile-panel-buttons').getByRole('button', { name: 'Layers' }).click();
}
async function closeSheet(page: Page) {
  if (await page.getByRole('button', { name: 'Close properties' }).isVisible())
    await page.getByRole('button', { name: 'Close properties' }).click();
}
test('studio homepage remembers dark and black theme preferences', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your screen. A better frame.');
  await page.getByRole('combobox', { name: 'Color theme', exact: true }).selectOption('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: 'Color theme', exact: true }).selectOption('black');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'black');
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    'rgb(0, 0, 0)',
  );
  await expect(page.getByRole('button', { name: 'iPhone 17-style', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: /android/i })).toHaveCount(0);
});
test('creates a custom project, edits text, undoes and redoes, and reopens a local save', async ({
  page,
}) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'New project', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Project name').fill('My first canvas');
  await dialog.getByLabel('Width (px)').fill('800');
  await dialog.getByLabel('Height (px)').fill('600');
  await dialog.getByRole('button', { name: 'Create project' }).click();
  await page.getByRole('button', { name: 'Add text', exact: true }).click();
  await page.getByRole('textbox', { name: 'Content', exact: true }).fill('Make something yours');
  await closeSheet(page);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Editable project saved');
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Open My first canvas', exact: true }).click();
  await showLayers(page);
  await page.locator('.layer-select').first().click();
  if (await page.getByRole('button', { name: 'Properties', exact: true }).isVisible())
    await page.getByRole('button', { name: 'Properties', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Content', exact: true })).toHaveValue(
    'Make something yours',
  );
});
test('adds shapes, changes dimensions, duplicates, hides and locks layers', async ({ page }) => {
  await openEditor(page);
  await page.getByRole('button', { name: 'Add shape', exact: true }).click();
  await page.getByRole('button', { name: 'Ellipse', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Width', exact: true }).fill('350');
  await page.getByRole('spinbutton', { name: 'Height', exact: true }).fill('200');
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
  await closeSheet(page);
  await showLayers(page);
  await page.getByRole('button', { name: 'Hide Ellipse copy', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Show Ellipse copy', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Lock Ellipse copy', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Unlock Ellipse copy', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Move layer down', exact: true }).click();
  await page.getByRole('button', { name: 'Delete layer', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hide Ellipse copy', exact: true })).toHaveCount(0);
});
test('exports the exact document dimensions as PNG, JPEG and WebP', async ({ page }) => {
  await openEditor(page);
  await showLayers(page);
  await page.locator('.layer-select').filter({ hasText: 'Headline' }).click();
  await closeSheet(page);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await expect(page.getByAltText('Your exported design preview')).toBeVisible();
  for (const [format, ext, mime] of [
    ['png', 'png', 'image/png'],
    ['jpeg', 'jpg', 'image/jpeg'],
    ['webp', 'webp', 'image/webp'],
  ]) {
    await page.getByRole('combobox', { name: 'Format', exact: true }).selectOption(format);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download image', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('A little room to grow.' + ext);
    const path = await download.path();
    expect(path).toBeTruthy();
    const bytes = await fs.readFile(path!);
    expect(bytes.length).toBeGreaterThan(3000);
    const dimensions = await page.evaluate(
      async ({ base64, mime }) => {
        const i = new Image();
        i.src = 'data:' + mime + ';base64,' + base64;
        await i.decode();
        const canvas = document.createElement('canvas');
        canvas.width = i.width;
        canvas.height = i.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(i, 0, 0);
        const pixels = ctx.getImageData(60, 247, 400, 400).data;
        let ink = 0;
        for (let j = 0; j < pixels.length; j += 4) {
          if (pixels[j] < 100 && pixels[j + 1] < 140 && pixels[j + 2] < 110 && pixels[j + 3] > 200)
            ink++;
        }
        return {
          ink,
          size: [i.width, i.height],
          background: Array.from(ctx.getImageData(5, 5, 1, 1).data),
          art: Array.from(ctx.getImageData(800, 500, 1, 1).data),
        };
      },
      { base64: bytes.toString('base64'), mime },
    );
    expect(dimensions.size).toEqual([1080, 1080]);
    if (format === 'png') {
      expect(dimensions.background).toEqual([244, 242, 235, 255]);
      expect(dimensions.art).not.toEqual(dimensions.background);
      expect(dimensions.ink).toBeGreaterThan(1000);
    }
  }
});
test('imports images, adjusts, flips and crops, and rejects unsupported files', async ({
  page,
}) => {
  await openEditor(page);
  const bytes = await fs.readFile('public/icon-192.png');
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: bytes });
  await expect(page.getByText('IMAGE ADJUSTMENTS', { exact: true })).toBeVisible();
  await page.getByLabel('Brightness', { exact: true }).fill('0.3');
  await page.getByRole('button', { name: 'Flip H', exact: true }).click();
  await closeSheet(page);
  await page.getByRole('button', { name: 'Crop image', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Left %', exact: true }).fill('10');
  await page.getByRole('button', { name: 'Apply crop', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await closeSheet(page);
  await page.getByRole('button', { name: 'Crop image', exact: true }).click();
  await page.getByRole('button', { name: 'Reset crop', exact: true }).click();
  if (await page.locator('.mobile-panel-buttons').isVisible())
    await page
      .locator('.mobile-panel-buttons')
      .getByRole('button', { name: 'Adjust', exact: true })
      .click();
  await expect(page.getByRole('spinbutton', { name: 'Width', exact: true })).toHaveValue('153.6');
  await page.locator('input[type=file]').setInputFiles({
    name: 'invalid.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.getByRole('status')).toContainText('Choose a PNG, JPEG, or WebP');
});
test('project workspace renames, duplicates and deletes projects', async ({ page }) => {
  await openEditor(page);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Editable project saved');
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Rename', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Project name').fill('Renamed project');
  await page.getByRole('button', { name: 'Save name', exact: true }).click();
  await page.getByRole('button', { name: 'Duplicate Renamed project', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Open Renamed project copy', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Delete Renamed project copy', exact: true }).click();
  await page.getByRole('button', { name: 'Delete project', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Open Renamed project copy', exact: true }),
  ).toHaveCount(0);
});
test('mockup studio renders iPhone presets, landscape and custom screenshot, and exports', async ({
  page,
}) => {
  await page.goto('/mockups');
  await expect(page.locator('canvas')).toHaveCount(1);
  const previewBounds = await page.locator('.mockup-canvas-container').boundingBox();
  const sceneBounds = await page.locator('canvas').boundingBox();
  expect(Math.abs(sceneBounds!.width - previewBounds!.width)).toBeLessThan(2);
  expect(Math.abs(sceneBounds!.height - previewBounds!.height)).toBeLessThan(2);
  await page.getByRole('button', { name: 'iPhone 16-style', exact: true }).click();
  await page.getByRole('button', { name: 'iPhone 17-style', exact: true }).click();
  await page.getByRole('button', { name: /Portrait · Rotate/ }).click();
  await page.getByText('Screen details', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Status time', exact: true }).fill('12:34');
  await page.getByLabel('Upload interface screenshot').setInputFiles('public/icon-192.png');
  await page.waitForTimeout(300);
  const promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export mockup', exact: true }).click();
  const download = await promise;
  expect(download.suggestedFilename()).toBe('forma-iphone17-design-preview.png');
  const path = await download.path();
  expect((await fs.stat(path!)).size).toBeGreaterThan(4000);
});
test('homepage, projects, mockups, and editor have no horizontal overflow', async ({
  page,
}, testInfo) => {
  const widths = testInfo.project.name === 'mobile-chromium' ? [320, 390, 430] : [768, 1024, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/projects', '/mockups', '/editor']) {
      await page.goto(route);
      await page.waitForTimeout(150);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  }
});

test('canvas drag, resize, zoom and keyboard undo preserve document coordinates', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'Pointer-specific desktop test');
  await openEditor(page);
  await page.getByRole('button', { name: 'Add shape', exact: true }).click();
  await page.getByRole('button', { name: 'Rectangle', exact: true }).click();
  const bounds = await page.locator('canvas').boundingBox();
  if (!bounds) throw new Error('Canvas is not visible');
  const fit = Math.min((bounds.width - 64) / 1080, (bounds.height - 64) / 1080);
  const left = bounds.x + (bounds.width - 1080 * fit) / 2,
    top = bounds.y + (bounds.height - 1080 * fit) / 2;
  await page.mouse.move(left + 350 * fit, top + 350 * fit);
  await page.mouse.down();
  await page.mouse.move(left + 400 * fit, top + 390 * fit, { steps: 10 });
  await page.mouse.up();
  const x = Number(await page.getByRole('spinbutton', { name: 'X', exact: true }).inputValue());
  const y = Number(await page.getByRole('spinbutton', { name: 'Y', exact: true }).inputValue());
  expect(Math.abs(x - 266)).toBeLessThanOrEqual(2);
  expect(Math.abs(y - 256)).toBeLessThanOrEqual(2);
  await page.mouse.move(left + (x + 324) * fit, top + (y + 324) * fit);
  await page.mouse.down();
  await page.mouse.move(left + (x + 400) * fit, top + (y + 400) * fit, { steps: 10 });
  await page.mouse.up();
  expect(
    Number(await page.getByRole('spinbutton', { name: 'Width', exact: true }).inputValue()),
  ).toBeGreaterThan(380);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.getByRole('button', { name: '110%', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Fit canvas', exact: true }).click();
  await expect(page.getByRole('button', { name: '100%', exact: true })).toBeVisible();
  await page.keyboard.press('Control+z');
  await page.locator('.layer-select').filter({ hasText: 'Rectangle' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Width', exact: true })).toHaveValue('324');
});

test('pinch gesture zooms the canvas on a touch screen', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Touch-specific Chromium test');
  await openEditor(page);
  const bounds = await page.locator('canvas').boundingBox();
  if (!bounds) throw new Error('Canvas missing');
  const cdp = await context.newCDPSession(page);
  const cx = bounds.x + bounds.width / 2,
    cy = bounds.y + bounds.height / 2;
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { x: cx - 35, y: cy, id: 1 },
      { x: cx + 35, y: cy, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { x: cx - 60, y: cy, id: 1 },
      { x: cx + 60, y: cy, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('.zoom-label')).not.toHaveText('100%');
  await page.getByRole('button', { name: 'Fit canvas', exact: true }).click();
  await expect(page.locator('.zoom-label')).toHaveText('100%');
});
