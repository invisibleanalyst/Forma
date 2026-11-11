# Forma implementation plan

The supplied specification is retained in [product-specification.md](product-specification.md).

1. **Foundation:** Next.js App Router, TypeScript, local Outfit font, reusable light/dark design tokens, responsive homepage, project creation.
2. **Editor:** typed document model, Konva scene renderer, Zustand history, shape/text/image tools, transform handles, contextual properties and layers.
3. **Documents:** IndexedDB projects and assets, debounced autosave, explicit save, workspace CRUD, accurate flattened exports.
4. **Presentation:** original generic phone frames, screenshot placement and configurable demonstration status bars; responsive mobile sheets and toolbar; PWA manifest and visited-asset caching.
5. **Validation and review:** unit and browser integration tests, TypeScript, lint, production build, production offline smoke check, visual review and versioned screenshots.

The first release prioritizes a working foundation. Advanced gestures, browser/device coverage, accessibility auditing, and performance work remain explicit follow-up work where not verified. See the root README for the current implementation status.

## Architecture

- `src/lib/document.ts`: serializable project/layer schema and presets.
- `src/lib/store.ts`: editor state and bounded snapshot history.
- `src/lib/storage.ts`: IndexedDB persistence, independent of canvas rendering.
- `src/lib/import.ts`, `export.ts`: validated image input and document-coordinate output.
- `src/components/editor/`: scene, canvas interaction, panels, crop and export dialogs.
- `src/components/mockup-*`: original device scene and presentation controls.
- `src/app/`: home, editor, projects and mockup routes.
- `tests/`: document/history unit tests and real browser flows.
- `scripts/screenshots.mjs`: reproducible review captures, preserving old version folders.

## Studio-first iteration

The default route now renders Mockup Studio. The previous editor/project routes and their storage remain available through More; the studio no longer offers Android. A new typed mockup module contains iPhone 15/16/17-style visual presets and fit/placement geometry. The canvas now sizes its interactive Stage to the display and scales a canonical scene, avoiding the pointer-coordinate mismatch caused by stretching an 800px canvas through CSS. `src/lib/mockup-export.ts` exports the canonical scene at exactly 1600 × 1600 independently of preview size. Touch dragging and numeric placement controls share the same screen-coordinate model.

The existing Dark palette is retained alongside Light and the added Black palette. The shared theme control stores the chosen mode. Optional top-status-area replacement provides a normal time/Wi-Fi/battery/island presentation without generating an active-call timer.
