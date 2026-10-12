# Vela

**Thoughtful spaces. Beautifully presented.**

Vela is an offline-capable interior design studio with a metric 2D editor, coordinated 3D model, material palettes, project library, furniture specifications, and client presentation exports.

Version **0.1.0** is a working local design application. It builds on the Roomnote planner from `tirthankardgen-cell/Interior-design-`, keeping compatibility with its layout files.

![Vela design studio](docs/assets/vela-studio.png)

## Host the website on Vercel

1. Push this repository to GitHub as **Vela**.
2. In Vercel, choose **Add New → Project**, and import the Vela repository.
3. Keep the repository root as the root directory. `vercel.json` sets the framework to Other, installs with `npm ci`, builds with `npm run build`, and publishes **docs**.
4. Deploy. No environment variables or secrets are required for the current static website.
5. Add a custom domain in Vercel when desired. Subsequent pushes can trigger deployments through Vercel's Git integration.

Node 24 is pinned in `package.json`. Build settings are versioned in `vercel.json`. This site runs entirely in the browser; there is no server database or account system. A visitor's projects remain in their browser storage, separately for each domain/device. Export JSON before moving from a preview deployment to the production domain.

The build and browser workflow are locally validated. A live Vercel deployment must be verified after connecting your GitHub repository; it has not been deployed by this setup.

## Run Vela

Download `downloads/Vela.zip`, extract it, and open **Vela.html** in a modern desktop browser with hardware acceleration enabled. The app includes its JavaScript and styling; there are no CDN dependencies, accounts, or API keys.

For the validated local development workflow:

```sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run build
npm run dev
```

The development server listens on port 8766. Node 20+ and Python 3 are required. The build produces `index.html`, `planner.html`, and `docs/index.html`. The `docs` directory can be published with any static host.

## Design workflow

1. Open project details beside the Vela logo. Set the project, client, studio, currency, and optional furniture budget.
2. Choose a template, or start with an empty room. Search the collection, then click or drag pieces onto the plan.
3. Select an item to adjust dimensions, elevation, position, rotation, colour, supplier, and unit cost. Doors and windows attach to external or internal walls.
4. Explore **Materials & finishes**. Apply a palette to a selected item, all furniture, or room floor and walls. Undo reverses these changes.
5. Switch to **3D studio** to orbit the matching model. Export a plan SVG or a 3D PNG.
6. Open **Furniture schedule** for the itemised estimate, remaining budget, and CSV export.
7. Choose **Present** for a client board with the floor plan, finishes, project details, notes, and furniture schedule. Download the standalone HTML or use **Print / Save PDF**.
8. Use **Save project** to save a named library snapshot and download a portable JSON backup. **Projects** creates new projects and opens, copies, and removes library snapshots. Draft edits autosave separately.

Keyboard: R rotates; D duplicates; Delete removes; arrow keys move 5 cm, or 1 cm with Shift; Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z redoes; Ctrl/Cmd+S saves and exports.

## Data and pricing

Projects and autosave live in this browser on this device. Browser storage can be cleared or unavailable; export JSON backups for anything important. Up to 20 named projects can be stored. Import accepts existing Roomnote JSON and Vela exports. Geometry uses metres; inspector dimensions use centimetres.

Budgets use manually entered amounts. Changing currency relabels amounts without conversion. Zero or blank costs are treated as unspecified and excluded from the priced-item count. Estimates exclude taxes, installation, delivery, and unpriced items. Supplier entries are plain text references, not live vendor integrations.

Material samples communicate a colour direction. This release applies colours to schematic geometry; it does not provide scanned PBR materials or photorealistic rendering. Plans are conceptual, not certified construction drawings; verify dimensions and clearances on site. Presentation plans are not to a printed scale.

## Validation

Install Python Playwright and provide Chromium, then keep `npm run dev` running in a separate terminal:

```sh
npm test
```

The prepared environment already supplies Playwright and `/usr/bin/chromium`. On another machine, install them through your package manager or `python3 -m pip install playwright` and `python3 -m playwright install --with-deps chromium`; set `CHROMIUM_PATH` to the installed browser executable if necessary.

`VELA_BASE_URL` overrides the default test server address. Tests exercise real browser editing, wall attachment, undo/redo, JSON round-trip, invalid import, offline 3D, export, metadata, costs, palettes, project library, CSV formula escaping, presentation PDF generation, and responsive widths. Direct `file://` execution is intended for desktop use but has not been validated by the automated HTTP-based suite.

## Source map

- `planner/app.js` — metric geometry, 2D editing, validation, history, and Three.js scene.
- `planner/studio.js` — project library, metadata, materials, schedule, client boards.
- `planner/template.html` and `planner/style.css` — responsive workspace.
- `planner/build.mjs` — self-contained HTML build.
- `tests/` — three browser regression suites.

## Commercial product milestones

This first release supplies a professional local workflow. Further releases can add measured floor-plan tracing, a licensed high-detail asset catalog, richer materials and rendering, cloud accounts and backup, team permissions, collaboration, billing, and an operational security/accessibility review. Those services are not implemented or implied by this release.

Third-party notices are in `THIRD_PARTY_NOTICES.md`.
