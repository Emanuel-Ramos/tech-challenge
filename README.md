# Shipay - Multi-tenant Platform with Microfrontends

A white-label multi-tenant platform built with Next.js, featuring microfrontend architecture and a shared design system.

---

## Live Demo

**Tenant A (blue theme):** https://tenant-a.shipay.emanuel.app.br/

**Tenant B (green theme):** https://tenant-b.shipay.emanuel.app.br/

**Admin CMS:** https://tenant-a.shipay.emanuel.app.br/admin

Alternative URLs:

- https://shipay.emanuel.app.br/?tenant=tenant-a
- https://shipay.emanuel.app.br/?tenant=tenant-b

---

## Team Collaboration

Each team works on their own module independently:

| Team     | Package                   | Responsibility        |
| -------- | ------------------------- | --------------------- |
| Payments | `@shipay/payments-module` | Transaction dashboard |
| Admin    | `@shipay/admin-module`    | CMS and configuration |
| Core     | `@shipay/design-system`   | Shared components     |

**How to plug in a new Package:**

1. Create package in `packages/my-module/`
2. Consume `@shipay/types` for contracts
3. Use `@shipay/design-system` for UI
4. Integrate in Shell via import

> See [ADR-003](docs/adr/ADR-003-build-time-federation.md) for Build-time vs Runtime Federation trade-offs.

---

## Features

| Feature                            | Implementation                               |
| ---------------------------------- | -------------------------------------------- |
| **SSR Shell (Next.js)**            | Next.js 14 with Pages Router                 |
| **Tenant Resolution (URL/Cookie)** | 4 methods: subdomain, cookie, query, default |
| **White Label for 2+ clients**     | tenant-a, tenant-b, default                  |
| **Admin Page (CMS)**               | /admin - edits tenant config                 |
| **Logo per tenant**                | `/logos/tenant-a.svg`, `/logos/tenant-b.svg` |
| **Primary color per tenant**       | Dynamic CSS Variables via ThemeProvider      |
| **Design Tokens (JSON/CSS)**       | TypeScript + CSS Variables + SCSS            |
| **Token-consuming components**     | Button, Card, Chart                          |
| **Documented versioning**          | Semantic Versioning + Changesets             |
| **Documented governance**          | CONTRIBUTING.md + ADRs                       |
| **TypeScript chart interface**     | Generic `ChartProps<T>`                      |
| **Provider-agnostic component**    | `mapDataPoint: (item: T) => ChartDataPoint`  |
| **Loading/Empty/Error states**     | All implemented with accessibility           |

---

## Additional Features

| Feature                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| **AI-generated tests** | Vitest + Testing Library (78+ tests)               |
| **AI Code Review**     | GitHub Action with Claude for automated review     |
| **CI/CD Pipeline**     | Lint, typecheck, build, test on each PR            |
| **Git Hooks**          | Husky + Commitlint (conventional commits)          |
| **Changesets**         | Automated semantic versioning                      |
| **Accessibility**      | WCAG 2.1 AA (aria-labels, focus-visible, contrast) |

---

## Documentation

| Document                                     | Description              |
| -------------------------------------------- | ------------------------ |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Detailed architecture    |
| [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md)     | Code standards           |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Governance and standards |
| [docs/adr/](docs/adr/)                       | Architectural decisions  |

> **Note:** The [CONTRIBUTING.md](CONTRIBUTING.md) establishes code standardization rules, conventional commits, and workflow for orchestrating development among multiple developers consistently.

---

## Quick Start

```bash
pnpm install      # Install dependencies
pnpm dev          # Development
pnpm validate     # Build + Test + Lint
```

> **All commands:** [CONTRIBUTING.md](CONTRIBUTING.md#commands)

---

**Stack:** Next.js 14 | React 18 | TypeScript | SCSS | pnpm workspaces | Vitest

**Author:** Emanuel
