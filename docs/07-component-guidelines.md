# Component Guidelines

## 1. Server vs. Client Components

- Default to **Server Components**. Add `"use client"` only when a component
  needs:
  - React state/effects (`useState`, `useEffect`)
  - Browser-only APIs
  - Event handlers (`onClick`, `onChange`, etc.)
  - A hook that requires the client (TanStack Query hooks, Zustand hooks,
    Framer Motion components)
- Keep the client boundary as low in the tree as possible: a page can be a
  Server Component that renders a small Client Component island for the
  interactive part (e.g. an "Add to Cart" button), rather than converting an
  entire page to a Client Component.

## 2. Component Categories

| Category | Location | Description |
|---|---|---|
| UI primitives | `src/components/ui` | Shadcn-generated, unopinionated about business logic |
| Layout components | `src/components/layout` | Header, Footer, Nav — app shell |
| Common composites | `src/components/common` | Reusable across features but product-aware (e.g. `ProductCard`, `PriceTag`) |
| Feature components | `src/features/<feature>/components` | Specific to one feature, may use that feature's store/hooks |

## 3. Component Design Rules

- **Single responsibility**: a component renders UI for one concern; data
  fetching/mutation logic lives in a hook it calls, not inline `fetch` calls.
- **Props over global state**: prefer explicit props; reach for a Zustand
  store only when state must be shared across otherwise-unconnected
  components.
- **Composition over configuration**: prefer children/slots
  (`<Card><CardHeader/><CardContent/></Card>`) over a single component with
  many boolean props.
- All components are typed with an explicit `Props` interface — no implicit
  `any`, no untyped destructuring of `props`.
- Components that render lists must have stable, meaningful `key`s (never
  array index for reorderable lists like the cart).

## 4. Framer Motion Conventions

- Motion variants are defined as named constants outside the render function
  (or in a shared `src/lib/motion.ts`) rather than inline objects recreated
  every render.
- Respect reduced-motion preferences: wrap non-essential animations with a
  check against `useReducedMotion()`.
- Use `AnimatePresence` for mount/unmount transitions (e.g. cart drawer,
  toast list, modal).
- Avoid animating layout-affecting properties (width/height) when a
  transform-based alternative exists, for performance.

Example pattern:
```tsx
const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
}

<AnimatePresence>
  {isDrawerOpen && (
    <motion.aside
      variants={drawerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      ...
    </motion.aside>
  )}
</AnimatePresence>
```

## 5. Accessibility

- All interactive components built on Shadcn/Radix primitives inherit
  keyboard navigation and ARIA behavior — do not bypass them by rebuilding
  with plain `div`s.
- Images require meaningful `alt` text; decorative images use `alt=""`.
- Forms associate every input with a `<label>` (via Shadcn `Form` +
  `react-hook-form` integration).

## 6. File/Export Conventions

- One component per file; file name matches the exported component
  (`ProductCard.tsx` exports `ProductCard`).
- Named exports preferred over default exports, for consistent refactor
  tooling and import auto-completion, except for Next.js special files
  (`page.tsx`, `layout.tsx`) which require default exports.

## 7. Storybook (proposed)

- Shared and common components are documented with Storybook stories once
  implementation begins, to support visual review and design QA in
  isolation from full pages. To be confirmed during implementation kickoff.
