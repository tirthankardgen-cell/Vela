# Vela catalogue research and category plan

**Prepared:** 13 October 2026  
**Status:** Research and product proposal. Categories and assets below are not yet implemented.  
**Scope:** A room/flat design library that can grow into a professional residential and small-commercial workflow.

## Recommendation

Give Vela five workspace sections: **Build, Furnish, Finish, Plan and Project**. Inside Furnish, offer a searchable category list with Furniture, Kitchen, Bathroom, Lighting, Electronics, Appliances, Climate, Decor, Plants and Outdoor. Use room filters across those categories instead of maintaining a separate copy of the same object for every room.

Keep construction tools and materials outside the object catalogue. A wall is drawn; a sofa is placed; paint is applied to a surface; a dimension is an annotation. These need different interactions even if users can find them through one search.

Start by reorganising the existing objects, then add essential missing objects. Connected-room drawing and calibrated floor-plan tracing remain the next core workflow milestones in the [studio roadmap](studio-roadmap.md).

## 1. What the web research established

| Source | Verified finding | Lesson for Vela | Limits of this evidence |
| --- | --- | --- | --- |
| [S1: BlenderKit published category data](https://github.com/BlenderKit/BlenderKit/blob/master/data/categories.json) | Separate model and material trees. Models include Architecture, Interior, Decoration, Nature and Technology. Interior includes beds, chairs, cabinets, kitchen, bathroom, lighting, office, outdoor, restaurant/bar and retail. Technology includes audio, computers, video and household appliances. | Separate asset types; provide explicit Electronics and Appliances; keep materials independent from objects. | This is the add-on repository's published category snapshot, not a verification of the live marketplace menu or a room-planner editor. |
| [S2: Sweet Home 3D catalogue, public mirror](https://github.com/lrq3000/sweethome3d/blob/master/SweetHome3D/src/com/eteks/sweethome3d/io/DefaultFurnitureCatalog.properties) | Categories include Bathroom, Bedroom, Doors and windows, Kitchen, Lights, Living room, Miscellaneous and Staircases. Entries include furniture, sanitary fixtures, appliances, openings, radiators, lights, a television and a laptop. | Room-based browsing is approachable; beginners should be able to filter by room as well as object type. | A mirror of the default catalogue, with a 2006–2024 copyright header. It is not a verified current release inventory. |
| [S3: buildingSMART IFC furniture types](https://github.com/buildingSMART/IFC4.3.x-development/blob/master/docs/schemas/shared/IfcSharedFacilitiesElements/Types/IfcFurnitureTypeEnum.md) | Explicit furniture types include chair, table, desk, bed, file cabinet, shelf, sofa and technical cabinet. | Use stable functional types beneath friendly labels. Distinguish a desk from a table and a storage cabinet from an appliance. | A professional building-data classification reference, not a consumer UI specification. This does not imply IFC support in Vela. |
| [S4: BlenderKit add-on documentation](https://github.com/BlenderKit/BlenderKit/blob/master/README.md) | Describes searching for assets and dragging them into a scene. | Search and placement should be the primary catalogue actions. | Source-repository documentation, not a hands-on test of the current add-on. |

The linked source files were successfully fetched from `raw.githubusercontent.com` during this research. These are useful references for interior visualisation, home planning and professional building data; they do not establish that every professional studio follows one universal category system.

Direct requests to [Floorplanner](https://floorplanner.com/), [RoomSketcher](https://www.roomsketcher.com/features/), [Homestyler](https://www.homestyler.com/), [Planner 5D](https://planner5d.com/), [Archiproducts](https://www.archiproducts.com/en/products) and BlenderKit's marketplace were blocked by the environment proxy with HTTP 403. Their current live interfaces and full feature lists could not be reviewed. No claims about their exact current menus are made below.

**Evidence versus proposal:** Sections 2–10 are Vela design recommendations informed by S1–S4 and the existing Vela code. They are not a transcription of a competitor's catalogue. No third-party models or textures were imported.

## 2. Workspace organisation

| Section | Contents | Main interaction |
| --- | --- | --- |
| **Build** | Rooms, walls, openings, columns, stairs and fixed architectural elements | Draw, connect, resize or attach |
| **Furnish** | Furniture, equipment, fixtures and decorative objects | Search, place, rotate and customise |
| **Finish** | Floor, wall, ceiling and object materials | Select a surface, then apply a finish |
| **Plan** | Measurements, room labels, reference images, visibility and guides | Measure, annotate, calibrate and organise |
| **Project** | Name, units, currency, saves, imports, exports and presentations | Manage and deliver the design |

A kitchen cabinet is a fixed furnishing; a partition belongs to Build. Users should still find both with a global search. Keep 2D/3D, selection, undo/redo and zoom in a persistent canvas toolbar rather than duplicating them in each section.

On desktop, use a narrow section selector, a searchable library panel and a contextual properties panel. On mobile, show one library level at a time with Back and a visible return-to-canvas action. Avoid ten permanent tabs competing for width.

## 3. Proposed object categories

“First” means prioritise representative functional objects after the category framework; it does not mean ship the complete row immediately. “Expand” means follow the core residential workflow. Room filters remain optional and independent.

| Category | Subcategories and examples | Priority | Placement considerations |
| --- | --- | --- | --- |
| **Furniture** | Seating: sofas, sectionals, armchairs, dining chairs, stools, benches, ottomans. Tables: dining, coffee, side, console. Beds: single, double, bunk, cot/crib, headboards. Storage: wardrobes, dressers, bookcases, shelves, shoe storage, TV consoles. Work: desks, office chairs, filing cabinets. | First | Floor footprint, height, rotation; wall mounting for shelves; drawer/door opening envelopes later. |
| **Kitchen** | Base, wall and tall cabinets; corner units; islands; worktops/countertops; breakfast bars; sinks; taps/faucets; pantry units; splashbacks/backsplashes. | First | Wall alignment, mounting height, worktop height and modular dimensions. Appliances remain separate assets. |
| **Bathroom** | Toilets, bidets, washbasins, vanity units, showers, enclosures, bathtubs, taps, shower fittings, towel rails and bathroom accessories. | First | Floor/wall attachment, fixture height, usable space; service connections can be indicated later. |
| **Lighting** | Pendant lights, chandeliers, ceiling fixtures, recessed downlights, track lights, wall sconces, floor lamps, desk/table lamps, under-cabinet and outdoor lights. | First | Floor, wall or ceiling attachment; suspension/drop height. A visible lamp model is separate from simulated light output. |
| **Electronics** | TVs/displays, monitors, laptops, desktop computers, projectors, speakers, soundbars, audio systems, game consoles, printers, routers and smart-home controls. | First for TV/computer; expand the rest | Wall/desk/floor mounting, screen orientation and mounting elevation. Keep devices separate from supporting furniture. |
| **Appliances** | Refrigerators, freezers, cooktops/hobs, ranges/cookers, ovens, range hoods, microwaves, dishwashers, washing machines, tumble dryers and small countertop appliances. | First for major appliances | Freestanding versus built-in; width/depth/height, door swing, service and ventilation zones. No electrical or ventilation compliance claims. |
| **Climate** | Wall AC units, ceiling fans, portable fans, radiators, heaters, air purifiers, thermostats, vents and grilles. | First for existing AC/fan; expand later | Wall/ceiling/floor mounting; fan diameter and drop; conceptual service clearance. |
| **Decor** | Rugs, curtains, blinds, cushions, throws, bedding, mirrors, art, frames, shelves used as displays, clocks, vases, sculpture, books and tabletop accessories. | First for rugs/mirrors/curtains; expand later | Surface placement, wall attachment, fabric size and layer order. Avoid filling the initial library with minor props. |
| **Plants** | Indoor plants, floor pots, tabletop plants, planters, hanging baskets and green walls. | First for a few indoor plants | Floor/surface/ceiling/wall support and overall canopy size. |
| **Outdoor** | Patio and balcony seating, garden tables, sun loungers, umbrellas, outdoor storage, barbecues/grills and outdoor accessories. | Expand | Outdoor suitability, footprint and umbrella height; cross-link outdoor lights and planters. |

### Furniture browsing hierarchy

Use this as the largest category's first practical structure:

- **Seating:** sofas & sectionals; armchairs; dining chairs; office chairs; stools; benches & ottomans.
- **Tables & desks:** dining tables; coffee tables; side tables; console tables; desks.
- **Beds:** single; double/queen/king; bunk & loft; cot/crib; headboards.
- **Storage:** wardrobes; dressers; bookcases & shelves; sideboards; TV consoles; shoe cabinets; filing cabinets.
- **Sets:** optional dining sets and seating arrangements, assembled from individually editable objects.

Bed labels vary internationally. Show actual dimensions alongside “queen” or “king” instead of assuming one country's size. Likewise, a sectional can have left/right configurations without becoming unrelated search results.

### Electronics versus appliances

Use function to decide the primary home:

| Item | Primary category | Useful extra tags |
| --- | --- | --- |
| Television | Electronics → TVs & displays | Living, bedroom, wall-mounted |
| TV console | Furniture → Storage | Living, media |
| Refrigerator | Appliances → Refrigeration | Kitchen, freestanding/built-in |
| Washing machine | Appliances → Laundry | Laundry, bathroom |
| Desk lamp | Lighting → Table & desk | Office, bedroom |
| Ceiling fan | Climate → Fans | Living, bedroom, ceiling-mounted |
| AC indoor unit | Climate → Air conditioning | Wall-mounted, cooling |
| Smart thermostat | Climate → Controls | Smart home, electronics |
| Electric cooktop | Appliances → Cooking | Kitchen, countertop-integrated |

Each object has one primary category and multiple searchable tags. A combined TV-and-console preset is a group containing two objects, not the only available television asset.

## 4. Building elements and planning tools

These are essential for designing a complete room or flat, but most should not appear as furniture cards.

| Group | Include | Delivery sequence |
| --- | --- | --- |
| Rooms & walls | Rectangular/polygon rooms, straight walls, connected corners, partitions, wall thickness, ceiling height, room names and areas | Next core drawing phase |
| Doors & openings | Hinged, double, sliding, pocket and folding doors; open doorways; arches; visible swing direction | Basic doors/openings first; variants later |
| Windows | Fixed, casement, sliding, sash and bay windows; sill/head heights | Basic windows first; variants later |
| Structure | Columns/pillars, beams, ceiling drops and structural openings | Existing columns first; remaining elements later |
| Stairs & levels | Straight, L/U-shaped and spiral stairs; landings, railings and floor levels | Later; requires a level/height model |
| Architectural details | Skirting/baseboards, cornices/crown moulding, wall panelling, built-in niches and fireplaces | Later |
| Plan tools | Dimensions, room labels, north arrow, drawing scale, reference visibility/lock, layers and guides | Measurements and calibrated references first |
| Service symbols | Outlets/sockets, switches, data points, plumbing points, vents and detectors | Later optional annotation layer; not engineered services design |

Do not present disconnected wall blocks as a completed multi-room authoring system. Room boundary detection, shared walls, opening attachment and undo/redo need to work together before promising whole-flat drawing.

## 5. Finish library

S1 exposes materials as a separate asset family, including wood, tiles, stone, metal, fabric, glass, concrete and plaster. Vela should follow that separation while using plain language.

| Material family | Examples | Typical targets |
| --- | --- | --- |
| Paint & plaster | Solid paint, plaster, limewash-style finishes | Walls, ceilings |
| Wood | Oak, walnut, timber boards, veneer | Floors, furniture, panels |
| Tile | Ceramic, porcelain, mosaic | Floors, walls, splashbacks |
| Stone | Marble, granite, limestone, engineered-stone appearances | Floors, walls, worktops |
| Concrete & brick | Concrete, exposed brick, masonry appearances | Floors, walls |
| Fabric & leather | Linen, woven upholstery, velvet, leather | Seating, cushions, curtains |
| Metal | Steel, chrome, brass, bronze, powder-coated finishes | Frames, fittings, lighting |
| Glass | Clear, frosted, tinted | Glazing, partitions, furniture |
| Wallpaper & panels | Patterned paper, timber slats, upholstered panels | Walls |
| Carpet & resilient floors | Carpet, vinyl, linoleum, rubber | Floors |

Start with colour and finish presets using the current renderer. Texture scale, grain orientation, UV mapping, roughness and realistic reflections require later rendering work; a colour swatch must not imply those features already exist.

## 6. Cross-category filters and search

### Visible filters

- **Room:** living, dining, bedroom, kitchen, bathroom, home office, entry/hall, nursery/kids, laundry/utility, balcony/patio, garage/storage. Add commercial room types when their assets arrive.
- **Size:** width, depth and height ranges, displayed in the project's chosen units.
- **Placement:** floor, wall, ceiling, countertop/surface, built-in.
- **Style:** modern, contemporary, traditional, Scandinavian, industrial, minimal and other curated tags. Style tags are subjective and optional.
- **Colour/material:** searchable finish families; distinguish the model's available finishes from a user's applied colour.
- **Availability:** all, favourites, recent and used in this project.

Put advanced filters in one expandable control. Show result counts, clear filters, breadcrumb navigation and a useful empty state. Search should work across categories and include aliases such as **sofa/couch, wardrobe/closet, tap/faucet, hob/cooktop, basin/sink, skirting/baseboard**. Avoid silently hiding matching objects because another category was selected.

Use generic functional names first. Regional or cultural objects can be optional searchable collections without defining the whole product's navigation. Make room labels editable. Keep currency separate from measurement units; no automatic exchange-rate conversion is implied.

### What an object card should show

Thumbnail, short name and dimensions. On selection or hover/focus, reveal placement type and available variants. Use the same 2D footprint and 3D proportions. Do not put supplier codes, long descriptions or technical fields on every card.

For keyboard users, search and categories must be reachable, results need accessible names, and Add must work without dragging. On touch devices, offer tap-to-place plus a clear Cancel action.

## 7. Professional project data

The following are proposed data requirements, not a claim that all researched sources expose these fields.

| Data group | Fields |
| --- | --- |
| Identity | Stable asset ID, version, display name, primary category, subcategory, aliases and tags |
| Dimensions | Width, depth, height, insertion point, orientation, mounting height and supported resizing rules |
| Placement | Floor/wall/ceiling/surface mode, host relationship, opening/swing envelope and optional clearance envelope |
| Appearance | Thumbnail, 2D symbol, 3D geometry, finish slots, available variants and model detail level |
| Specification | Optional manufacturer, product/model reference, supplier URL, notes and user-entered cost |
| Estimate | Quantity, unit, currency, unit cost and optional allowance; keep unspecified costs visibly unspecified |
| Asset provenance | Original source, creator, licence, attribution and permission to redistribute within a commercial application |

Separate reusable catalogue definitions from placed project instances. A placed chair has its own position, chosen finish and cost while referring to a stable chair asset. Store canonical dimensions in metres and convert only for display/input. Keep existing project IDs and item IDs stable during catalogue migration.

Product photos and downloadable 3D assets from another catalogue are not automatically available for bundling. Use original schematic assets first, then assets with suitable redistribution rights. A source link in this research document is not an asset licence.

Clearance overlays should communicate planning guidance. Manufacturer-specific installation requirements and local code compliance cannot be inferred from a generic model.

## 8. Map Vela's current catalogue into the new structure

The present `TYPES` catalogue has 17 entries, grouped only as furniture or structure. Reorganise without breaking old JSON layouts.

| Existing item ID(s) | Proposed destination | Migration note |
| --- | --- | --- |
| `sofa`, `lsofa`, `chair` | Furniture → Seating | Preserve IDs and transforms. |
| `dining`, `table` | Furniture → Tables & desks | Keep the current dining-set asset compatible; support individual table/chair pieces later. |
| `bed` | Furniture → Beds | Show dimensions alongside its current label. |
| `wardrobe` | Furniture → Storage | Preserve stored dimensions and finishes. |
| `tv` | Electronics, with a combined-set tag | Preserve existing TV & console geometry. Add separate TV and console assets later; do not silently split saved objects. |
| `rug` | Decor → Rugs | Not structural geometry. |
| `shrine` | Furniture → Optional collections | Keep existing layouts and searchable aliases; replace its structural classification. |
| `partition`, `wall`, `pillar` | Build | Distinguish movable partitions from connected structural walls as drawing improves. |
| `door`, `window` | Build → Openings | Preserve wall attachment and opening direction. |
| `ac`, `fan` | Climate | Remove them from the architecture-only browsing group. |

A category change should not change an item's geometry, wall index, room association, quantity or saved finish. Add migration/round-trip checks before changing the persisted schema.

## 9. Rollout sequence

### A — Catalogue structure, using existing objects

Create the Build/Furnish/Finish distinction, stable categories, search aliases and room tags. Move AC/fan into Climate, rug into Decor and television into Electronics. Add favourites/recent only when storage behaviour is defined. Show only populated categories; avoid clickable empty catalogues.

**Exit check:** every existing object is discoverable, adding still works, and old JSON projects retain exactly the same geometry and attachments.

### B — Essential room/flat coverage

After connected-wall and tracing fundamentals are in place, add representative objects in this order:

1. Kitchen: refrigerator, cooker/hob, sink, base cabinet, wall cabinet and worktop.
2. Bathroom: toilet, basin/vanity, shower and bathtub.
3. Furniture: desk, dining chair, bedside table, bookcase, dresser and single bed.
4. Lighting: ceiling light, pendant, wall light, table lamp and floor lamp.
5. Electronics/decor: separate television and monitor, mirror, curtains and indoor plant.

Treat this as an initial functional assortment, not a finished manufacturer catalogue. Verify measurements, placement and usable 2D footprints before creating numerous visual variants.

**Exit check:** a user can furnish a basic living room, bedroom, kitchen, bathroom and home office without substituting an unrelated object.

### C — Professional furnishing detail

Add size/style variants, modular kitchen placement, built-in appliances, material slots, clearer cost schedules, grouping and placement/clearance guidance. Improve rendering only after the same objects behave correctly in 2D and 3D.

### D — Small-commercial collections

Add office workstations and meeting rooms, reception counters and waiting seating, café/restaurant tables and banquettes, retail display/shelving and fitting-room fixtures. Keep them as room/collection filters on reusable object categories. Healthcare, industrial and specialised equipment are separate future scope.

## 10. Decisions for the next implementation

1. Adopt the category names in section 3 as the target structure, exposing only populated categories initially.
2. Keep Build, Finish and Plan interactions distinct from placing objects.
3. Preserve old saved layouts and all 17 existing item IDs during the first reorganisation.
4. Add room filters and familiar search aliases before creating a very large asset catalogue.
5. Build original dimensionally consistent essentials before manufacturer-specific models.
6. Validate with a furnished-room task, a flat task, keyboard navigation, mobile placement and JSON save/reopen checks.

**Next deliverable:** a small catalogue-navigation update using current objects. The full list is a roadmap, not a request to implement every category in one release.
