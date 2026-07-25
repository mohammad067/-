# Environment & Configuration Management

## 1. Environments

| Environment | Purpose | Branch/Trigger |
|---|---|---|
| `local` | Developer machines | — |
| `preview` | Per-PR preview deploys | Any open PR |
| `staging` | Pre-production validation, E2E runs | Merge to `main` |
| `production` | Live site | Manual/promoted release from `staging` |

## 2. Environment Variables

- All required environment variables are declared and validated at startup
  using a `zod` schema in `src/config/env.ts`, so misconfiguration fails
  fast at boot rather than producing runtime errors deep in the app.

```ts
// src/config/env.ts (illustrative)
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  PAYMENT_PROVIDER_API_KEY: z.string(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

- Variables prefixed `NEXT_PUBLIC_` are the only ones exposed to the
  browser; all secrets remain server-only.

## 3. `.env.example`

A checked-in `.env.example` documents every variable (name + description,
no real values) so new environments/developers can be configured without
guesswork. Actual `.env*` files are gitignored.

## 4. Config Categories

| Category | Examples |
|---|---|
| Core | `NODE_ENV`, `NEXT_PUBLIC_SITE_URL` |
| Database | `DATABASE_URL` |
| Auth | `SESSION_SECRET`, OAuth provider keys (if added) |
| Payments | `PAYMENT_PROVIDER_API_KEY`, webhook secret |
| Observability | `LOG_LEVEL`, error-tracking DSN |

## 5. Secrets Management

- Local: `.env.local` (gitignored).
- Preview/Staging/Production: managed through the hosting platform's secret
  store (e.g. Vercel Environment Variables), scoped per environment — no
  secret is shared verbatim between staging and production.
- Rotation policy for payment/auth secrets to be defined alongside the
  chosen auth/payment providers (tracked in `14-roadmap.md`).

## 6. Feature Flags (proposed)

- Simple boolean flags read from environment/config initially
  (`src/config/flags.ts`); a dedicated flag service can be introduced later
  if the flag surface grows (tracked in `14-roadmap.md`).
