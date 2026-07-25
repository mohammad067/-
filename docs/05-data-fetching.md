# Data Fetching (TanStack Query)

## 1. Principle

All data owned by the server (products, cart contents, orders, inventory,
user profile) is fetched and cached exclusively through **TanStack Query** on
the client, or directly via server-side data access in **React Server
Components** where no client interactivity is needed.

## 2. When to Use RSC vs. TanStack Query

| Scenario | Approach |
|---|---|
| Initial page render of largely static/SEO-relevant data (product listing, PDP) | Fetch directly in a Server Component |
| Data that changes based on client interaction (filters, pagination, add-to-cart, live cart) | TanStack Query in a Client Component |
| Mutations (add to cart, place order, update inventory) | TanStack Query `useMutation`, or Server Actions for simple form-style mutations |

RSC-fetched data can be passed as `initialData` to a Query hook to avoid a
duplicate client-side fetch on hydration.

## 3. Query Key Conventions

Query keys are structured, hierarchical arrays, defined centrally per
feature to avoid typos and enable precise invalidation:

```ts
// src/features/product-catalog/queryKeys.ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
}
```

## 4. Query Hooks

Each feature exposes typed hooks wrapping `useQuery`/`useMutation`, so
components never call `useQuery` directly with inline keys/fetchers:

```ts
// src/features/product-catalog/hooks/useProducts.ts
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 60_000,
  })
}
```

## 5. Mutations & Cache Invalidation

- Mutations invalidate the narrowest relevant query key set (e.g. adding an
  item invalidates `cartKeys.all`, not the entire cache).
- Optimistic updates are used for high-frequency, low-risk actions (add to
  cart, wishlist toggle) with rollback on error via `onError` context.

```ts
export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addToCartRequest,
    onMutate: async (item) => { /* optimistic update */ },
    onError: (_err, _item, context) => { /* rollback */ },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  })
}
```

## 6. Global Configuration

A single `QueryClient` is instantiated once (`src/lib/query-client.ts`) with
project-wide defaults:

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

Feature hooks may override defaults per-query when justified (e.g. real-time
inventory counts use a shorter `staleTime`).

## 7. Error Handling

- API errors are normalized to a shared `ApiError` shape (`src/types/errors.ts`)
  by a shared fetch wrapper (`src/lib/api-client.ts`).
- Components read `isError`/`error` from the query result and render through
  a shared `<ErrorState />` component rather than ad hoc error UI.

## 8. Pagination & Infinite Lists

- Product listings use `useInfiniteQuery` with cursor-based pagination
  (server contract defined in `09-api-design.md`).

## 9. Devtools

- `@tanstack/react-query-devtools` is enabled in development builds only.
