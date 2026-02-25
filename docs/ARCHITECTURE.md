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

### Ordem de Prioridade

1. **Subdominio** (producao): `tenant-a.shipay.com.br`
2. **Cookie Seguro** (persistencia): HttpOnly + Secure + SameSite
3. **Query Parameter**: `?tenant=tenant-a`
4. **Default**: Fallback para configuracao padrao

### Implementacao

```typescript
// apps/shell/src/lib/tenant.ts
export function resolveTenantId(ctx: GetServerSidePropsContext): string {
  const isDev = process.env.NODE_ENV === "development";

  // 1. Subdominio (primario para producao)
  const subdomainTenant = extractTenantFromSubdomain(ctx.req.headers.host);
  if (subdomainTenant && isValidTenant(subdomainTenant)) {
    return subdomainTenant;
  }

  // 2. Cookie seguro (fallback)
  const cookieTenant = ctx.req.cookies?.[TENANT_COOKIE_NAME];
  if (cookieTenant && isValidTenant(cookieTenant)) {
    return cookieTenant;
  }

  // 3. Query param
  if (isDev) {
    const queryTenant = ctx.query.tenant;
    if (typeof queryTenant === "string" && isValidTenant(queryTenant)) {
      return queryTenant;
    }
  }

  return "default";
}
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

ThemeProvider sobrescreve variaveis base:

```tsx
<div style={{
  "--color-primary": theme.primaryColor,
  "--color-secondary": theme.secondaryColor,
}}>
```

---

## Como Plugar Remote Apps (Microfrontends)

### Contexto

O painel CMS sera dividido entre times de desenvolvimento, cada um responsavel por funcionalidades distintas (ex: pagamentos, relatorios, usuarios).

### Arquitetura: Rotas por Modulo

Cada time e responsavel por seu proprio pacote e rota. O Shell apenas importa e renderiza:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Shell (Next.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   /                    → Pagina publica (tema do tenant)         │
│   /admin               → Editor de tema (@shipay/admin-module)   │
│   /admin/payments      → Time de Pagamentos                      │
│   /admin/reports       → Time de Relatorios                      │
│   /admin/users         → Time de Usuarios                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
          │                    │                    │
    ┌─────┴─────┐        ┌─────┴─────┐        ┌─────┴─────┐
    │ @shipay/  │        │ @shipay/  │        │ @shipay/  │
    │ admin-    │        │ payments- │        │ reports-  │
    │ module    │        │ module    │        │ module    │
    └───────────┘        └───────────┘        └───────────┘
```

### Exemplo Real: @shipay/payments-module

```
packages/payments-module/
├── src/
│   ├── PaymentsDashboard.tsx        # Componente principal
│   ├── PaymentsDashboard.module.scss
│   └── index.ts                     # Export publico
└── package.json
```

### Exemplo Real: @shipay/admin-module

```
packages/admin-module/
├── src/
│   ├── AdminPanel.tsx               # Formulario de edicao de tenant
│   ├── AdminPanel.module.scss       # Estilos BEM com breakpoints
│   └── index.ts                     # Export publico
├── package.json
└── tsconfig.json
```

**O que faz:**

- Permite editar configuracoes do tenant (nome, cores, border-radius)
- Usa `@shipay/design-system` para componentes (Button)
- Usa `@shipay/types` para interfaces (TenantConfig, TenantTheme)
- Chama API `/api/admin/config` para persistir mudancas

**Como e usado no Shell:**

```tsx
// apps/shell/src/pages/admin.tsx
import { AdminPanel } from "@shipay/admin-module";

export default function AdminPage({ tenant }) {
  return <AdminPanel initialConfig={tenant} />;
}
```

### Contrato entre Shell e Modulos

Cada modulo **deve**:

- Exportar componentes React nomeados
- Usar `@shipay/design-system` para consistencia visual
- Usar `@shipay/types` para interfaces compartilhadas
- Implementar estados: loading, error, empty
- Suportar `aria-label` para acessibilidade

**Por que esta abordagem?**

