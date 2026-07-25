# Testing Strategy

## 1. Test Pyramid

```
        ▲
        │   E2E (Playwright)          — few, critical user journeys
        │  Integration (RTL + MSW)    — feature-level flows
        │ Unit (Vitest)               — services, stores, utils, hooks
        ▼
```

## 2. Unit Tests (Vitest)

- **Domain services** (`src/server/services`): pure business logic tested
  with no framework dependencies — pricing, inventory checks, order state
  transitions.
- **Zustand stores**: instantiate store, dispatch actions, assert resulting
  state, without rendering React.
- **Utilities** (`src/lib`): pure functions (formatters, validators).
- Target: business-critical logic (pricing, checkout eligibility, inventory
  decrement) at or near 100% coverage; overall repo target ≥ 80%.

## 3. Component/Integration Tests (React Testing Library + MSW)

- Render feature components with a real `QueryClientProvider` and mock
  network responses via **MSW** (Mock Service Worker) rather than mocking
  `fetch` or query hooks directly — this exercises the real TanStack Query
  caching/loading/error behavior.
- Assert on user-visible behavior (rendered text, roles, accessible names),
  not implementation details (no snapshot-testing internal state).
- Example scope: "adding a product to cart shows updated cart count and
  optimistic UI, then reconciles with server response."

## 4. End-to-End Tests (Playwright)

- Cover critical, revenue-impacting journeys only:
  1. Browse → add to cart → checkout → order confirmation (guest and
     authenticated).
  2. Customer views order history.
  3. Admin updates inventory and it reflects on the storefront.
- Run against a seeded test database and a dedicated preview/staging
  environment in CI (see `13-deployment.md`).
- Visual regressions for key pages may be added via Playwright's screenshot
  comparison once the UI stabilizes.

## 5. Test Data

- A seed script (`src/server/seed`) generates deterministic fixture data
  (products, a test admin, a test customer) for local development, CI, and
  E2E runs.
- MSW handlers for integration tests live alongside each feature
  (`src/features/<feature>/__mocks__/handlers.ts`) and are composed into a
  root MSW server for test setup.

## 6. CI Gates

- Every pull request runs: type-check, lint, unit tests, integration tests.
- E2E suite runs on merge to `main` and before production deploys (see
  `13-deployment.md`).
- A PR cannot merge with failing tests or a coverage regression below the
  configured threshold.

## 7. Accessibility Testing

- `jest-axe`/`vitest-axe` (or equivalent) runs automated a11y checks against
  key components and pages in the integration test suite.
- Manual keyboard-navigation and screen-reader spot checks are part of the
  Definition of Done for new interactive components.
