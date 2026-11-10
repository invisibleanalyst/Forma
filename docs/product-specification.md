# FORMA — Complete Product Design & Development Specification

## Your Role

You are acting as a principal product designer, senior full-stack engineer, frontend architect, and UX specialist.

Your task is to design, develop, test, and prepare for deployment a premium, browser-based photo editing application called **Forma**.

This is a real software product, not a conceptual design, static website, or clickable prototype.

The expectation is an exceptionally beautiful, fully functional, responsive application with carefully considered interactions, dependable editing tools, and an intuitive user experience.

**Design ambition:** The visual sophistication of Linear, the editing precision of Figma, the accessibility of Canva, and the versatility of Photopea—without unnecessarily reproducing their complexity.

Use these applications as quality references, not templates to copy.

The result should feel like an expertly designed, commercially viable software product.

---

# 1. Product Vision

## What is Forma?

Forma is a modern, browser-based visual editing workspace that allows users to create, edit, customise, and export images and designs with minimal friction.

The application must work beautifully on:

- Desktop computers.
- Laptops.
- iPhones.
- Android smartphones.
- Tablets, including iPads.

Users should not need to register, log in, or pay to access the core editor.

The first release should function primarily in the browser, with local project storage.

## Primary user journeys

### Journey A — Edit an Existing Image

1. Visit the homepage.
2. Select "Open Image".
3. Upload an image or drag it into the application.
4. Enter the editor.
5. Crop, adjust, resize, or add design elements.
6. Export the finished image.

### Journey B — Create a Design

1. Select "New Project".
2. Choose a canvas size or preset.
3. Add text, images, shapes, and other elements.
4. Arrange everything using layers.
5. Save the editable project.
6. Export the final design.

### Journey C — Create a Device Mockup

1. Open the Mockup Studio.
2. Select an iPhone or Android device preset.
3. Upload an interface design or create one.
4. Preview the design within a realistic device frame.
5. Customise supported interface details.
6. Export a clearly identified design preview.

### Journey D — Continue Editing

1. Reopen Forma.
2. Access locally saved projects.
3. Continue editing from the previous state.
4. Save or export the updated design.

---

# 2. Brand Identity & Art Direction

## Brand Name

**Forma**

Treat this as a working product name.

Build the branding so the name and logo can be changed easily without restructuring the application.

## Visual Personality

Forma should feel:

- Elegant.
- Precise.
- Calm.
- Beautifully minimal.
- Contemporary.
- Warm.
- Creative.
- Trustworthy.
- Sophisticated.

Avoid generic SaaS aesthetics.

Avoid visual clutter, excessive gradients, large decorative illustrations, unnecessarily oversized headlines, loud colours, and gratuitous animations.

The visual appeal should come from excellent typography, thoughtful proportions, subtle contrast, exceptional spacing, and polished interactions.

## Typography

### Primary Typeface: Outfit

Use Outfit as the preferred typeface.

Figtree is an acceptable alternative if visual testing suggests it produces a better result.

Use the font thoughtfully across:

- Headings.
- Buttons.
- Navigation.
- Forms.
- Toolbars.
- Menus.
- Property panels.
- Dialogs.
- Notifications.

Recommended approach:

- Headings: Outfit Medium or Semibold.
- Interface labels: Outfit Medium.
- Body copy: Outfit Regular.
- Supporting text: Outfit Regular.

Use restrained letter spacing and carefully chosen line heights.

Avoid excessive font-weight variation.

Optimise typography for readability on small mobile displays.

## Colour System

Establish a reusable token-based colour system.

### Light Theme

| Token | Hex |
|---|---|
| Background | #F8F9F6 |
| Surface | #FFFFFF |
| Primary text | #181D19 |
| Secondary text | #737A74 |
| Border | #E6EAE5 |
| Subtle surface | #F0F3EE |
| Accent | #B8F36B |
| Deep green | #244B35 |

### Dark Theme

