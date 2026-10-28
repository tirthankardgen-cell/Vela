# Furnished flat templates

Vela provides two layouts for each flat size. They replace the inherited sample
flat, living-room sketch and bedroom sketch.

| Flat | Layout | Overall width × depth | Plan area | Bathrooms |
| --- | --- | --- | --- | --- |
| 1BHK | City Compact | 7.40 × 7.80 m | 57.72 m² | 1 |
| 1BHK | Balcony Retreat | 8.40 × 8.80 m | 73.92 m² | 1 |
| 2BHK | Family Compact | 8.60 × 10.42 m | 89.61 m² | 1 |
| 2BHK | Family Balcony | 9.80 × 12.32 m | 120.74 m² | 2 |
| 3BHK | Connected Living | 11.20 × 12.32 m | 137.98 m² | 2 |
| 3BHK | Master Suite | 13.60 × 12.84 m | 174.62 m² | 2 |
| 4BHK | Family Residence | 13.20 × 12.84 m | 169.49 m² | 3 |
| 4BHK | Grand Residence | 14.40 × 13.72 m | 197.57 m² | 3 |

Choose **A furnished flat** on the setup page. The studio's **Flat templates**
button opens the same collection with a plan preview and room schedule.
Previewing leaves the current project intact; applying replaces its geometry,
finishes and furnishings, preserves its project details, and can be undone.
The compact 1BHK and 2BHK have no balcony; the other six layouts include one.

All dimensions are stored in metres. Overall sizes and plan areas follow wall
centre lines. Room labels and schedules subtract half the thickness of each
bounding wall to report clear internal sizes. These are not saleable-area
calculations.

External walls are 200 mm, internal partitions are 120 mm, and ceilings are
2.85 m. Main entrances are 1,000 mm wide, bedroom doors 900 mm, bathroom doors
750 mm, and circulation halls retain at least 1,200 mm clear width. Kitchens
and balconies use sliding doors; wide open passages connect shared living
and dining rooms.

Each bedroom has a 1,600 × 2,000 mm queen bed, bedside tables and wardrobe
or dresser. Bed placement leaves at least 900 mm beyond its foot. Dining
arrangements include the actual chair footprints and at least 450 mm behind
the chairs for pulling them out. The compact three-bedroom dining room seats
four; the larger dedicated dining rooms seat six.

Kitchen cabinets, sinks, cooktops, refrigerators, washing machines,
washbasins, WCs and shower enclosures are editable catalogue objects.
Raised sinks and cooktops sit on their cabinets. Windows attach to exterior
walls, with kitchen windows clear of the cooktop. Bathroom windows have high
sills, and balcony perimeter walls use a 1.1 m railing height.

[planner/templates.js](../planner/templates.js) defines and assembles the layouts,
splitting walls at room junctions and reusing each shared segment. Named rooms
reference their ordered wall segments, so their floors and dimensions follow
the existing room editor. [planner/plan-shapes.js](../planner/plan-shapes.js)
supplies the same plan symbols to the canvas, catalogue and template previews.

The saved format remains roomnote-layout, version 1. Imported older designs
remain supported; removing the preset choices does not delete saved projects.
Named room types and label positions, fixture dimensions, wall attachments
and door swings survive JSON export/import and local storage.

Run npm run test:templates for geometry checks. With the website running,
python tests/templates_smoke.py exercises the complete collection through
setup, preview, replacement, undo/redo, 3D, exports and persistence.
CHROMIUM_PATH selects a local Chromium-compatible browser.

These are editable residential planning templates. Confirm site measurements,
structural details and local building requirements before construction.
