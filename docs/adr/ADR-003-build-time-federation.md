# ADR-003: Arquitetura de Microfrontends com Build-Time Federation

## Status

Aceito

## Contexto

### O Problema

O desafio requer uma arquitetura que suporte **multiplos times** desenvolvendo modulos independentes (microfrontends) para um painel administrativo multi-tenant. Cada time seria responsavel por uma area funcional:

- **Time de Pagamentos**: Dashboard de transacoes, relatorios
- **Time de Usuarios**: Gestao de contas, permissoes
- **Time de Configuracoes**: Editor de tema, CMS

### Requisitos

1. **Isolamento**: Cada modulo deve ser desenvolvido de forma independente
2. **Consistencia**: Todos os modulos devem usar o mesmo design system
3. **Type Safety**: Interfaces compartilhadas entre modulos
4. **Escalabilidade**: Facilitar adicao de novos modulos/times

### Opcoes Consideradas

| Opcao                    | Deploy       | Complexidade | Type Safety |
| ------------------------ | ------------ | ------------ | ----------- |
| Monorepo + Build-time    | Atomico      | Baixa        | Total       |
| Multi-repo + Module Fed. | Independente | Alta         | Parcial     |
| Monorepo + Runtime Fed.  | Independente | Media        | Parcial     |

---

## Decisao

Adotei **Monorepo com Build-Time Federation** usando pnpm workspaces + Turborepo.

### Decisao para MVP, sem over-engineering

Esta decisao foi tomada especificamente para o contexto de um **MVP**. Implementar Module Federation desde o inicio seria over-engineering para um projeto que ainda nao tem:

- Multiplos times trabalhando em paralelo
- Necessidade de deploy independente
- Escala que justifique a complexidade adicional

**Se o projeto escalar, o ideal e migrar para Module Federation** — e a arquitetura atual foi desenhada para facilitar essa transicao. Os modulos ja estao isolados em packages independentes, os contratos ja estao definidos em `@shipay/types`, e o design system ja e consumido como dependencia externa.

A ideia e: **comecar simples, escalar quando necessario**.

---

## Justificativas Tecnicas

### Por que pnpm?

| Caracteristica         | pnpm                | npm/yarn       |
| ---------------------- | ------------------- | -------------- |
| Instalacao             | Hard links (rapido) | Copias (lento) |
| Dependencias fantasma  | Bloqueadas          | Permitidas     |
| Protocolo de workspace | `workspace:*`       | `*` ou `link:` |
| Uso de disco           | Compartilhado       | Duplicado      |

### Por que Turborepo?

1. **Cache Inteligente**: Nao rebuilda packages que nao mudaram
2. **Paralelizacao**: Roda tasks em paralelo quando possivel
3. **Ordem Topologica**: Respeita dependencias entre packages

### Por que Build-Time (vs Runtime)?

| Aspecto        | Build-Time          | Runtime (Module Fed.)     |
| -------------- | ------------------- | ------------------------- |
| Type Safety    | 100% (compile time) | Parcial (runtime)         |
| Performance    | Bundle otimizado    | Requests extras           |
| Complexidade   | Baixa               | Alta                      |
| Deploy         | Atomico             | Independente              |
| Falhas de rede | Impossivel          | Possivel                  |
| Stacks         | Apenas React        | React, Vue, Angular, etc. |

---

## Consequencias

### Positivas

- **Simplicidade**: Um repo, um CI/CD, um deploy
- **Type Safety Total**: Erros de interface detectados em build
- **Refactoring Seguro**: Mudancas propagam automaticamente
- **DX Excelente**: `pnpm install` e `pnpm dev` funcionam imediatamente
- **Performance**: Bundle otimizado, sem overhead de runtime

### Negativas

- **Deploy Atomico**: Todos os modulos deployam juntos
- **Build Completo**: Mudanca em types rebuilda todos os dependentes
- **Escalabilidade de Time**: Mais de ~10 devs pode gerar conflitos de merge
- **Stack Unica**: Todos os modulos precisam usar React nao e possivel ter um microfrontend em Vue ou Angular, pois tudo e buildado junto pelo Next.js. Com Module Federation em runtime, cada microfrontend pode usar sua propria stack.

### Mitigacoes

- **CODEOWNERS**: Definir owners por diretorio para code review
- **Feature Flags**: Desacoplar deploy de release
- **Trunk-Based Development**: Branches curtas, merge frequente

---

## Migracao para Module Federation (Quando Escalar)

**Module Federation e a solucao ideal para projetos em escala** com multiplos times e necessidade de deploy independente. A arquitetura atual foi desenhada para facilitar essa migracao — quando o projeto crescer, a transicao sera simples porque tudo ja esta preparado.

### Por que a migracao e facil?

1. **Contratos ja definidos**: As interfaces em `@shipay/types` funcionam como contratos entre modulos
2. **Modulos isolados**: Cada package ja e independente (`@shipay/payments-module`, `@shipay/admin-module`)
3. **Design system compartilhado**: `@shipay/design-system` ja e consumido como dependencia externa

### O que muda

| Aspecto     | Atual (Build-time)                     | Futuro (Runtime)                       |
| ----------- | -------------------------------------- | -------------------------------------- |
| Import      | `import { X } from "@shipay/payments"` | `const X = await import("payments/X")` |
| Bundle      | Tudo junto no build do shell           | Cada modulo em URL separada            |
| Deploy      | Um deploy para tudo                    | Cada modulo deploya independente       |
| Repositorio | Monorepo unico                         | Multi-repo (opcional)                  |

### Passos da migracao

```
1. Publicar @shipay/types e @shipay/design-system no npm (ou registry privado)

2. Extrair modulo para repo separado:
   - git clone payments-module
   - npm install @shipay/design-system @shipay/types

3. Configurar Module Federation no modulo:
   - exposes: { "./PaymentsDashboard": "./src/PaymentsDashboard" }
   - shared: ["react", "@shipay/design-system"]

4. Configurar Shell para consumir remoto:
   - remotes: { payments: "payments@https://cdn.exemplo.com/remoteEntry.js" }

5. Trocar import estatico por dinamico:
   - antes: import { PaymentsDashboard } from "@shipay/payments-module"
   - depois: const { PaymentsDashboard } = await import("payments/PaymentsDashboard")
```

### O que permanece igual

- **Interfaces TypeScript**: Continuam em `@shipay/types`
- **Design System**: Continua compartilhado via `@shipay/design-system`
- **Estrutura dos componentes**: Codigo interno dos modulos nao muda
- **API dos componentes**: Props e comportamento permanecem identicos

---

## Resumo

| Fase do Projeto | Arquitetura Recomendada | Motivo                                          |
| --------------- | ----------------------- | ----------------------------------------------- |
| **MVP**         | Build-time (atual)      | Simplicidade, type safety, sem over-engineering |
| **Escala**      | Module Federation       | Deploy independente, times autonomos            |

A decisao atual prioriza **entregar valor rapido** sem complexidade desnecessaria. Quando a escala justificar, a migracao para Module Federation pode ser feita de forma incremental, modulo por modulo, sem reescrever o codigo existente.

---
