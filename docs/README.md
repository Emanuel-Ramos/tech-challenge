# Documentacao

## Navegacao Rapida

| Voce quer...                    | Leia                                       |
| ------------------------------- | ------------------------------------------ |
| Avaliar o desafio               | [EVALUATION-GUIDE.md](EVALUATION-GUIDE.md) |
| Entender a arquitetura          | [ARCHITECTURE.md](ARCHITECTURE.md)         |
| Codar seguindo padroes          | [STYLEGUIDE.md](STYLEGUIDE.md)             |
| Entender uma decisao tecnica    | [adr/](adr/)                               |
| Fazer deploy ou troubleshooting | [runbook.md](runbook.md)                   |
| Contribuir com o projeto        | [CONTRIBUTING.md](../CONTRIBUTING.md)      |

---

## Indice Completo

### Guias

| Documento                                  | Descricao                                    |
| ------------------------------------------ | -------------------------------------------- |
| [EVALUATION-GUIDE.md](EVALUATION-GUIDE.md) | Mapeamento desafio → codigo para avaliadores |
| [ARCHITECTURE.md](ARCHITECTURE.md)         | Arquitetura, fluxos, diagramas               |
| [STYLEGUIDE.md](STYLEGUIDE.md)             | Padroes: TypeScript, SCSS, BEM, Testes       |
| [runbook.md](runbook.md)                   | Deploy, seguranca, troubleshooting           |
| [../CONTRIBUTING.md](../CONTRIBUTING.md)   | Git workflow, commits, PRs                   |

### ADRs (Architecture Decision Records)

| ADR                                             | Decisao               | Resumo                               |
| ----------------------------------------------- | --------------------- | ------------------------------------ |
| [001](adr/ADR-001-tenant-resolution.md)         | Resolucao de Tenant   | Subdomain > Cookie > Query > Default |
| [002](adr/ADR-002-css-variables.md)             | CSS Variables         | Zero runtime overhead para theming   |
| [003](adr/ADR-003-build-time-federation.md)     | Build-time Federation | Type safety, simplicidade para MVP   |
| [004](adr/ADR-004-pages-router.md)              | Pages Router          | Estabilidade, SSR simples            |
| [005](adr/ADR-005-scss-bem-methodology.md)      | SCSS + BEM            | Nomenclatura clara, CSS padrão       |
| [006](adr/ADR-006-stable-framework-versions.md) | Next.js 14 LTS        | Versoes estaveis em producao         |

---

## Links do Projeto

| Recurso           | Caminho                                                      |
| ----------------- | ------------------------------------------------------------ |
| README principal  | [../README.md](../README.md)                                 |
| Design System     | [../packages/design-system/](../packages/design-system/)     |
| Payments Module   | [../packages/payments-module/](../packages/payments-module/) |
| Admin Module      | [../packages/admin-module/](../packages/admin-module/)       |
| Types             | [../packages/types/](../packages/types/)                     |
| Shell (Next.js)   | [../apps/shell/](../apps/shell/)                             |
| Configs de Tenant | [../cms/tenants/](../cms/tenants/)                           |
