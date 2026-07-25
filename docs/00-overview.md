# Rice Shop — Project Overview

## 1. Purpose

Rice Shop is an e-commerce web application for browsing, ordering, and managing
purchases of rice and related grocery products. This document set defines the
architecture, conventions, and engineering standards for the project before
any application code is written.

## 2. Goals

- Deliver a fast, accessible, SEO-friendly storefront.
- Support authenticated customer accounts, order history, and checkout.
- Provide an internal admin area for inventory and order management.
- Keep the codebase maintainable, testable, and scalable as the team grows.
- Enforce enterprise-grade engineering discipline: clear boundaries between
  layers, typed contracts, predictable state management, and consistent
  styling.

## 3. Non-Goals (v1)

- Multi-vendor marketplace support.
- Native mobile applications.
- Multi-currency / multi-language support (planned for a later phase, see
  `14-roadmap.md`).

## 4. Tech Stack Summary

| Concern              | Choice          |
|-----------------------|-----------------|
| Framework             | Next.js (App Router) |
| Language              | TypeScript (strict mode) |
| Styling               | Tailwind CSS |
| Component Primitives  | Shadcn UI |
| Animation             | Framer Motion |
| Server State          | TanStack Query |
| Client/UI State       | Zustand |

See `02-tech-stack.md` for rationale behind each choice.

## 5. Document Index

| File | Purpose |
|------|---------|
| `01-architecture.md` | High-level system and layer architecture |
| `02-tech-stack.md` | Technology choices and rationale |
| `03-folder-structure.md` | Repository and app folder layout |
| `04-state-management.md` | Zustand conventions and store boundaries |
| `05-data-fetching.md` | TanStack Query conventions, server/client data flow |
| `06-styling-guidelines.md` | Tailwind + Shadcn UI conventions |
| `07-component-guidelines.md` | Component design principles, Framer Motion usage |
| `08-routing.md` | App Router structure, route groups, layouts |
| `09-api-design.md` | API route conventions, request/response contracts |
| `10-testing-strategy.md` | Unit, integration, and e2e testing approach |
| `11-coding-standards.md` | Lint/format rules, naming, TypeScript conventions |
| `12-environment-config.md` | Environment variables, secrets, config management |
| `13-deployment.md` | CI/CD, environments, release process |
| `14-roadmap.md` | Phasing and future scope |

## 6. Status

**Phase: Documentation only.** No application code, dependencies, or pages
have been created yet, per the constraints in `START.md`. This document set
is pending approval before implementation begins.
