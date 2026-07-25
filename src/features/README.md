# Feature Modules

This directory is organized into cohesive, feature-scoped modules. Each module owns its UI components, hooks, stores, and schema models, promoting high cohesion and minimal coupling.

## Subdirectories
- `product-catalog/`: Product listings, filtering panel, sorting logic, and detail cards.
- `cart/`: Client-side cart tracking, cart drawer overlays, and quantity updates.
- `checkout/`: Multi-step checkout wizard, billing forms, and shipping validations.
- `admin-inventory/`: Internal back-office administration grids, stock adjustment dials, and status indicators.

## Rules
- Components in one feature MUST NOT import directly from another feature.
- Cross-feature interactions are handled by shared layouts or page controllers.
