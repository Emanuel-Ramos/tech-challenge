# Guia de Avaliacao

Mapeamento direto: requisito → arquivo.

---

## Desafio 1: Microfrontends & SSR

| Requisito           | Arquivo                                        |
| ------------------- | ---------------------------------------------- |
| Shell com SSR       | `apps/shell/` (Next.js 14)                     |
| Resolucao de Tenant | `apps/shell/src/lib/tenant.ts:18-45`           |
| White Label         | `cms/tenants/tenant-a.json`, `tenant-b.json`   |
| Admin Page (CMS)    | `apps/shell/src/pages/admin.tsx`               |
| Injecao de tema     | `packages/design-system/.../ThemeProvider.tsx` |

**Testar:** `?tenant=tenant-a` ou `?tenant=tenant-b`

---

## Desafio 2: Design System & Escalabilidade

| Requisito         | Arquivo                                         |
| ----------------- | ----------------------------------------------- |
| Design Tokens     | `packages/design-system/src/styles/base.scss`   |
| Componente Button | `packages/design-system/src/components/Button/` |
| Componente Card   | `packages/design-system/src/components/Card/`   |
| Versionamento     | `.changeset/config.json`                        |
| Governanca        | `CONTRIBUTING.md`, `docs/adr/`                  |

---

## Desafio 3: Componente de Grafico

| Requisito                 | Arquivo                                     |
| ------------------------- | ------------------------------------------- |
| Interface `ChartProps<T>` | `packages/types/src/index.ts`               |
| Implementacao Chart       | `packages/design-system/.../Chart.tsx`      |
| Testes (18 casos)         | `packages/design-system/.../Chart.test.tsx` |

**Estados:** Loading, Empty, Error - todos com `aria-label`.
