# Talaye Shalizar

The repository is organized as two independently deployable applications:

```text
apps/
├── web/    Next.js storefront and BFF
└── api/    Laravel API, domain logic, scheduled tasks, and Filament panel
docs/       Cross-project architecture and product documentation
```

Laravel is the source of truth for products, pricing, inventory, carts,
orders, and payments. Next.js owns presentation and may proxy API requests to
Laravel through its BFF routes.

## Run locally

Storefront:

```bash
copy apps\web\.env.example apps\web\.env.local
npm ci
npm run dev
```

The root npm workspace owns the storefront lockfile and scripts. Run npm
commands from the repository root so local installs and Vercel use the same
dependency graph.

API:

```bash
cd apps/api
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan admin:create
php artisan serve
php artisan schedule:work
```

Default local addresses are `http://localhost:3000` for the storefront and
`http://localhost:8000` for the API.

Visitors may build a guest cart, but registration or login is required before
an order can be created. Next.js keeps the authentication token in an HTTP-only
cookie while Laravel validates the account, calculates prices, reserves stock,
and creates the user-owned order.

The storefront catalog, product details, prices, and stock are read from the
Laravel API. Customer accounts include profile editing, saved addresses,
default-address checkout, order history, password recovery, and phone
verification. Local development logs OTP codes; production SMS uses Kavenegar
when `SMS_DRIVER=kavenegar` and the API key/template variables are configured.

The Laravel operations panel runs at `http://localhost:8000/admin`. It manages
catalog, price, audited stock corrections, orders, fulfillment, shipments,
users, and abandoned carts. Payments and refunds remain read-only until a real
gateway is selected and connected.
