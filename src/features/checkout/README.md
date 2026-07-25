# Checkout Feature (`src/features/checkout/`)

This feature drives the secure, luxurious multi-step order placement wizard.

## Responsibility
- Manage the wizard navigation step indicators (e.g. shipping address -> review -> payment).
- Conduct client-side form parsing and validations with `react-hook-form` and `zod`.
- Submit sanitized checkout payloads to the BFF layer.
