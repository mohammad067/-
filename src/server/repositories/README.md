# Data Access Repositories (`src/server/repositories/`)

This directory isolates persistent data fetching logic from the business layers.

## Responsibility
- Execute queries against our active databases or third-party storage endpoints.
- Map low-level database rows into clean, statically-typed domain records.
- Wrap third-party APIs (payment systems, SMS providers) behind clean, injectable interfaces.
