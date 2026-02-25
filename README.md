# Tech Challenge Shipay - Plataforma Multi-tenant com Microfrontends

> **Desafio Techlead Front-End Engineer Shipay**

---

## Para o Avaliador

| Criterio                     | Como foi atendido                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Arquitetura e Trade-offs** | Arquitetura [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) e 6 ADRs documentando decisoes ([docs/adr/](docs/adr/)).                          |
| **Qualidade de Abstracao**   | `ChartProps<T>` generico com `mapDataPoint: (item: T) => ChartDataPoint`. Props tipadas com `aria-label` em todas interfaces.              |
| **Pragmatismo**              | MVP com Build-time Federation (simples) para entrega do teste. Arquitetura preparada para escalar com Module Federation quando necessario. |
| **Boas Praticas**            | BEM + SCSS, CONTRIBUTING.md, conventional commits, changeset, acessibilidade (WCAG 2.1 AA), 78+ testes automatizados.                      |

**Links rapidos:** [Arquitetura](docs/ARCHITECTURE.md) | [ADRs](docs/adr/) | [Guia de Avaliacao](docs/EVALUATION-GUIDE.md)

---

## Colaboração entre Times

Cada time trabalha em seu próprio módulo de forma independente:

| Time       | Package                   | Responsabilidade           |
| ---------- | ------------------------- | -------------------------- |
| Pagamentos | `@shipay/payments-module` | Dashboard de transações    |
| Admin      | `@shipay/admin-module`    | CMS e configuração         |
| Core       | `@shipay/design-system`   | Componentes compartilhados |

**Como plugar um novo Remote App:**

1. Criar package em `packages/meu-modulo/`
2. Consumir `@shipay/types` para contratos
3. Usar `@shipay/design-system` para UI
4. Integrar no Shell via import

> Ver [ADR-003](docs/adr/ADR-003-build-time-federation.md) para trade-offs de Build-time vs Runtime Federation.

---

## Requisitos Atendidos

| Requisito do Desafio                     | Status | Implementacao                                |
| ---------------------------------------- | ------ | -------------------------------------------- |
| **Shell com SSR (Next.js)**              | ✅     | Next.js 14 com Pages Router                  |
| **Pagina recebendo Tenant (URL/Cookie)** | ✅     | 4 metodos: subdomain, cookie, query, default |
| **White Label para 2+ clientes**         | ✅     | tenant-a, tenant-b, default                  |
| **Admin Page (CMS)**                     | ✅     | /admin - edita config do tenant              |
| **Mudanca de logo por tenant**           | ✅     | `/logos/tenant-a.svg`, `/logos/tenant-b.svg` |
| **Mudanca de cor primaria por tenant**   | ✅     | CSS Variables dinamicas via ThemeProvider    |
| **Design Tokens (JSON/CSS)**             | ✅     | TypeScript + CSS Variables + SCSS            |
| **Componente consumindo tokens**         | ✅     | Button, Card, Chart                          |
| **Versionamento documentado**            | ✅     | Semantic Versioning + Changesets             |
| **Governanca documentada**               | ✅     | CONTRIBUTING.md + ADRs                       |
| **Interface TypeScript para graficos**   | ✅     | `ChartProps<T>` generico                     |
| **Componente agnostico ao provedor**     | ✅     | `mapDataPoint: (item: T) => ChartDataPoint`  |
| **Estados Loading/Empty/Error**          | ✅     | Todos implementados com acessibilidade       |

---

## Extras Implementados

Alem dos requisitos, este projeto inclui:

| Extra                                   | Descricao                                                                                                                                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Testes automatizados gerados por IA** | Vitest + Testing Library (78+ testes) sendo gerados por uma skill do claude                                                                                                                                 |
| **AI Code Review**                      | GitHub Action com Claude para review automatizado ([exemplo aprovado](https://github.com/Emanuel-Ramos/tech-challenge/pull/8), [exemplo reprovado](https://github.com/Emanuel-Ramos/tech-challenge/pull/7)) |
| **CI/CD Pipeline**                      | Lint, typecheck, build, test em cada PR                                                                                                                                                                     |
| **Git Hooks**                           | Husky + Commitlint (conventional commits)                                                                                                                                                                   |
| **Changesets**                          | Versionamento semantico automatizado                                                                                                                                                                        |
| **Acessibilidade**                      | WCAG 2.1 AA (aria-labels, focus-visible, contraste)                                                                                                                                                         |

---

## Documentacao

| Documento                                            | Descricao                      |
| ---------------------------------------------------- | ------------------------------ |
| [docs/EVALUATION-GUIDE.md](docs/EVALUATION-GUIDE.md) | Guia para avaliacao do desafio |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)         | Arquitetura detalhada          |
| [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md)             | Padroes de codigo              |
| [CONTRIBUTING.md](CONTRIBUTING.md)                   | Governanca e padroes           |
| [docs/adr/](docs/adr/)                               | Decisoes arquiteturais         |

> **Nota:** O [CONTRIBUTING.md](CONTRIBUTING.md) estabelece regras de padronizacao de codigo, conventional commits e fluxo de trabalho para orquestrar o desenvolvimento entre multiplos desenvolvedores de forma consistente.

---

## Quick Start

```bash
pnpm install      # Instalar dependências
pnpm dev          # Desenvolvimento
pnpm validate     # Build + Test + Lint
```

> **Todos os comandos:** [CONTRIBUTING.md](CONTRIBUTING.md#comandos)

---

**Stack:** Next.js 14 | React 18 | TypeScript | SCSS | pnpm workspaces | Vitest

**Autor:** Emanuel - Tech Challenge Shipay