| Token | Hex |
|---|---|
| Background | #111512 |
| Surface | #1A211C |
| Elevated surface | #242C26 |
| Primary text | #F4F6F2 |
| Secondary text | #A5B0A7 |
| Border | #344037 |
| Accent | #B8F36B |

Both themes must be fully implemented.

Users should be able to switch themes manually.

Respect system colour preferences when no explicit preference has been saved.

Ensure all text and interactive elements meet practical accessibility contrast requirements.

## Spacing

Use a consistent spacing system based on a 4px scale.

Prefer generous whitespace in marketing sections and efficient spacing in editing interfaces.

## Corners and Borders

Use subtle, consistent border radii.

Suggested:

- Small controls: 6–8px.
- Inputs and buttons: 10–12px.
- Cards and panels: 12–16px.
- Larger dialogs: 16–20px.

Borders should be delicate and intentional.

## Animation

Use subtle animations to reinforce functionality.

Examples:

- Hover transitions.
- Panel expansion.
- Button feedback.
- Dialog transitions.
- Tool selection.
- Toast notifications.

Animations should be short, smooth, and unobtrusive.

Respect reduced-motion preferences.

Avoid excessive animations that interfere with editing productivity.

---

# 3. Homepage Design

The homepage must be exceptional.

It should immediately communicate quality, simplicity, and capability.

## Navigation

Create a minimal responsive navigation bar.

Desktop:

- Forma logo.
- Features.
- Workspace.
- Theme toggle.
- Open Editor.

Mobile:

- Forma logo.
- Compact navigation menu.
- Prominent primary action.

Use generous spacing and elegant alignment.

## Hero Section

Suggested headline:

**Every image, your canvas.**

Suggested supporting copy:

*A beautifully simple workspace for editing images, creating designs, and bringing your ideas to life.*

Primary CTA:

**Start Creating**

Secondary CTA:

**Open an Image**

These actions must work.

"Start Creating" should open a new-project flow.

"Open an Image" should launch the file picker and open the selected image in the editor.

## Hero Visual

Show an authentic preview of the application.

Create an elegant composition demonstrating the actual editing workspace.

Do not create a misleading interface mockup containing features that do not exist.

Prefer a real application preview or a carefully constructed representation of implemented functionality.

## Feature Sections

Introduce the application's primary benefits:

### Effortless Editing

Adjust, crop, resize, and enhance images.

### Beautiful Typography

Add and customise text with precision.

### Flexible Layers

Arrange, combine, and manage design elements.

### Device Mockups

Present interface designs within elegant mobile device previews.

### Export with Confidence

Download finished designs in high quality.

Each feature section should have concise copy and meaningful visual examples.

## Footer

Minimal footer containing:

- Forma.
- Product links.
- Privacy information.
- Terms placeholder, if necessary.
- Copyright.

Avoid excessive marketing content.

---

# 4. Application Navigation

Create an intuitive application structure.

Suggested primary routes:

- `/` — Homepage.
- `/editor` — Main editor.
- `/projects` — Locally saved projects.
- `/mockups` — Mockup studio.
- `/settings` — Application preferences, if needed.

Do not create unnecessary pages.

Users should be able to move between the homepage, editor, and saved projects without confusion.

---

# 5. Desktop Editor Layout

The desktop editor should resemble a refined professional creative workspace.

## Top Toolbar

Include:

- Forma identity.
- Editable project name.
- Undo.
- Redo.
- Zoom indicator.
- Save.
- Export.
- Theme or workspace controls.

Use clean iconography with tooltips.

## Left Toolbar

Provide tools for:

- Select.
- Text.
- Shapes.
- Image upload.
- Crop.
- Pan.
- Zoom.

Add drawing and erasing tools when the underlying editing engine supports them reliably.

Do not display nonfunctional tools as though they are complete.

## Central Canvas

The canvas is the application's primary working area.

It must support:

- Selecting objects.
- Moving objects.
- Resizing.
- Rotating.
- Zooming.
- Panning.
- Object duplication.
- Layer-based rendering.
- Contextual selection handles.
- Accurate visual positioning.

Include alignment guides and snapping when supported.

Maintain canvas accuracy regardless of zoom level.

