# Architecture

## Overview

<img width="1024" height="1536" alt="mermaid-flow" src="https://github.com/user-attachments/assets/08ae88d1-a6ab-4a2e-a091-b6e8611bab11" />

---

## Project Structure

```
shipay-platform/
├── apps/
│   └── shell/                    # Next.js SSR Shell Application
│       ├── src/
│       │   ├── components/       # Shell Components (BEM)
│       │   │   ├── Header/
│       │   │   ├── Hero/
│       │   │   └── Footer/
│       │   ├── lib/
│       │   │   └── tenant.ts           # Tenant resolution
│       │   ├── pages/
│       │   │   ├── index.tsx           # Home page
│       │   │   ├── admin.tsx           # Admin page (CMS)
│       │   │   └── api/admin/config.ts # API to save config
│       │   └── styles/           # Global SCSS styles
│       └── public/               # Static assets (logos)
│
├── packages/
│   ├── design-system/            # Shared Design System
│   │   └── src/
│   │       ├── components/       # Button, Card, Chart (BEM)
│   │       ├── tokens/           # Colors, Spacing, Typography
│   │       └── styles/           # Base SCSS + Breakpoints
│   │
│   ├── types/                    # Shared TypeScript Types
│   │   └── src/index.ts          # TenantConfig, ChartProps<T>, etc
│   │
│   ├── payments-module/          # Payments Microfrontend
│   │   └── src/
│   │       ├── PaymentsDashboard.tsx
│   │       └── PaymentsDashboard.module.scss
│   │
│   └── admin-module/             # Admin/CMS Microfrontend
│       └── src/
│           ├── AdminPanel.tsx
│           └── AdminPanel.module.scss
│
├── cms/
│   └── tenants/                  # Tenant JSON configurations
│       ├── default.json
│       ├── tenant-a.json
│       └── tenant-b.json
│
└── docs/                         # Documentation
    ├── ARCHITECTURE.md
    ├── STYLEGUIDE.md
    └── adr/                      # Architectural Decision Records
```

---

## Packages

### @shipay/shell (apps/shell)

Main Next.js application that:

- Resolves tenant via subdomain/cookie/query
- Loads tenant configuration (JSON)
- Injects theme via CSS variables
- Renders pages with fixed components

**Technologies:** Next.js 14 (LTS), React 18, Pages Router

### @shipay/design-system (packages/design-system)

Reusable UI components:

- Button, Card, Chart, Section, ThemeProvider
- Tokens (colors, spacing, typography, breakpoints)
- Base styles (CSS variables)
- SCSS mixins for breakpoints (`@include sm`, `@include md`, etc.)

**Technologies:** React, SCSS, CSS Modules, BEM

### @shipay/payments-module (packages/payments-module)

Isolated payments microfrontend:

- PaymentsDashboard component
- Consumes design-system
- Isolated in its own package (prepared for runtime federation)

### @shipay/admin-module (packages/admin-module)

Admin microfrontend:

- AdminPanel component (theme editing form)
- Uses design-system for components
- Uses types for interfaces
- Calls `/api/admin/config` API to persist changes

### @shipay/types (packages/types)

Shared TypeScript types:

- TenantConfig, TenantTheme
- ChartProps, ButtonProps
- PaymentSummary

---

## Tenant Resolution

### Flow

```
1. Request arrives
2. getServerSideProps executes
3. resolveTenantId() checks (in order):
   a. Subdomain (tenant-a.app.com)
   b. Cookie (shipay_tenant)
   c. Query param (?tenant=X)
   d. Default
4. Validates against whitelist
5. Loads tenant JSON
6. Returns config as props
```

### Security Measures

