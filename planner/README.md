# Vela planner source

See the root [README](../README.md) for setup, features, controls, validation, and release limitations.

The application bundles Three.js locally. Existing Roomnote geometry exports remain supported through the `roomnote-layout` version 1 JSON format; Vela adds project metadata, floor/wall colours, and per-item cost and supplier fields. `window.Vela` exposes a read-only inspection bridge; `window.Roomnote` remains an alias for compatibility with the inherited browser tests.
