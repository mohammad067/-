# Shared Zustand Stores (`src/stores/`)

This directory houses global, application-wide Zustand stores.

## Rules
- Avoid placing feature-scoped UI variables here (prefer local state or Feature-scoped stores inside `src/features/`).
- Only store truly universal cross-cutting states (e.g., active language, active theme, global notification queue).
