# Architecture

## Visao Geral

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ URL Query   │  │   Cookie    │  │     Subdomain       │  │
│  │ ?tenant=X   │  │  tenant=X   │  │  tenant-a.app.com   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Shell (Next.js SSR)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              getServerSideProps                         │ │
│  │  ┌──────────────┐    ┌──────────────┐                  │ │
│  │  │ Tenant       │───▶│ Load Config  │                  │ │
│  │  │ Resolver     │    │ (JSON)       │                  │ │
│  │  └──────────────┘    └──────────────┘                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   ThemeProvider                         │ │
│  │            (CSS Variables injection)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                      Pages                              │ │
│  │  ┌────────┐ ┌────────┐ ┌────────────┐ ┌────────┐      │ │
│  │  │ Header │ │  Hero  │ │ Payments   │ │ Footer │      │ │
│  │  └────────┘ └────────┘ │ Dashboard  │ └────────┘      │ │
│  │                        └────────────┘                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
tech-challenge-shipay/
├── apps/
│   └── shell/                    # Next.js SSR Shell Application
│       ├── src/
│       │   ├── components/       # Componentes do Shell (BEM)
│       │   │   ├── Header/
│       │   │   ├── Hero/
│       │   │   └── Footer/
│       │   ├── lib/
│       │   │   └── tenant.ts           # Resolucao de tenant
│       │   ├── pages/
│       │   │   ├── index.tsx           # Home page
│       │   │   ├── admin.tsx           # Admin page (CMS)
│       │   │   └── api/admin/config.ts # API para salvar config
│       │   └── styles/           # Estilos globais SCSS
│       └── public/               # Assets estaticos (logos)
│
├── packages/
│   ├── design-system/            # Design System Compartilhado
│   │   └── src/
│   │       ├── components/       # Button, Card, Chart (BEM)
│   │       ├── tokens/           # Colors, Spacing, Typography
│   │       └── styles/           # Base SCSS + Breakpoints
│   │
│   ├── types/                    # TypeScript Types Compartilhados
│   │   └── src/index.ts          # TenantConfig, ChartProps<T>, etc
│   │
│   ├── payments-module/          # Microfrontend de Pagamentos
│   │   └── src/
│   │       ├── PaymentsDashboard.tsx
│   │       └── PaymentsDashboard.module.scss
│   │
│   └── admin-module/             # Microfrontend de Admin/CMS
│       └── src/
│           ├── AdminPanel.tsx
│           └── AdminPanel.module.scss
│
├── cms/
│   └── tenants/                  # Configuracoes JSON dos tenants
│       ├── default.json
│       ├── tenant-a.json
│       └── tenant-b.json
│
└── docs/                         # Documentacao
    ├── ARCHITECTURE.md
    ├── STYLEGUIDE.md
    └── adr/                      # Architectural Decision Records
```

---

## Packages

### @shipay/shell (apps/shell)

Aplicacao principal Next.js que:

- Resolve o tenant via subdomain/cookie/query
- Carrega configuracao do tenant (JSON)
- Injeta tema via CSS variables
- Renderiza paginas com componentes fixos

**Arquivos importantes:**

- `lib/tenant.ts` - Resolucao de tenant
- `pages/index.tsx` - Pagina principal
- `pages/admin.tsx` - Pagina de administracao

**Tecnologias:** Next.js 14 (LTS), React 18, Pages Router

### @shipay/design-system (packages/design-system)

Componentes UI reutilizaveis:

- Button, Card, Chart, Section, ThemeProvider
- Tokens (colors, spacing, typography, breakpoints)
- Estilos base (CSS variables)
- SCSS mixins para breakpoints (`@include sm`, `@include md`, etc.)

**Tecnologias:** React, SCSS, CSS Modules, BEM

### @shipay/payments-module (packages/payments-module)

Microfrontend isolado para pagamentos:

- PaymentsDashboard component
- Consome design-system
- Isolado em package proprio (preparado para runtime federation)

### @shipay/admin-module (packages/admin-module)

Microfrontend de administracao:

- AdminPanel component (formulario de edicao de tema)
- Usa design-system para componentes
- Usa types para interfaces
- Chama API `/api/admin/config` para persistir mudancas

### @shipay/types (packages/types)

Tipos TypeScript compartilhados:

- TenantConfig, TenantTheme
- ChartProps, ButtonProps
- PaymentSummary

---

## Resolucao de Tenant

### Fluxo

```
1. Request chega
2. getServerSideProps executa
3. resolveTenantId() verifica (em ordem):
   a. Subdomain (tenant-a.app.com)
   b. Cookie (shipay_tenant)
   c. Query param (?tenant=X)
   d. Default
4. Valida contra whitelist
5. Carrega JSON do tenant
6. Retorna config como props
```

### Medidas de Seguranca

| Medida              | Descricao                           | Arquivo                      |
| ------------------- | ----------------------------------- | ---------------------------- |
| **Whitelist**       | Apenas tenant IDs pre-aprovados     | `tenant.ts:VALID_TENANTS`    |
| **Sanitizacao**     | Regex remove caracteres especiais   | `tenant.ts:sanitizeTenantId` |
| **HttpOnly Cookie** | Previne acesso via JavaScript (XSS) | `tenant.ts`                  |
| **Secure Flag**     | Cookie apenas via HTTPS em producao | `tenant.ts`                  |
| **SameSite=Strict** | Previne CSRF                        | `tenant.ts`                  |

---

## Injecao de Tema

### Fluxo

```
1. ThemeProvider recebe theme do tenant
2. Converte theme em CSS variables
3. Injeta via style attribute no container
4. Componentes usam var(--color-primary), etc
5. Mudanca de tenant = mudanca instantanea
```

### Configuracao do Tenant (cms/tenants/\*.json)

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

### Overrides por Tenant

ThemeProvider usa `generateCSSVariables(theme)` para injetar todas as variaveis:

```tsx
// packages/design-system/src/components/ThemeProvider/ThemeProvider.tsx
const cssVariables = generateCSSVariables(theme);
return <div style={cssVariables as React.CSSProperties}>{children}</div>;
```

---

## Design System

### Tokens

Definidos em `packages/design-system/src/styles/base.scss`:

```scss
:root {
  // Cores (sobrescritas por tenant)
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-background: #ffffff;
  --color-text: #171717;

  // Espacamento
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  // Tipografia
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  // Outros
  --border-radius: 0.5rem;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --transition-fast: 150ms ease;
}
```

### Breakpoints

Definidos em `packages/design-system/src/styles/_breakpoints.scss`:

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

> CSS variables nao funcionam em media queries, por isso uso SCSS mixins.
