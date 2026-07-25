# Coding Standards

## 1. TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitAny: true` in
  `tsconfig.json`.
- No `any` in application code; use `unknown` + narrowing, or generics.
- Prefer `type` for unions/utility compositions, `interface` for object
  shapes/props that may be extended.
- Domain types and API contracts are defined once in `src/types` /
  `src/server/validation` (as `zod` schemas with inferred types via
  `z.infer`) and imported everywhere else — no duplicate ad hoc shapes.

## 2. Linting & Formatting

- **ESLint** (`eslint-config-next` + custom rules) enforced in CI; no
  warnings allowed to accumulate — warnings are treated as errors in CI.
- **Prettier** for formatting, run via a pre-commit hook (`lint-staged` +
  `husky`).
- **eslint-plugin-tailwindcss** for class-order and validity checks.
- Custom boundary rule (via `eslint-plugin-boundaries` or import restriction
  rules): `src/app/**/*` (Client Components) may not import from
  `src/server/**`. Only route handlers/server actions may import server-only
  code.

## 3. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase, `use` prefix | `useCart.ts` |
| Zustand stores | camelCase, `use...Store` | `useCartUiStore` |
| Services | kebab/dot | `order.service.ts` |
| Types/interfaces | PascalCase | `Product`, `OrderStatus` |
| Constants | SCREAMING_SNAKE_CASE for true constants | `MAX_CART_ITEMS` |
| Folders | kebab-case | `product-catalog/` |

## 4. Imports

- Absolute imports via `tsconfig` path alias `@/*` mapped to `src/*` —
  no deep relative `../../../` chains.
- Import order enforced by ESLint: external packages → internal aliases →
  relative imports, each group alphabetized.

## 5. Comments & Documentation

- Public functions in `src/server/services` and `src/lib` carry a short
  JSDoc block describing purpose, params, and return value.
- Avoid comments that restate the code; prefer comments that explain *why*
  (business rule, workaround, edge case).

## 6. Git Conventions

- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`,
  `docs:`) to drive changelog generation and enforce intent-revealing
  history.
- One logical change per PR; PR description references the relevant
  doc/section this change implements or deviates from.
- No direct commits to `main`; all changes via PR with required review and
  passing CI (see `13-deployment.md`).

## 7. Error Handling

- Domain services return typed `Result<T, DomainError>`-style values (or
  throw a small set of well-known domain error classes) rather than throwing
  arbitrary errors — route handlers map known domain errors to HTTP status
  codes explicitly.
- Never swallow errors silently; log unexpected errors with enough context
  to trace the request.

## 8. Performance

- Avoid unnecessary Client Components; keep bundles lean by pushing
  interactivity to leaf components only.
- Memoize expensive computations (`useMemo`) only when profiling shows a
  need — avoid premature optimization that harms readability.
- Images always go through `next/image`.
