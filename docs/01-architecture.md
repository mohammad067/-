# Architecture

## 1. Architectural Style

Rice Shop follows a **layered, feature-oriented architecture** on top of the
Next.js App Router. The system is a single deployable Next.js application
that serves both the storefront UI and its backend API routes (BFF pattern —
Backend for Frontend), rather than a separate backend service in v1.

```
┌─────────────────────────────────────────────────────────┐
│                         Client                            │
│  React Server/Client Components, Zustand (UI state),      │
│  TanStack Query (server-state cache), Framer Motion        │
└───────────────────────────┬─────────────────────────────┘
                            │ fetch / RSC data access
┌───────────────────────────▼─────────────────────────────┐
│                Next.js App Router (BFF layer)              │
│  Route Handlers (/app/api/**), Server Actions,             │
│  Request validation, Auth middleware                       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                     Domain / Service Layer                 │
│  Business logic, use-cases (e.g. checkout, inventory)       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Data Access Layer                       │
│  Repository modules, ORM/query client, external providers   │
│  (payments, email, storage)                                 │
└─────────────────────────────────────────────────────────┘
```

## 2. Layer Responsibilities

### 2.1 Presentation Layer (`app/`, `components/`)
- React Server Components (RSC) by default; Client Components only where
  interactivity, state, or browser APIs are required (`"use client"`).
- No direct data-source access (database, third-party SDKs) from components.
  Components consume data through query hooks or props passed from server
  components.

### 2.2 BFF / Route Layer (`app/api/**`, Server Actions)
- Owns HTTP concerns: request parsing, validation (via `zod`), authentication,
  rate limiting, and response shaping.
- Delegates all business logic to the Domain layer. Route handlers should be
  thin.

### 2.3 Domain / Service Layer (`src/server/services/**`)
- Contains business rules independent of HTTP or UI concerns (e.g. pricing
  rules, inventory checks, order state transitions).
- Pure, framework-agnostic TypeScript. Fully unit-testable without mocking
  Next.js.

### 2.4 Data Access Layer (`src/server/repositories/**`)
- Wraps the ORM/database client and any third-party integrations (payment
  gateway, email provider, file storage).
- Domain services depend on repository interfaces, not concrete clients,
  to keep persistence swappable and testable.

## 3. Client-Side Architecture

- **Server state** (data owned by the backend: products, orders, cart
  contents persisted server-side) is managed exclusively through **TanStack
  Query**. Components never hold server data in Zustand or `useState` beyond
  transient optimistic-update needs.
- **UI/local state** (modals open/closed, selected filters, wizard step,
  ephemeral cart drawer state) is managed through **Zustand** stores, scoped
  per feature.
- **Animation** (page transitions, list reordering, micro-interactions) is
  handled by **Framer Motion**, kept at the presentation layer only — it must
  never carry business logic.

## 4. Cross-Cutting Concerns

| Concern | Approach |
|---|---|
| Authentication | Session-based auth via Next.js middleware + secure cookies |
| Authorization | Role checks (`customer`, `admin`) enforced in route handlers and domain services |
| Validation | `zod` schemas shared between client forms and API route handlers |
| Error Handling | Typed `Result`/error objects from services; route handlers map to HTTP status codes; UI renders via error boundaries |
| Logging/Observability | Structured logging in route handlers and services; correlation ID per request |
| Configuration | Centralized in `src/config`, reading from validated environment variables (see `12-environment-config.md`) |

## 5. Key Architectural Decisions (ADR Summary)

| Decision | Rationale |
|---|---|
| App Router over Pages Router | First-class RSC support, layouts, streaming |
| BFF-in-Next.js instead of separate backend | Reduces v1 operational overhead; can be extracted later since domain logic is framework-agnostic |
| TanStack Query for all server state | Avoids duplicating server state in global stores; built-in caching, retries, invalidation |
| Zustand for UI state only | Lightweight, avoids Redux boilerplate, clear separation from server state |
| Shadcn UI over a closed component library | Copy-in components are fully owned and customizable, composes cleanly with Tailwind |

## 6. Future Extraction Path

Because business logic lives in the framework-agnostic Domain layer, it can
be extracted into a standalone service (e.g. if the storefront needs to serve
multiple frontends) without rewriting business rules — only the route/BFF
layer would need replacing.
