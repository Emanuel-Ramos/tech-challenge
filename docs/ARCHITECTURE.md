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

### @shipay/types (packages/types)

Tipos TypeScript compartilhados:

- TenantConfig, TenantTheme
- ChartProps, ButtonProps
- PaymentSummary

## Fluxos

### Resolucao de Tenant

```
1. Request chega
2. getServerSideProps executa
3. resolveTenantId() verifica (em ordem):
   a. Subdomain (tenant-a.app.com)
   b. Cookie (shipay_tenant)
   c. Query param (?tenant=X) - dev only
   d. Default
4. Valida contra whitelist
5. Carrega JSON do tenant
6. Retorna config como props
```

### Injecao de Tema

```
1. ThemeProvider recebe theme do tenant
2. Converte theme em CSS variables
3. Injeta via style attribute no container
4. Componentes usam var(--color-primary), etc
5. Mudanca de tenant = mudanca instantanea
```

## Multi-tenancy

### Configuracao (cms/tenants/\*.json)

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

### Seguranca

| Medida          | Descricao                    |
| --------------- | ---------------------------- |
| Whitelist       | Apenas tenant IDs permitidos |
| Sanitizacao     | Remove caracteres especiais  |
| HttpOnly Cookie | Previne XSS                  |
| Secure Cookie   | Apenas HTTPS em prod         |
| SameSite=Strict | Previne CSRF                 |

## Design System

### Tokens

Definidos em `packages/design-system/src/styles/base.scss`:

- Cores (primary, secondary, text, background)
- Espacamento (1-16)
- Tipografia (xs-4xl)
- Sombras, bordas, transicoes
- Container (max-width, padding)

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

### CSS Variables

Tokens sao expostos como CSS custom properties:

```css
--color-primary: #3b82f6;
--spacing-4: 1rem;
--font-size-base: 1rem;
```

### Overrides por Tenant

ThemeProvider sobrescreve variaveis base:

```tsx
<div style={{
  "--color-primary": theme.primaryColor,
  "--color-secondary": theme.secondaryColor,
}}>
```

## Code Quality

### Git Hooks (Husky)

| Hook         | Validacao                         |
| ------------ | --------------------------------- |
| `pre-commit` | Prettier nos arquivos staged      |
| `commit-msg` | Conventional commits (commitlint) |

### Conventional Commits

Formato obrigatorio:

```
<tipo>(<escopo>): <descricao em minusculo>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

## Build

### Monorepo

- pnpm workspaces para gerenciar packages
- Turborepo para build caching
- workspace:\* para dependencias internas

### Build-time Federation

Atualmente, todos os packages sao buildados juntos:

- Vantagem: Type safety completo, tree-shaking
- Desvantagem: Deploy conjunto

### Futuro: Runtime Federation

Para escalar, migrar para Module Federation:

- Deploy independente de MFEs
- Versionamento separado
- Maior complexidade

## Decisoes (ADRs)

Ver `/docs/adr/` para decisoes arquiteturais documentadas:

- ADR-001: Tenant Resolution
- ADR-002: CSS Variables
- ADR-003: Build-time Federation
- ADR-004: Pages Router
- ADR-005: SCSS + BEM Methodology
- ADR-006: Next.js 14 LTS (versoes estaveis)

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

> Em producao, adicionar autenticacao antes de liberar essa pagina.

## Adicionando Novo Tenant

1. Criar `cms/tenants/novo-tenant.json`
2. Adicionar ID na whitelist (`tenant.ts`)
3. Adicionar logo em `apps/shell/public/logos/`
4. Testar: `?tenant=novo-tenant`

## Adicionando Novo Componente

1. Criar pasta em `packages/design-system/src/components/`
2. Seguir estrutura: `Component.tsx`, `Component.module.scss`
3. Exportar em `packages/design-system/src/index.ts`
4. Usar BEM para estilos
5. Adicionar testes

## Adicionando Novo Modulo (Microfrontend)

1. Criar package em `packages/novo-modulo/`
2. Implementar componente usando design-system
3. Criar rota no Shell:

```tsx
// apps/shell/src/pages/admin/novo-modulo.tsx
import { NovoModuloAdmin } from "@shipay/novo-modulo";
import { withTenant } from "@/lib/tenant";

export const getServerSideProps = withTenant();

export default function NovoModuloPage({ tenant }) {
  return <NovoModuloAdmin tenantId={tenant.id} />;
}
```

4. Testar: `/admin/novo-modulo?tenant=tenant-a`