## Right Properties Panel

Show contextual properties based on the currently selected object.

### Text Properties

- Text content.
- Font family.
- Font size.
- Weight.
- Colour.
- Alignment.
- Line height.
- Letter spacing.
- Opacity.
- Position.
- Rotation.

### Image Properties

- Width.
- Height.
- Position.
- Rotation.
- Opacity.
- Brightness.
- Contrast.
- Saturation.
- Flip.
- Crop.

### Shape Properties

- Fill colour.
- Stroke.
- Border width.
- Corner radius, where applicable.
- Width and height.
- Position.
- Rotation.
- Opacity.

## Layers Panel

Include:

- Layer names.
- Selection.
- Visibility.
- Locking.
- Reordering.
- Duplication.
- Deletion.

Provide visual feedback for selected layers.

---

# 6. Mobile Experience — First-Class Requirement

**Mobile must not be treated as a secondary or reduced-quality experience.**

Forma must be fully functional on iPhones, Android phones, and tablets.

The application should feel like a premium native mobile editing app, even when accessed through a browser.

## Mobile Homepage

Design specifically for smaller displays.

Requirements:

- Excellent typography.
- Thoughtful spacing.
- Compact navigation.
- Thumb-friendly controls.
- Responsive visual previews.
- Clearly visible actions.
- No horizontal overflow.
- No cramped cards or unnecessary visual elements.

## Mobile Editor

Do not simply shrink the desktop interface.

Create a dedicated adaptive arrangement.

### Top Bar

Include:

- Back or home navigation.
- Project name.
- Undo and redo.
- Save.
- Export.

### Central Canvas

The canvas should occupy as much usable screen space as possible.

Preserve a comfortable editing area.

### Bottom Toolbar

Use a touch-friendly bottom toolbar for primary tools.

Potential tools:

- Select.
- Text.
- Images.
- Shapes.
- Layers.
- Adjust.
- Crop.

Support horizontal scrolling where necessary.

### Contextual Bottom Sheets

When a user selects a tool or object, display the relevant settings in a well-designed bottom sheet.

Examples:

- Text properties.
- Image adjustments.
- Colour picker.
- Layers.
- Export options.

Sheets should be easy to dismiss and must not permanently obscure the canvas.

## Touch Gestures

Support:

- Single tap to select.
- Drag to move.
- Pinch to zoom.
- Two-finger pan.
- Touch-friendly resize handles.
- Rotation.
- Double-tap to edit text where appropriate.
- Long-press contextual actions.

Gestures must not conflict unpredictably with browser scrolling or navigation.

## Mobile Text Editing

When editing text:

- Open the native keyboard.
- Keep the edited element accessible.
- Avoid keyboard-induced layout jumps.
- Preserve text selection and editing state.
- Make font and style controls easy to access.

## Mobile Responsiveness

Support:

- 320–374px small phones.
- 375–430px standard phones.
- 431–767px larger mobile screens.
- 768–1023px tablets.
- 1024px+ desktop.

Use responsive layouts based on both viewport dimensions and interaction capabilities.

Support portrait and landscape orientation.

Respect device safe areas, including iPhone notches, Dynamic Island, browser controls, and home indicators.

---

# 7. Core Editing Engine

Implement a real image editing engine.

## Image Import

Support:

- PNG.
- JPEG.
- WebP.

Allow:

- File picker upload.
- Drag-and-drop upload on supported devices.
- Mobile photo library selection.

Validate files and handle errors gracefully.

## Image Manipulation

Support:

- Move.
- Resize.
- Rotate.
- Crop.
- Flip horizontally and vertically.
- Opacity changes.
- Brightness.
- Contrast.
- Saturation.

Preserve image quality and aspect ratio where appropriate.

## Text Editing

Text must remain editable.

Support:

- Create text layers.
- Edit content.
- Change fonts.
- Adjust font sizes.
- Change colours.
- Resize text areas.
- Position and rotate text.
- Adjust alignment.
- Duplicate and delete text.

## Shapes

Include:

- Rectangle.
- Rounded rectangle.
- Ellipse.
- Line.

Support colour, size, position, rotation, and opacity.

## Layer Management

Support:

- Adding.
- Selecting.
- Renaming.
- Reordering.
- Locking.
- Hiding.
- Duplicating.
- Deleting.

Maintain accurate rendering order.

## History

Implement reliable undo and redo.

Support reasonable keyboard shortcuts.

History should work for meaningful operations such as moving, resizing, adding, deleting, and editing objects.

Do not create excessive history entries while dragging an object.

---

# 8. Canvas and Document Management

## Canvas Presets

Offer common presets:

- Square.
- Portrait.
- Landscape.
- Instagram Post.
- Instagram Story.
- Mobile Screen.
- Desktop Wallpaper.
- Custom dimensions.

Show canvas dimensions clearly.

## Zoom and Pan

Support:

- Fit to screen.
- Zoom in.
- Zoom out.
- Reset zoom.
- Mouse wheel or trackpad zoom where appropriate.
- Touch pinch zoom.
- Hand tool panning.

## Background

Allow:

- Solid background colour.
- Transparent background.
- Background image.

## Alignment

Support:

- Center horizontally.
- Center vertically.
- Align left, right, top, and bottom.
- Snap-to-guides or grid where implemented.

---

# 9. Device Mockup Studio

Create a dedicated mobile mockup experience.

This feature is intended for interface design, app previews, presentation assets, and legitimate visual demonstrations.

## Device Presets

Provide:

- Generic modern iPhone-style devices.
- Generic Android-style devices.
- Different screen aspect ratios.
- Portrait and landscape orientations.

Use original device-frame artwork or appropriately licensed assets.

## Device Presentation

Support:

- Realistic device proportions.
- Rounded screen corners.
- Appropriate status-bar safe areas.
- Optional device bezels.
- Background customisation.
- Device shadow.
- Interface screenshot placement.

## Status Bars

Support configurable demonstration status bars:

- Time.
- Battery appearance.
- Network indicator.
- Wi-Fi indicator.
- Light and dark status-bar styles.

Time may be automatically generated from the current device time.

Users may also choose a fixed time for UI design and testing.

## Sample Data

Allow clearly identified sample values for demonstration screens.

Example:

- Demo reference ID.
- Demo session ID.
- Sample timestamp.
- Placeholder account name.

Where random identifiers are needed, use collision-resistant generation suitable for demo records.

## Financial Interface Templates

Financial transaction interfaces may be provided strictly as illustrative, clearly marked UI demonstrations.

Requirements:

- Persistent visible "DEMO — NOT A REAL TRANSACTION" marking.
- Explicitly fictional data.
- No representations of verified or settled payments.
- No invented blockchain proof links or transaction hashes presented as genuine.
- No features intended to fabricate authentic proof of payment.

The application should be able to create professional UI mockups without misleading viewers about whether an actual transaction occurred.

---

# 10. Export System

Implement reliable client-side export.

## Formats

Support:

- PNG.
- JPEG.
- WebP where browser support allows.

## Export Controls

Allow:

- Export format selection.
- Export resolution or scale.
- Background transparency where supported.
- Filename customisation.
- Preview before export.

## Export Accuracy

The exported file must accurately reflect the actual design.

Do not include editing controls, selection handles, toolbars, or guides in the exported image.

Ensure output dimensions are independent of the device screen size and editor zoom level.

## Mobile Export

Support reliable file downloads on mobile browsers.

Where appropriate, integrate native sharing using available browser capabilities.

Provide fallback behavior if native sharing is unavailable.

---

# 11. Local Projects and Persistence

The first version should work without a backend.

Use IndexedDB to store:

- Project metadata.
- Canvas dimensions.
- Layer definitions.
- Text content.
- Object positions.
- Object styles.
- Image assets.
- Project preferences.

Implement:

- Create project.
- Rename project.
- Save project.
- Reopen project.
- Duplicate project.
- Delete project.

Consider autosave with sensible debouncing.

