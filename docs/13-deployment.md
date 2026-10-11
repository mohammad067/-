# Deployment & CI/CD

## 1. Hosting

- `apps/web` can deploy to Vercel. `apps/api` requires a PHP 8.4 runtime,
  relational database, queue worker, persistent scheduler, and shared cache.
  The Laravel hosting target remains a deployment decision.

## 2. CI Pipeline (per Pull Request)

1. Install Node and Composer dependencies with caches.
2. Build and lint `apps/web`.
3. Run Pint, PHPUnit, and Composer validation in `apps/api`.
4. Build deployable artifacts for both applications.
5. Deploy PR preview environments.

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

- Laravel migrations run through `php artisan migrate --force` as an explicit
  deployment step before the new API version receives traffic.
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
