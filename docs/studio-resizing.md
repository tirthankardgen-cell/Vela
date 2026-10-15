# Resizing and object options

In the 2D plan, select an object to show its resize handles. Drag a corner to change width and depth together, or an edge midpoint to change one dimension. The opposite edge stays fixed, including on rotated objects. Snap applies to dimensions when enabled; use Properties for exact measurements. Escape or a cancelled pointer gesture restores the size before the drag. One completed drag is one undo step.

Doors and windows have two end handles. They remain on their existing wall and cannot grow beyond its ends. Height and sill elevation remain in Properties. Furniture dimensions are constrained to 5 cm–10 m during dragging. Door swings and furniture remain schematic representations.

The library groups its 52 options into icon tiles. Opening a family shows only its options; the back arrow returns to the previous page with a reversed slide transition. Reduced-motion preferences disable the animation. Electronics contains TV & media and Climate control; Climate control contains Air conditioning, Fans and Heaters. Search works across categories, and the room filter applies to individual options (including office desks and dining tables). Variants preserve their underlying object kind for compatibility with existing layouts; the variant identifier survives duplication, save/import and reload. Double and sliding doors, round tables and round rugs have corresponding 2D and 3D geometry; other variants differ in dimensions and proportions.

Validation: `node --test tests/resize.test.mjs` and `VELA_BASE_URL=<local preview URL> python3 tests/studio_resize_smoke.py`, plus the existing planner and studio regression suites.

Outer walls can be selected in the 2D plan and coloured independently. Their per-edge colours are stored with the room, validated on import, and used in the plan and 3D model. Internal walls use their individual item colour. Resetting an outer wall restores the home's default wall colour. Undo/redo and JSON exports preserve these changes.

The setup dimensions describe the whole house or flat; internal walls divide the footprint into rooms. Setup shows feet/inches, centimetres and metres together. Studio dimensions include imperial and metric equivalents. The properties panel keeps name, footprint size, colour and common actions visible; height/position and optional cost/supplier fields are expandable.

The workspace uses one top navigation bar, floating, collapsible side panels and a single canvas toolbar. Properties opens on selection, after any active drag finishes. The plan fits the space between visible desktop panels; on mobile the panels can be dismissed to work on the full canvas. Viewport resizing preserves model dimensions without adding dimension labels to the plan.

Whole-home dimensions measure between wall centre lines, not clear internal or external wall faces. Dimensions are stored in metres; centimetre inputs retain decimals and feet/inches labels round to two decimal places, marked approximate. Switching setup units preserves precision instead of rounding to whole inches.

Select a wall or object to read its measurements in Properties. The visible Above floor field sets vertical placement in centimetres; Raise/Lower moves it by 5 cm. Changes affect the 3D model, support undo/redo and persist with the layout. Panels float above the canvas; Collapse hides them and the persistent Library/Properties buttons reopen them.