Provide a clear distinction between saving an editable project and exporting a flattened image.

Handle browser storage limitations gracefully.

Projects saved locally are specific to the browser/device and are not automatically synchronised across devices.

---

# 12. Progressive Web App

Implement Forma as an installable Progressive Web App where supported.

Include:

- Web app manifest.
- App icons.
- Theme colours.
- Standalone display mode.
- Basic service worker caching.
- Appropriate offline support for cached application functionality.

The application should be usable from a supported phone's home screen.

Do not promise identical PWA installation behavior across all browsers.

---

# 13. Technology Stack

Use the following preferred technologies:

## Frontend

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.

## Editing

- Konva.js.
- React Konva.

## State

- Zustand.

## Local Storage

- IndexedDB.
- A suitable IndexedDB wrapper, if useful.

## UI

- Lucide React.
- Radix primitives or carefully chosen accessible UI components.
- A small animation library only if necessary.

## Testing

- Vitest for unit tests.
- React Testing Library for component tests.
- Playwright for end-to-end tests.

Use current stable versions that are mutually compatible.

Do not add unnecessary libraries.

## Architecture

Separate:

- Design system.
- Application layout.
- Canvas renderer.
- Editor state.
- Editing tools.
- Project persistence.
- History management.
- Asset management.
- Export functions.
- Mockup studio.

Use modular components and well-defined types.

Avoid monolithic files and deeply coupled business logic.

---

# 14. Accessibility

Accessibility is a core product requirement.

Implement:

- Semantic interface elements.
- Accessible button labels.
- Keyboard navigation.
- Visible focus states.
- Sufficient contrast.
- Suitable touch-target sizes.
- Screen-reader descriptions where practical.
- Reduced-motion support.
- Accessible dialogs.
- Clear validation messages.

Meet WCAG 2.2 AA where applicable and practical for the editing interface.

---

# 15. Performance

Optimise for desktop and mobile.

Requirements:

- Fast initial loading.
- Lazy-load the editing engine where appropriate.
- Avoid unnecessary canvas re-renders.
- Efficiently handle object transformations.
- Manage uploaded image memory carefully.
- Handle high-resolution images.
- Avoid blocking the interface unnecessarily.
- Minimise bundle size.
- Use efficient project serialization.

Test on mid-range mobile devices, not only high-end computers.

Where memory constraints prevent an operation, show a useful error rather than crashing.

---

# 16. Privacy and Security

Forma should process images locally by default.

Do not upload user images to external services without explicit consent.

Avoid unnecessary analytics and tracking.

Protect local project data from accidental corruption.

Validate file types and sizes.

Do not execute arbitrary content embedded within uploaded files.

Do not use insecure HTML injection.

If cloud functionality is introduced later, design it around explicit user consent and appropriate authentication.

---

# 17. Quality Assurance

Test the application thoroughly.

## Desktop Browsers

- Chrome.
- Firefox.
- Safari.
- Edge.

## Mobile Browsers

- iPhone Safari.
- Android Chrome.
- iPad Safari.

## Important Workflows

Verify:

1. Homepage navigation.
2. Creating a new project.
3. Uploading an image.
4. Moving an image.
5. Resizing and rotating objects.
6. Adding editable text.
7. Editing typography.
8. Creating and manipulating shapes.
9. Layer reordering.
10. Undo and redo.
11. Saving a project.
12. Reopening a saved project.
13. Exporting.
14. Mobile touch editing.
15. Orientation changes.
16. Theme switching.
17. Error handling.
18. Keyboard behavior.
19. Device mockup creation.
20. Responsive layouts.

Do not claim physical-device testing unless it has actually been performed.

---

# 18. Development Roadmap

Implement the project in stages.

## Phase 1 — Project Foundation

- Initialise the repository.
- Configure Next.js and TypeScript.
- Configure Tailwind.
- Establish design tokens.
- Configure typography.
- Set up component architecture.
- Implement themes.
- Build core reusable components.

## Phase 2 — Exceptional Homepage

