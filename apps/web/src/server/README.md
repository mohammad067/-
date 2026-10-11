# Server Layer (`src/server/`)

This directory contains pure server-side, framework-agnostic business and data-access layers.

## Safety Constraint
**Never import files in this directory into React Client Components (`"use client"`).** This is server-only territory, enforced by absolute compilation path boundaries and static lint rules.

## Subdirectories
- `services/`: Encapsulates pure business logic rules (e.g. calculation of taxes, order status routing, inventory matching).
- `repositories/`: Direct interface wrapper with persistent data engines (database client, ORM mappings, external third-party SDK clients).
- `auth/`: Server-side token validators, password encryptors, and session cookies setup.
- `validation/`: Schema validation files ensuring secure payload structures.
