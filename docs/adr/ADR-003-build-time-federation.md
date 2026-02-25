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

**Se o projeto escalar, o ideal e migrar para Module Federation** e a arquitetura atual foi desenhada para facilitar essa transicao. Os modulos ja estao isolados em packages independentes, os contratos ja estao definidos em `@shipay/types`, e o design system ja e consumido como dependencia externa.

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

## Quando usar Module Federation

Module Federation seria a escolha ideal para este projeto se:

| Cenario                                   | Por que Module Federation                                   |
| ----------------------------------------- | ----------------------------------------------------------- |
| **+3 times desenvolvendo em paralelo**    | Cada time deploya independente, sem esperar outros          |
| **Releases frequentes e desacopladas**    | Time A pode fazer hotfix sem rebuildar modulos B e C        |
| **Modulos com ciclos de vida diferentes** | Pagamentos atualiza diariamente, Admin atualiza mensalmente |
| **Necessidade de rollback granular**      | Reverter apenas o modulo com problema                       |
| **Stacks diferentes por modulo**          | Um time quer usar Vue, outro React                          |

### Custo real da migracao

A migracao de build-time para runtime federation **nao e trivial**:

| Aspecto                          | Complexidade                                                     |
| -------------------------------- | ---------------------------------------------------------------- |
| **Versionamento de shared deps** | React, design-system - garantir mesma versao em todos os remotes |
| **Error boundaries**             | Cada modulo remoto pode falhar independentemente                 |
| **Loading states**               | UI precisa lidar com modulos carregando async                    |
| **Testes de integracao**         | Como testar shell + modulos remotos? Mocks? Staging?             |
| **CI/CD**                        | Pipeline separado por modulo + orquestracao de releases          |
| **Debugging**                    | Stack traces cruzam boundaries de rede                           |

### Por que nao usamos agora

Para um MVP com 1-2 desenvolvedores, Module Federation adiciona complexidade sem beneficio:

- Nao ha times paralelos
- Nao ha necessidade de deploy independente
- O custo de setup e manutencao nao se paga

**A decisao correta e comecar simples.** Quando a escala justificar, a migracao tera custo, mas comecar com essa complexidade agora seria desperdicio.
