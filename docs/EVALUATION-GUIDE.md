# Guia de Avaliacao

Este documento mapeia cada requisito do desafio para sua implementacao no codigo.

---

## Mapeamento: Desafio → Implementacao

### Desafio 1: Microfrontends & SSR

| Requisito                | Implementacao                                          | Como Testar                                          |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| Shell com SSR            | `apps/shell/` (Next.js 14 Pages Router)                | `pnpm dev` e ver source da pagina                    |
| Pagina recebendo Tenant  | `apps/shell/src/lib/tenant.ts`                         | Acessar `?tenant=tenant-a`                           |
| 4 metodos de resolucao   | `resolveTenantId()` linhas 18-45                       | Ver prioridade: subdomain > cookie > query > default |
| White Label 2+ clientes  | `cms/tenants/tenant-a.json`, `tenant-b.json`           | Comparar cores e logos                               |
| Admin Page (CMS)         | `apps/shell/src/pages/admin.tsx`                       | Acessar `/admin?tenant=tenant-a`                     |
| Mudanca de logo          | `apps/shell/public/logos/`                             | Ver Header em cada tenant                            |
| Mudanca de cor primaria  | `packages/design-system/.../ThemeProvider.tsx`         | Botoes mudam de cor por tenant                       |
| Documentacao Remote Apps | `docs/ARCHITECTURE.md` secao "Adicionando Novo Modulo" | Ler documentacao                                     |

**Arquivos-chave:**

```
apps/shell/src/lib/tenant.ts           # Resolucao de tenant (linhas 18-45)
apps/shell/src/pages/index.tsx         # Home page com getServerSideProps
apps/shell/src/pages/admin.tsx         # Admin/CMS page
packages/design-system/.../ThemeProvider.tsx  # Injecao de CSS Variables
cms/tenants/*.json                     # Configuracoes dos tenants
```

---

### Desafio 2: Design System & Escalabilidade

| Requisito                | Implementacao                                   | Como Testar                |
| ------------------------ | ----------------------------------------------- | -------------------------- |
| Design Tokens (JSON/CSS) | `packages/design-system/src/styles/base.scss`   | Ver `:root` CSS Variables  |
| Tokens em TypeScript     | `packages/design-system/src/tokens/`            | Ver colors.ts, spacing.ts  |
| Componente usando tokens | `packages/design-system/src/components/Button/` | Ver `var(--color-primary)` |
| Versionamento            | `.changeset/config.json`, `package.json`        | `pnpm changeset`           |
| Governanca               | `CONTRIBUTING.md`, `docs/adr/`                  | Ler documentacao           |

**Arquivos-chave:**

```
packages/design-system/src/styles/base.scss      # CSS Variables (tokens)
packages/design-system/src/styles/_breakpoints.scss  # SCSS mixins responsivos
packages/design-system/src/components/Button/    # Exemplo de componente
packages/design-system/src/components/Card/      # Exemplo de componente
```

**Verificar tokens em uso:**

```bash
# Abrir qualquer .module.scss e ver uso de var(--spacing-4), var(--color-primary), etc.
```

---

### Desafio 3: Componente de Grafico (Chart)

| Requisito                     | Implementacao                                    | Como Testar                |
| ----------------------------- | ------------------------------------------------ | -------------------------- |
| Interface TypeScript generica | `packages/types/src/index.ts` (`ChartProps<T>`)  | Ver interface com `<T>`    |
| Agnostico ao provedor         | `mapDataPoint: (item: T) => ChartDataPoint`      | Ver prop no componente     |
| Estado Loading                | `packages/design-system/.../Chart.tsx` linha ~35 | Ver testes ou usar na home |
| Estado Empty                  | `packages/design-system/.../Chart.tsx` linha ~55 | Ver testes ou usar na home |
| Estado Error                  | `packages/design-system/.../Chart.tsx` linha ~45 | Ver testes ou usar na home |
| aria-label                    | Prop `aria-label` no Chart                       | Inspecionar elemento       |

**Arquivos-chave:**

```
packages/types/src/index.ts                     # ChartProps<T>, ChartDataPoint
packages/design-system/src/components/Chart/Chart.tsx      # Implementacao
packages/design-system/src/components/Chart/Chart.test.tsx # Testes (18 casos)
```

**Interface generica:**

```typescript
// packages/types/src/index.ts
export interface ChartProps<T> {
  data: T[];
  mapDataPoint: (item: T) => ChartDataPoint; // Transformacao generica
  state?: ChartState;
  formatValue?: (value: number) => string;
  title?: string;
  "aria-label"?: string;
}
```

## Links Rapidos

| O que voce quer ver?          | Onde encontrar                                         |
| ----------------------------- | ------------------------------------------------------ |
| Como tenant é resolvido       | `apps/shell/src/lib/tenant.ts`                         |
| Como tema é injetado          | `packages/design-system/.../ThemeProvider.tsx`         |
| Interface generica do Chart   | `packages/types/src/index.ts`                          |
| Componente Chart              | `packages/design-system/.../Chart/Chart.tsx`           |
| Design Tokens (CSS Variables) | `packages/design-system/src/styles/base.scss`          |
| Breakpoints (SCSS mixins)     | `packages/design-system/src/styles/_breakpoints.scss`  |
| Exemplo de componente BEM     | `packages/design-system/.../Button/Button.module.scss` |
| Decisoes arquiteturais        | `docs/adr/ADR-*.md`                                    |
| Como adicionar novo modulo    | `docs/ARCHITECTURE.md` secao final                     |
| Testes unitarios              | `*.test.tsx` em cada componente                        |