| Aspecto          | Beneficio                                       |
| ---------------- | ----------------------------------------------- |
| **Simplicidade** | Padrao Next.js nativo (pages)                   |
| **Isolamento**   | Cada time tem sua rota, nao interfere em outros |
| **Type Safety**  | Imports explicitos, erros em build time         |
| **Familiar**     | Desenvolvedores ja conhecem o padrao            |

---

## Adicionando Novo Modulo (Microfrontend)

### Passo 1: Criar o pacote

```bash
mkdir packages/meu-modulo
```

```json
// packages/meu-modulo/package.json
{
  "name": "@shipay/meu-modulo",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "dependencies": {
    "@shipay/design-system": "workspace:*",
    "@shipay/types": "workspace:*"
  }
}
```

### Passo 2: Implementar o componente

```tsx
// packages/meu-modulo/src/MeuModuloAdmin.tsx
import { Card, Button } from "@shipay/design-system";

export function MeuModuloAdmin() {
  return (
    <Card title="Configuracoes do Meu Modulo">
      <p>Interface de administracao do modulo</p>
      <Button>Salvar</Button>
    </Card>
  );
}
```

### Passo 3: Criar a rota no Shell

```tsx
// apps/shell/src/pages/admin/meu-modulo.tsx
import { MeuModuloAdmin } from "@shipay/meu-modulo";
import { withTenant } from "@/lib/tenant";

export const getServerSideProps = withTenant();

export default function MeuModuloPage({ tenant }) {
  return <MeuModuloAdmin tenantId={tenant.id} />;
}
```

Pronto! O novo modulo esta disponivel em `/admin/meu-modulo`.

---

## Admin Page (CMS)

A pagina `/admin` permite editar a configuracao do tenant atual:

```
http://localhost:3000/admin?tenant=tenant-a
```

**Funcionalidades:**

- Editar nome do tenant
- Editar cores do tema (primary, secondary, background, text)
- Editar border radius

**Fluxo:**

```
1. Admin acessa /admin
2. Formulario carrega config atual
3. Admin edita e salva
4. API PUT /api/admin/config escreve no JSON
5. Proximo reload mostra mudancas
```

**Arquivos:**

- `pages/admin.tsx` - Pagina
- `pages/api/admin/config.ts` - API GET/PUT
- `@shipay/admin-module` - Formulario (package separado)

> **Nota MVP:** A persistencia dinamica nao esta implementada. O botao "Save" exibe mensagem informando que a feature esta em desenvolvimento.

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

---

## Build

### Monorepo

- pnpm workspaces para gerenciar packages
- Turborepo para build caching
- workspace:\* para dependencias internas

### Build-time Federation

Atualmente, todos os packages sao buildados juntos:

- **Vantagem:** Type safety completo, tree-shaking
- **Desvantagem:** Deploy conjunto

### Evolucao Futura: Runtime Federation

Para escalar, migrar para Module Federation:

- Deploy independente de MFEs
- Versionamento separado
- Maior complexidade

---

## Decisoes Arquiteturais (ADRs)

Ver `/docs/adr/` para decisoes documentadas:

- [ADR-001: Tenant Resolution](adr/ADR-001-tenant-resolution.md)
- [ADR-002: CSS Variables](adr/ADR-002-css-variables.md)
- [ADR-003: Build-time Federation](adr/ADR-003-build-time-federation.md)
- [ADR-004: Pages Router](adr/ADR-004-pages-router.md)
- [ADR-005: SCSS + BEM Methodology](adr/ADR-005-scss-bem-methodology.md)
- [ADR-006: Next.js 14 LTS](adr/ADR-006-stable-framework-versions.md)

---

## Guias Rapidos

### Adicionando Novo Tenant

1. Criar `cms/tenants/novo-tenant.json`
2. Adicionar ID na whitelist (`tenant.ts`)
3. Adicionar logo em `apps/shell/public/logos/`
4. Testar: `?tenant=novo-tenant`

### Adicionando Novo Componente

1. Criar pasta em `packages/design-system/src/components/`
2. Seguir estrutura: `Component.tsx`, `Component.module.scss`
3. Exportar em `packages/design-system/src/index.ts`
4. Usar BEM para estilos
5. Adicionar testes
