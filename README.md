# Forma

A private, browser-based creative workspace for editing images, designing with text and shapes, and presenting interface mockups. Built from the [product specification](docs/product-specification.md) as a working first release.

**[Browse the screenshot version gallery →](docs/screenshots/README.md)**

![Forma homepage](docs/screenshots/v3/01-home-desktop.png)

## Run locally

Use Node.js 24 LTS (Node 22+ supported) and npm.

```sh
npm ci
npm run dev
```

Open the development server at port 3000. No API keys, accounts, database server, or environment variables are needed. The font, sample illustration, and app icons are bundled locally.

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
npm start
# In another terminal, validate cached editing offline:
npm run test:offline
```

Playwright uses `/usr/bin/chromium` in this cloud environment. On another machine, install Chromium through Playwright (`npx playwright install chromium`) and set `CHROMIUM_PATH` to your browser executable, or update `playwright.config.ts` to use Playwright's installed browser. `BASE_URL` can point tests and screenshots at an already running production server. The test server uses localhost; the dev configuration also permits 127.0.0.1.

## What works in v1

- Responsive homepage with a live canvas preview, new-project presets/custom dimensions, image-open flow, drag-and-drop, and light/dark themes with a saved preference.
- `/editor`: a real Konva canvas with selection, move, resize, rotation, wheel/trackpad navigation, fit/reset, pan tool and touch pinch/two-finger pan. An original, editable botanical project opens by default.
- Editable text with Outfit, Georgia, Arial, and Courier New; content, size, weight/style, alignment, tracking, line height, color and opacity controls.
- Rectangles, rounded rectangles, ellipses and lines; fill, stroke, corner radius, opacity, position, size and rotation.
- PNG, JPEG and WebP import with type/size/decoding checks. Image brightness, contrast, saturation, flips and nondestructive percentage-edge cropping. Images remain embedded in editable projects.
- Layers with selection, renaming, show/hide, lock/unlock, ordering, duplication and deletion. Edge/center alignment controls. Locked layers cannot be dragged or transformed.
- Up to 60 undo snapshots with redo; dragging/resizing creates one history entry per completed interaction. Keyboard shortcuts: Ctrl/⌘ Z, Ctrl/⌘ Shift Z, Ctrl/⌘ Y, Ctrl/⌘ S, Ctrl/⌘ D, Delete/Backspace, arrows (Shift for 10px), V, H and Escape.
- `/projects`: IndexedDB save/reopen, rename, duplicate and confirmed deletion; debounced autosave after changes, manual Save and storage failure feedback. Saving an editable project is separate from downloading an image.
- PNG, JPEG and browser-supported WebP export; preview, name, half/original/double resolution, dimension limits, transparent PNG/WebP and white JPEG fallback. Exports use document coordinates independent of viewport zoom, without selection handles or canvas shadow. Native sharing is attempted when supported, with download fallback.
- `/mockups`: original generic iPhone-style and Android-style frames, portrait/landscape, screenshot placement (cover fit), background, bezel, shadow, time, battery, network, Wi-Fi and status text styling. 1600 × 1600 PNG exports visibly marked as design previews. Transaction-style examples are available separately as permanently marked educational templates.
- Mobile bottom tools and dismissible properties/layer sheets, safe-area spacing, reduced-motion rules, accessible labels, keyboard-focus outlines and native modal focus handling.
- PWA manifest, raster app icons, service worker and same-origin visited-asset caching in production. Cached editor functionality can work offline after an online visit and service worker activation.

## Editing a screenshot-style layout (educational template)

Open **Workspace → Open educational template**, or use the editor route `/editor?template=transaction-demo`.

- Choose **Edit template fields** to change the heading, screen time, supporting amount, status, address, price, network, fee, demo ID, timestamp and reference. On phones this opens the properties sheet.
- Click any text on the canvas or select its layer to change its font, size, alignment, position and other properties. These remain real text layers, not flattened image pixels.
- Save and reopen the editable project normally. Export PNG, JPEG or WebP with the existing export dialog.
- The template uses fictional data, simulation status and demo identifiers. It provides no payment verification or blockchain proof links. A visible **DEMO — NOT A REAL TRANSACTION** marking is rendered independently of the layers and reapplied during export. It cannot be removed through layer controls. The minimum demo canvas is 600 × 1000 pixels.

**Importing a PNG/JPEG/WebP does not extract its original text.** An uploaded screenshot is one image layer; its original heading and right-hand values do not become individually editable. This template demonstrates the same kind of layout with editable fictional content. OCR, automatic text detection, background reconstruction and original-font matching are not implemented.

See the [v4 educational screenshots](docs/screenshots/README.md#v4--educational-transaction-layout). Capture a new review version with `node scripts/demo-screenshots.mjs v5` after starting the app (`BASE_URL` can target a production server).

## Framed screenshot example

In **Mockup Studio**, choose **View framed screenshot** to see the generated iPhone 17-style presentation supplied in this conversation. **Download PNG** downloads that existing mockup image, byte for byte. The asset is bundled locally at `public/examples/iphone17-style-framed-screenshot.png`.

This is a single-image viewer/download example. It does not create editable transaction text or replace the separately marked educational template. The frame is a generated visual approximation, not certified device hardware artwork.

See the [v5 review screenshots](docs/screenshots/README.md#v5--framed-image-example). Capture a future version with `node scripts/framed-screenshots.mjs v6` after starting the app.

## Scope and remaining work

This is a working first release, not completion of every production-readiness ambition in the specification.

- Cropping uses percentage controls and a clipped preview, not an interactive crop rectangle. There are no drawing/eraser tools, grid/snap guides, multiselection, group layers, or freehand paths.
- Rotation uses the canvas handle/property input. Gesture rotation, long-press menus and mobile keyboard avoidance need further work. Native sharing and home-screen installation depend on browser support.
- Touch and responsive layouts are tested with Chromium phone emulation, including pinch input. Physical iOS/Android devices, Safari/WebKit, Firefox, screen readers, and a formal WCAG audit remain untested. Do not infer native-device compatibility from screenshots.
- Projects are browser/device-specific. Clearing site data deletes them. There is no cloud sync, account system or portable editable-project file format; export images you want to keep. Browser storage limits and memory still apply.
- History uses bounded full-document snapshots; very large designs need performance profiling. Images are capped at 20 MB/40 megapixels on import, canvas dimensions at 4096px and export at 32 megapixels.
- The service worker caches visited functionality, not every possible chunk before first use. Offline installation/update behavior needs broader browser testing. Change the cache version in `public/sw.js` for a new release. The PWA requires HTTPS in deployment (localhost is trusted during development).
- Unit tests cover the document/history model. Browser tests exercise user flows and exports. Dedicated React Testing Library component coverage, broad accessibility/performance audits and real-device testing are future work.

## Screenshot versions

Screenshots are real captures of the running application, saved inside the repository. The [gallery](docs/screenshots/README.md) includes desktop, dark theme, phone, projects, export and mockup screens. Original botanical artwork is in `public/botanical.svg`.

After starting the application, capture a **new** version without overwriting earlier versions:

```sh
npm run screenshots -- v4
# To capture a production server on another local port:
BASE_URL=http://localhost:3001 npm run screenshots -- v4
```

The capture script preserves folders containing `capture.json`. Commit the new folder and add it to the gallery for a visual version history. Never put personal images or private project data in review captures.

## Deployment

Deploy as a Next.js project on a compatible host such as Vercel, or as a Node.js service:

```sh
npm ci
npm run build
npm start -- --port 3000
```

Serve through HTTPS and a reverse proxy on your chosen domain. All image editing and local project storage run in the client; no backend service or credentials are required. Keep the service worker served at `/sw.js` with revalidation, and serve the manifest and icons from the origin root. The repository includes no production credentials or analytics. Deployment has not been published by this task.

## Architecture

See [implementation plan and module map](docs/implementation-plan.md), [validation evidence](docs/validation.md), and the [original specification](docs/product-specification.md).
