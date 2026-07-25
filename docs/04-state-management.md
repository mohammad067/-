# State Management (Zustand)

## 1. Scope of Zustand

Zustand is used **only** for client-side UI state that does not originate
from the server. Examples:

- Cart drawer open/closed.
- Product filter/sort selections before they're applied to a query.
- Multi-step checkout wizard's current step.
- Admin table row selection, column visibility.
- Toast/notification queue (if not handled by a dedicated library).

Zustand is **not** used for:
- Product data, cart contents, order history, or anything persisted on the
  server — that is TanStack Query's responsibility (see
  `05-data-fetching.md`).
- Form field values — use `react-hook-form` for form state.

## 2. Store Placement

- Default: colocate a store with its feature (`src/features/<feature>/store.ts`).
- Promote to `src/stores/` only if genuinely shared across ≥2 unrelated
  features (rare — prefer passing state down or lifting via composition
  first).

## 3. Store Design Pattern

```ts
// src/features/cart/store.ts
import { create } from 'zustand'

interface CartUiState {
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export const useCartUiStore = create<CartUiState>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
}))
```

Rules:
- One store per concern; avoid a single monolithic app-wide store.
- Actions are defined inside the store, not dispatched externally with
  ad-hoc `setState` calls from components.
- Selectors should be used when reading from a store in a component to avoid
  unnecessary re-renders:
  ```ts
  const isDrawerOpen = useCartUiStore((s) => s.isDrawerOpen)
  ```

## 4. Persistence

- Stores that must survive a page refresh (e.g. guest cart UI preferences)
  use Zustand's `persist` middleware with `localStorage`.
- Persisted stores must have a versioned schema and a migration function to
  handle shape changes.

## 5. Server State Never Lives Here

If a component needs server data alongside UI state (e.g. cart drawer needs
both `isDrawerOpen` from Zustand and cart line items from TanStack Query),
the component composes both hooks — the two systems are not merged into one
store.

## 6. Testing

- Stores are plain functions and are unit-tested directly (create a store
  instance, dispatch actions, assert state) without rendering React.
