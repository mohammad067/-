# Deployment & CI/CD

## 1. Hosting

- Target platform: Vercel (native Next.js support, preview deployments per
  PR, edge network). Alternative (self-hosted Node/Docker) documented as a
  fallback if platform requirements change — to be confirmed before
  implementation.

## 2. CI Pipeline (per Pull Request)

1. Install dependencies (cached).
2. Type-check (`tsc --noEmit`).
3. Lint (`eslint`).
4. Unit + integration tests (`vitest`).
5. Build (`next build`) to catch build-time errors early.
6. Deploy PR preview environment.

## 3. CD Pipeline (merge to `main`)

1. All PR-stage checks re-run against `main`.
2. Deploy to `staging`.
3. Run Playwright E2E suite against `staging`.
4. On success, a manual promotion step deploys the same build artifact to
   `production` (no rebuild between staging and production, to guarantee
   what was tested is what ships).

## 4. Rollback

- Hosting platform's atomic deployment history is used for instant rollback
  to the previous production build if a regression is detected post-release.

## 5. Database Migrations

- Migrations run as an explicit CI/CD step before the new application
  version receives traffic, using the chosen ORM's migration tooling (final
  ORM choice pending — see `02-tech-stack.md`).
- Migrations must be backward-compatible with the previous app version for
  the duration of a rolling deploy (expand/contract pattern for breaking
  schema changes).

## 6. Observability in Production

- Structured application logs shipped to a centralized log platform
  (provider TBD).
- Error tracking (e.g. Sentry) captures unhandled exceptions client- and
  server-side, tagged with release version.
- Uptime/health check endpoint (`/api/health`) used by the hosting platform
  and external monitoring.

## 7. Release Cadence

- Continuous deployment to `staging` on every merge to `main`.
- Production promotions batched or on-demand depending on team preference,
  decided during implementation kickoff.