| Measure             | Description                         | File                         |
| ------------------- | ----------------------------------- | ---------------------------- |
| **Whitelist**       | Only pre-approved tenant IDs        | `tenant.ts:VALID_TENANTS`    |
| **Sanitization**    | Regex removes special characters    | `tenant.ts:sanitizeTenantId` |
| **HttpOnly Cookie** | Prevents JavaScript access (XSS)    | `tenant.ts`                  |
| **Secure Flag**     | Cookie only via HTTPS in production | `tenant.ts`                  |
| **SameSite=Strict** | Prevents CSRF                       | `tenant.ts`                  |

---

## Theme Injection

### Flow

```
1. ThemeProvider receives theme from tenant
2. Converts theme to CSS variables
3. Injects via style attribute on container
4. Components use var(--color-primary), etc
5. Tenant change = instant change
```

### Tenant Configuration (cms/tenants/\*.json)

```json
{
  "id": "tenant-a",
  "name": "Tenant A",
  "logo": "/logos/tenant-a.svg",
  "theme": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#6b7280",
    "backgroundColor": "#ffffff",
    "textColor": "#171717",
    "borderRadius": "0.5rem"
  }
}
```

### Per-Tenant Overrides

ThemeProvider uses `generateCSSVariables(theme)` to inject all variables:

```tsx
// packages/design-system/src/components/ThemeProvider/ThemeProvider.tsx
const cssVariables = generateCSSVariables(theme);
return <div style={cssVariables as React.CSSProperties}>{children}</div>;
```

---

## Design System

### Tokens

Defined in `packages/design-system/src/styles/base.scss`:

```scss
:root {
  // Colors (overridden by tenant)
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-background: #ffffff;
  --color-text: #171717;

  // Spacing
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  // Typography
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  // Others
  --border-radius: 0.5rem;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --transition-fast: 150ms ease;
}
```

### Breakpoints

Defined in `packages/design-system/src/styles/_breakpoints.scss`:

```scss
@include xs {
} // >= 480px
@include sm {
} // >= 640px
@include md {
} // >= 768px
@include lg {
} // >= 1024px
@include xl {
} // >= 1280px
```

> CSS variables don't work in media queries, so I use SCSS mixins.

---

## Abstraction Quality

### Design Tokens

Tokens organized in `packages/design-system/src/tokens/`:

| File            | Content                             |
| --------------- | ----------------------------------- |
| `colors.ts`     | Neutral, brand and semantic palette |
| `spacing.ts`    | Spacing scale (base 4px)            |
| `typography.ts` | Fonts, sizes and weights            |

The `generateCSSVariables(theme)` function converts 5 tenant colors into CSS variables, automatically deriving variants (opacity, inversion).

### Interfaces (Props)

Centralized in `@shipay/types` to ensure consistency across packages:

```typescript
// Variants with union types and defaults
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

// Standardized async states
interface ChartState {
  loading?: boolean;
  error?: Error | string | null;
  empty?: { message: string };
}

// Generics for agnostic data
interface ChartProps<T> {
  data: T[];
  mapDataPoint: (item: T) => ChartDataPoint;
}
```

### Abstraction Flow

```
Props (TypeScript) → CSS Variables (tokens) → SCSS + BEM (styles)
```

Components map props to BEM classes (`button--primary`), which consume CSS variables (`var(--color-primary)`).

---

## Architectural Decisions (ADRs)

| ADR                                                 | Decision                                |
| --------------------------------------------------- | --------------------------------------- |
| [ADR-001](adr/ADR-001-tenant-resolution.md)         | Monorepo structure with pnpm workspaces |
| [ADR-002](adr/ADR-002-css-variables.md)             | Design tokens via CSS Variables         |
| [ADR-003](adr/ADR-003-build-time-federation.md)     | Build-time Federation for MVP           |
| [ADR-004](adr/ADR-004-pages-router.md)              | Tenant resolution via subdomain/cookie  |
| [ADR-005](adr/ADR-005-scss-bem-methodology.md)      | Generic interface for charts            |
| [ADR-006](adr/ADR-006-stable-framework-versions.md) | SCSS with BEM for styles                |
