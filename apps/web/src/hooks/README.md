# Shared React Hooks (`src/hooks/`)

This directory contains cross-cutting, reusable custom React hooks.

## Rules
- Hooks stored here must be generic and applicable to multiple separate features (e.g. `useMediaQuery`, `useIntersectionObserver`, `useScrollDirection`).
- Feature-scoped hooks (e.g., `useProducts`, `useCart`) must reside within their respective folders inside `src/features/`.
