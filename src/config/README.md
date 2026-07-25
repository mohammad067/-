# Configuration Loaders (`src/config/`)

This directory parses and validates environment variables before exposing them to the application.

## Responsibility
- Prevent runtime crashes by running schema validation (`zod`) on configuration files during system boot.
- Export unified config objects (e.g. `export const config = { ... }`) to avoid reading directly from `process.env`.