- Create navigation.
- Implement hero.
- Build feature sections.
- Add meaningful editor previews.
- Create footer.
- Implement mobile responsiveness.
- Polish transitions and accessibility.

All primary homepage actions must function.

## Phase 3 — Editor Foundation

- Build desktop workspace.
- Build mobile workspace.
- Implement canvas.
- Add image import.
- Add object selection.
- Add drag, resize and rotation.
- Implement basic text editing.
- Implement shapes.
- Implement layers.

## Phase 4 — Functional Editing

- Crop and image adjustments.
- Undo and redo.
- Alignment.
- Zoom and pan.
- Keyboard shortcuts.
- Mobile gestures.
- Export functionality.

## Phase 5 — Projects

- Implement IndexedDB persistence.
- Save and reopen projects.
- Add project management.
- Implement autosave.
- Add project duplication and deletion.

## Phase 6 — Mockup Studio

- Device presets.
- Screen framing.
- Status-bar presentation.
- Automatic demonstration timestamps.
- Example data.
- Clearly labeled demo templates.
- Mockup export.

## Phase 7 — Mobile and PWA Polish

- Refine touch interactions.
- Improve bottom sheets.
- Handle mobile keyboards.
- Add PWA capabilities.
- Test portrait and landscape layouts.
- Improve performance.

## Phase 8 — Production Readiness

- Automated tests.
- Accessibility checks.
- Browser compatibility.
- Performance profiling.
- Error handling.
- Documentation.
- Deployment configuration.

---

# 19. Definition of Done

A feature is complete only when:

1. It works in the running application.
2. It is visually consistent.
3. It is usable on applicable mobile and desktop layouts.
4. It handles common errors.
5. It has appropriate tests.
6. It does not break existing functionality.
7. Its controls are not decorative placeholders.

Do not sacrifice technical correctness for visual appearance.

Do not claim something has been tested unless the test was executed.

---

# 20. Design Review Standards

Before considering a screen complete, critically evaluate:

- Is the typography excellent?
- Are elements aligned consistently?
- Is the visual hierarchy obvious?
- Is the spacing intentional?
- Are the colours restrained?
- Are controls appropriately sized?
- Is the canvas given enough room?
- Does the layout work on narrow mobile screens?
- Do interactions feel responsive?
- Is there unnecessary visual noise?
- Could anything be removed without reducing usability?

Refine until the interface feels cohesive and polished.

The homepage should be beautiful, but the editor must receive equal design attention.

---

# 21. Required Deliverables

Create:

1. A working Next.js application.
2. A responsive premium homepage.
3. A functional browser-based editing workspace.
4. Mobile-friendly editing controls.
5. Image, text and shape editing.
6. Layer management.
7. Undo and redo.
8. Image export.
9. Local project saving.
10. Device mockup functionality.
11. Progressive Web App configuration.
12. Automated tests.
13. README documentation.
14. Deployment instructions.

Include a clear list of implemented and incomplete functionality.

---

# 22. Instructions for Codex

First inspect the project directory.

If the folder is empty, initialise the application with the recommended stack.

Create a concise implementation plan and establish a sensible architecture.

Then begin implementation immediately.

Do not stop after creating documentation or a visual prototype.

Implement working functionality incrementally.

After each major phase:

- Run the application where possible.
- Execute relevant tests.
- Run TypeScript and lint checks.
- Fix discovered issues.
- Review desktop and mobile layouts.
- Record implemented functionality and limitations.

Prioritise the foundational editor over optional advanced features.

If a requirement is too large to implement reliably in one iteration, divide it into smaller tasks and complete the most valuable functioning subset first.

Do not silently skip requirements or represent incomplete features as finished.

Do not make arbitrary changes to the approved visual direction.

Where a minor design decision is unspecified, exercise professional design judgement.

Use the strongest available tooling to inspect and verify the final result.

## Final Product Standard

**Forma should feel effortless to use, beautiful to look at, and dependable enough to become part of someone's everyday creative workflow.**

Build it with the restraint of a great product designer, the precision of a professional editing tool, and the engineering quality of production software.

Begin implementation now.