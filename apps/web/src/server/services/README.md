# Domain Services (`src/server/services/`)

This directory houses our pure business services, containing the core, framework-agnostic rules of the application.

## Responsibility
- Define exact use-case executions (e.g., verifying stock levels and updating order records).
- Process information from repositories and emit structured `Result<T, E>` payloads.
- Remain completely independent of the UI or HTTP routing boundaries.
