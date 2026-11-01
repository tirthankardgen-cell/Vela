# Vela

**Thoughtful spaces. Beautifully presented.**

Vela is an interior design website built with Next.js, React, Tailwind CSS and Three.js. Its olive, ivory and champagne identity pairs self-hosted Cormorant Garamond and Manrope typography with an architectural V mark.

Production URL: https://vela-dgen.vercel.app/

![Vela design studio](docs/assets/vela-studio.png)

Studio roadmap: [phased layout, drawing and tracing plan](docs/plans/studio-roadmap.md). The first phase simplifies the studio controls and icons; connected-room drawing and calibrated tracing are planned separately.

The studio uses a full-screen canvas with floating library, properties and tool controls. Use **Focus** to hide both panels. Browse Furniture, Electronics, Climate, Decor or Build; room filters and search aliases help find the existing objects. See the [catalogue research and rollout](docs/plans/studio-catalogue-research.md) for planned additions.

## Website workflow

1. Explore the landing page, then sign up or sign in with email/password or Google. Guest access is also available.
2. Start an empty room in centimetres or feet and inches, choose a furnished 1BHK, 2BHK, 3BHK or 4BHK flat, or upload a PNG, JPEG, WebP or PDF floor plan. PDFs use their first page; uploaded plans are scaled tracing references, not automatic wall detection.
3. Arrange furniture, walls, doors and windows in the 2D editor and inspect the matching 3D scene. Room setup supports international currencies; inspector measurements remain in centimetres.
4. Apply finishes, record costs and suppliers, and export layout JSON, plan SVG, 3D PNG, furniture CSV or a client presentation for printing to PDF.
5. Return to the project dashboard to reopen your cloud-saved plans.

## Flat templates

The collection contains **eight furnished flats**, with two layouts for each BHK size. Choose **A furnished flat** during setup, or open **Flat templates** in the studio library to preview and replace a layout. The previous sample flat, living-room sketch and bedroom sketch have been removed. Replacement preserves project details and supports undo.

Each flat includes named rooms, shared walls, attached doors with editable swings, exterior windows, fitted kitchen units, bathroom fixtures and measured furniture. Previews and the editor show clear room sizes; overall dimensions and plan area follow wall centre lines. The [template dimensions and conventions](docs/flat-templates.md) explain the collection and its checks.

## Real accounts and cloud plans

Firebase Authentication and Cloud Firestore are the default. Sign in with email/password or Google to save and reopen private plans across devices. The editor saves rooms, geometry, furniture, finishes, costs, suppliers, notes and camera position. Tracing images stay in the browser and JSON exports; Firebase Storage is not used, so the integration works with the Spark plan.

Follow [Firebase and Vercel setup](docs/firebase-setup.md) for the exact environment-variable block, provider/domain configuration, Firestore rules deployment and emulator tests. Real sign-in stays unavailable until configuration is supplied; it never silently falls back to a simulated account.

Saves are serialized and debounced, with revision checks for concurrent edits. Unsynced browser drafts can be recovered as separate projects from the dashboard. Guests can still use the local editor. Existing preview projects can be moved using JSON export/import. Explicit `NEXT_PUBLIC_AUTH_MODE=demo` enables the old local simulation for development tests only; passwords in that mode are never verified or saved.

## Run and deploy

Use Node **24.x** and npm:

```sh
npm ci
npm run build
npm run dev
```

Development uses port 8766. `npm run start` serves the production build on port 8767. In the prepared cloud environment, use `npm ci --cache /workspace/.npm-cache --no-audit --no-fund`.

Vercel should import this repository with its root directory at the repository root. `vercel.json` selects **Next.js**, `npm ci`, `npm run build`, and explicitly sets the output directory to `.next`. This overrides the legacy `docs` project setting. If editing the Vercel dashboard settings, use `.next` or disable the output-directory override; never use `docs` for this Next.js application. Set the Firebase environment variables before deploying real accounts. Connected Git deployments can publish subsequent pushes.

The canonical URL and sharing metadata use `https://vela-dgen.vercel.app` in `src/lib/site.js`. Brand assets are generated during preparation. Fonts are self-hosted and licensed under the SIL Open Font License; sources and palette research are in `brand/README.md`. The editorial landing page uses local WebP inspiration images, SVG icons, scroll reveals and gentle parallax with reduced-motion and no-JavaScript fallbacks. Its testimonial cards are explicitly labelled sample quotes; replace them with approved customer feedback before presenting them as real reviews. Image provenance is recorded in the brand guide.

## Validation

```sh
npm run test:branding
# With the development server running:
npm test
# Or target the production server:
VELA_BASE_URL=http://127.0.0.1:8767 npm test
```

Browser tests require Python Playwright and Chromium. The cloud environment supplies both. Elsewhere, install Playwright and Chromium, then set `CHROMIUM_PATH` if it differs from `/usr/bin/chromium`.

Tests cover editing, drag/drop, wall attachments, undo/redo, JSON round-trip, 3D, exports, material and cost workflows, React event handling, simulation signup/login, local persistence, measured rooms, image/PDF upload, mobile widths and metadata. Run `npm run test:cloud` and `npm run test:firebase` for cloud-save and Firestore-rule coverage. The historical onboarding smoke test requires explicit demo mode.

## Standalone edition

`npm run build:standalone` produces `downloads/Vela.html` and `downloads/Vela.zip`. This separate offline React editor has no account or landing-page flow. The bundled editor includes all eight flat templates and has been verified in Chrome directly from a local file without network access, including template replacement, undo/redo, saving and 3D. `index.html`, `src/main.jsx` and `vite.config.js` are its source entry points; the hosted website uses `app/` and Next.js.

## Source map

- `app/`: Next.js pages and global metadata.
- `src/auth/`, `src/onboarding/`, `src/components/`: account, room setup and React workspace.
- `src/lib/`: measurements, local stores, active Firebase adapters and plan upload processing.
- `planner/app.js`, `planner/studio.js`: room geometry, Three.js, project tools and exports.
- `scripts/`: branding, PDF worker preparation and standalone packaging.
- `tests/`: browser regression and asset/unit checks.

Vela preserves compatibility with Roomnote layout JSON from the original `tirthankardgen-cell/Interior-design-` repository. Furniture is schematic and dimensions should be verified on site. Budgets are manually entered estimates; currency changes relabel amounts without conversion. Tax, delivery, installation and unpriced items are excluded. Photorealistic rendering, automatic floor-plan recognition, billing and collaboration are not included.
