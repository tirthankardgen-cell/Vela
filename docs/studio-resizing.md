# Resizing and object options

In the 2D plan, select an object to show its resize handles. Drag a corner to change width and depth together, or an edge midpoint to change one dimension. The opposite edge stays fixed, including on rotated objects. Snap applies to dimensions when enabled; use Properties for exact measurements. Escape or a cancelled pointer gesture restores the size before the drag. One completed drag is one undo step.

Doors and windows have two end handles. They remain on their existing wall and cannot grow beyond its ends. Height and sill elevation remain in Properties. Furniture dimensions are constrained to 5 cm–10 m during dragging. Door swings and furniture remain schematic representations.

The library groups its 49 options into collapsible object families. Search works across categories, and the room filter applies to individual options (including office desks and dining tables). Variants preserve their underlying object kind for compatibility with existing layouts; the variant identifier survives duplication, save/import and reload. Double and sliding doors, round tables and round rugs have corresponding 2D and 3D geometry; other variants differ in dimensions and proportions.

Validation: `node --test tests/resize.test.mjs` and `VELA_BASE_URL=<local preview URL> python3 tests/studio_resize_smoke.py`, plus the existing planner and studio regression suites.
