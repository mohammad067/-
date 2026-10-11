# Folder Structure

## Repository layout

```text
talaye-shalizar/
├── apps/
│   ├── web/                    # Next.js storefront and BFF
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── server/
│   │   │   ├── stores/
│   │   │   ├── styles/
│   │   │   └── types/
│   │   ├── tests/
│   │   └── package.json
│   └── api/                    # Laravel API and Filament
│       ├── app/
│       │   ├── Actions/
│       │   ├── Contracts/
│       │   ├── Data/
│       │   ├── Enums/
│       │   ├── Exceptions/
│       │   ├── Http/
│       │   └── Models/
│       ├── database/
│       ├── docs/
│       ├── routes/
│       └── tests/
├── docs/                       # Cross-project documentation
├── .gitignore
└── README.md
```

## Boundaries

- Feature UI belongs in `apps/web/src/features`.
- Shared visual primitives belong in `apps/web/src/components`.
- Next.js server code may proxy or compose API responses but does not own
  commerce rules.
- Reusable Laravel business operations belong in `apps/api/app/Actions`.
- External providers are accessed through contracts under
  `apps/api/app/Contracts`.
- Controllers and Filament resources call the same actions.
- App-specific tests remain inside that application's `tests` directory.

## Naming

- Applications use short responsibility-based names: `web` and `api`.
- TypeScript folders use `kebab-case`; React components use `PascalCase`.
- Laravel classes follow framework conventions and domain actions use explicit
  verbs such as `ReserveInventoryForOrder` and `MarkAbandonedCarts`.
