# Validation evidence

Validated in this cloud machine using Node.js 24.22.1, npm 11.9.0, Next.js 16.4.6, and installed Chromium. Dependency versions are recorded in `package-lock.json`. The original repository was empty; this is an initial implementation.

## Completed checks

| Check                                                 | Result                                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm test`                                            | 10 document/history/crop unit tests passed                                                                   |
| `npm run typecheck`                                   | Passed                                                                                                       |
| `npm run lint`                                        | Passed with no warnings                                                                                      |
| `npm run build`                                       | Production build passed; home, editor, projects and mockups prerendered                                      |
| `BASE_URL=http://localhost:3001 npm run test:e2e`     | 18 browser tests passed; 2 device-inapplicable cases skipped                                                 |
| `BASE_URL=http://localhost:3001 npm run test:offline` | Production service worker controlled the page; offline editor reload, text editing and IndexedDB save passed |
| Screenshot capture                                    | Three preserved sets, 12 PNGs each, with capture metadata                                                    |

The two skips are intentional: desktop mouse drag/resize runs on desktop, and synthetic touch pinch runs on phone emulation. They are not missing workflows counted as passes.

## Browser coverage

- Actual homepage actions and persisted theme selection.
- New custom document, editable text, undo/redo, manual save and reopen from IndexedDB.
- Shape properties, layer duplicate/order/visibility/locking/deletion.
- Real PNG/JPEG/WebP file downloads decoded at exactly 1080 × 1080, despite changing viewport zoom. PNG checks verify the document background, artwork and headline pixels.
- PNG import, adjustments, flipping, crop/reset and unsupported-file feedback.
- Project rename, duplicate and confirmed delete.
- Generic Android device, landscape orientation, demo time, uploaded screenshot, actual mockup PNG download, and displayed preview sizing.
- No document horizontal overflow across all four routes at 320, 390, 430, 768, 1024 and 1440 CSS pixels.
- Pointer drag/resize in document coordinates with normal pointer-pixel rounding tolerance, zoom/fit and keyboard undo.
- Synthetic multi-touch pinch and fit reset on Chromium phone emulation.

## Issues found and corrected

Initial checks found TypeScript issues, a dev-server origin restriction, a mockup canvas text-node crash, a missing accessible name for icon-only Save, a cropped sample headline, oversized phone transform handles, crop/reset scaling and a nested wrapper preventing responsive mockup scaling. Tests or visual checks cover the affected behaviors. Test timing and label queries were corrected separately from application defects.

## Limits

These results establish the current browser implementation, not physical-phone compatibility, WCAG certification, cross-browser coverage, or production-scale performance. See the README scope section for remaining work. The screenshots were visually reviewed; earlier folders preserve the initial captures and their shortcomings.

No production deployment or Git push was performed. Source files, assets, tests, screenshots and instructions are in the local repository checkout for review.

The cloud configuration draft API repeatedly returned `INVALID_ARGUMENT` (“The current environment draft could not be verified”). No reusable configuration draft was saved or published. Installation/start commands remain documented in the README and can be run independently of that service.

## Educational-template update

The new transaction-style layout uses only fictional example content, with three canvas bands that identify it as a demonstration. The marks are outside the user-editable layers; export reapplies them in document coordinates after rendering the design.

Validation for this update includes 14 unit tests (the previous 10 plus four template/model tests), TypeScript, lint, a production build, and browser coverage for editing the heading/right-hand fields, saving/reopening, and checking the demo bands in actual PNG/JPEG/WebP downloads. The complete production browser run passed 20 tests, with two device-specific skips. Existing editor/export/browser flows remain in the regression suite. The v4 screenshots document the new desktop and mobile workflow.

The change does not implement OCR or automatic editing of rasterized screenshot text. It does not modify the user's original uploaded transaction screenshot.
