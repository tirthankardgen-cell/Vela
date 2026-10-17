# Resizing and object options

In the 2D plan, select an object to show its resize handles. Drag a corner to change width and depth together, or an edge midpoint to change one dimension. The opposite edge stays fixed, including on rotated objects. Snap applies to dimensions when enabled; use Properties for exact measurements. Escape or a cancelled pointer gesture restores the size before the drag. One completed drag is one undo step.

Doors and windows have two end handles. They remain on their existing wall and cannot grow beyond its ends. Height and sill elevation remain in Properties. Furniture dimensions are constrained to 5 cm–10 m during dragging. Door swings and furniture remain schematic representations.

The library groups its 52 options into icon tiles. Opening a family shows only its options; the back arrow returns to the previous page with a reversed slide transition. Reduced-motion preferences disable the animation. Electronics contains TV & media and Climate control; Climate control contains Air conditioning, Fans and Heaters. Search works across categories, and the room filter applies to individual options (including office desks and dining tables). Variants preserve their underlying object kind for compatibility with existing layouts; the variant identifier survives duplication, save/import and reload. Double and sliding doors, round tables and round rugs have corresponding 2D and 3D geometry; other variants differ in dimensions and proportions.

Validation: `node --test tests/resize.test.mjs` and `VELA_BASE_URL=<local preview URL> python3 tests/studio_resize_smoke.py`, plus the existing planner and studio regression suites.

Outer walls can be selected in the 2D plan and coloured independently. Their per-edge colours are stored with the room, validated on import, and used in the plan and 3D model. Internal walls use their individual item colour. Resetting an outer wall restores the home's default wall colour. Undo/redo and JSON exports preserve these changes.

The setup dimensions describe the room being created; internal walls can divide the layout further. Setup shows feet/inches, centimetres and metres together. Studio dimensions include imperial and metric equivalents. The properties panel keeps name, footprint size, colour and common actions visible; height/position and optional cost/supplier fields are expandable.

The workspace uses one top navigation bar, floating, collapsible side panels and a single canvas toolbar. Properties opens on selection, after any active drag finishes. The plan fits the space between visible desktop panels; on mobile the panels can be dismissed to work on the full canvas. Viewport resizing preserves model dimensions without adding dimension labels to the plan.

Whole-home dimensions measure between wall centre lines, not clear internal or external wall faces. Dimensions are stored in metres; centimetre inputs retain decimals and feet/inches labels round to two decimal places, marked approximate. Switching setup units preserves precision instead of rounding to whole inches.

Select a wall or object to read its measurements in Properties. The visible Above floor field sets vertical placement in centimetres; Raise/Lower moves it by 5 cm. Changes affect the 3D model, support undo/redo and persist with the layout. Panels float above the canvas; Collapse hides them and the persistent Library/Properties buttons reopen them.

## Rooms and two-sided wall finishes

The library’s Add room dialog creates named rectangular rooms inside the current layout outline. Specify centre-line width/depth and offsets from the outline’s top-left bounds. Matching full walls are reused, so adjacent rooms paint opposite faces of the same wall. Crossing walls, partial overlaps, duplicate rooms and rooms outside the outline are rejected with a message. This first version does not extend the outer footprint automatically; enlarge the outline using Room size & walls when needed. Add doors and windows from the library.

Outer walls expose Inside and Outside colours. Internal walls expose Side A and Side B, marked on selection in the plan. Face A is the positive local wall-depth side; for clockwise outer edges it faces inward. The two long faces receive separate 3D materials, including wall sections around openings. End caps and tops retain the base wall colour. Older files with one wall colour still display that colour on both faces.

Rooms & wall colours paints either the inward wall faces of a named room or both faces of every wall in the layout. Named rooms retain references to their walls when these are moved. Individual wall edits can override room paint. All changes are undoable and persist in JSON export/import and browser saves.

## Navigation, room floors and moving rooms

Scroll over the 2D canvas to zoom around the pointer. Hold the right mouse button and drag to pan; Escape cancels an active pan. These gestures only change the view, not the saved geometry or undo history. Fit resets pan/zoom and includes named rooms moved beyond the original outline.

Select a room’s floor or name to view its floor colour in Properties. The library’s Rooms & wall colours section also offers a floor colour for each named room; the whole-layout option applies a floor colour across the layout. Floors appear in 2D and 3D and are retained in saved files. Existing files inherit the layout floor colour until a room colour is set.

Drag a named room’s floor/name to translate all of its walls and floor. Attached doors/windows travel with their wall. A shared wall is copied for the moving room on the first movement; the neighbouring room keeps the original wall and openings. This separation and translation are one undo step; Escape restores everything. Furniture is independent of named room groups. Named rooms may move beyond the initial outline. Dragging the original layout floor moves the outer outline and its contents together within the supported coordinate range. The room floor requires a closed wall loop; reconnect individually edited walls if the floor is no longer visible.

## Library presentation

The floating library starts with a room selector and Add room action, followed by search, category tabs and an always-visible room-type filter. Category families use compact line-icon buttons. The overview includes quick-add sofa cards; opened families keep search and filtering visible, with a back row, category icon, item count and supported type filters (sofas, beds, tables and doors). The All tab browses every catalogue category. Reset library filters clears search, room/type filters and the nested path.

Item cards use coloured SVG previews from the same plan geometry as placed objects, rather than stock product photographs. Cards support click-to-add and drag-to-place. Room finishes and project/setup tools remain available below the collection. Reduced-motion settings and keyboard navigation are preserved.
