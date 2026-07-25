# API Design (Route Handlers)

## 1. Conventions

- REST-style resource endpoints under `src/app/api/**/route.ts`.
- JSON request/response bodies; `Content-Type: application/json`.
- All request bodies and query params validated with `zod` schemas shared
  from `src/server/validation/`.
- Responses follow a consistent envelope:

```ts
// Success
{ "data": T }

// Error
{ "error": { "code": string, "message": string, "details"?: unknown } }
```

## 2. Resource Endpoints (v1)

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | List products (filters, pagination via query params) | Public |
| GET | `/api/products/:slug` | Get single product | Public |
| GET | `/api/cart` | Get current cart (session/user-scoped) | Public (guest) / Customer |
| POST | `/api/cart/items` | Add item to cart | Public (guest) / Customer |
| PATCH | `/api/cart/items/:id` | Update item quantity | Public (guest) / Customer |
| DELETE | `/api/cart/items/:id` | Remove item | Public (guest) / Customer |
| POST | `/api/orders` | Place an order (checkout) | Customer |
| GET | `/api/orders` | List current user's orders | Customer |
| GET | `/api/orders/:id` | Get order detail | Customer (own order) / Admin |
| PATCH | `/api/admin/inventory/:id` | Update stock levels | Admin |
| PATCH | `/api/admin/orders/:id` | Update order status | Admin |

## 3. Pagination

Cursor-based pagination for list endpoints:

```
GET /api/products?cursor=<opaque_cursor>&limit=20
```

Response includes `nextCursor: string | null`.

## 4. Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request failed schema validation |
| `UNAUTHENTICATED` | 401 | Missing/invalid session |
| `FORBIDDEN` | 403 | Authenticated but lacks permission |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | e.g. insufficient stock at checkout |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## 5. Route Handler Pattern

Route handlers stay thin, delegating to domain services:

```ts
// src/app/api/cart/items/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const parsed = addCartItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    )
  }

  const session = await getSession(req)
  const result = await cartService.addItem(session, parsed.data)

  return NextResponse.json({ data: result })
}
```

## 6. Idempotency

- `POST /api/orders` accepts an `Idempotency-Key` header so retried checkout
  requests (e.g. due to network flakiness) do not create duplicate orders.

## 7. Versioning

- v1 is unversioned in the URL (`/api/...`). If breaking changes are needed
  in the future, endpoints will be namespaced (`/api/v2/...`) rather than
  breaking existing consumers.
