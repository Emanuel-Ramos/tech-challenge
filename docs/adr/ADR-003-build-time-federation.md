# ADR-003: Monorepo com Turborepo (MVP) → Multi-Repo (Futuro)

## Status

Accepted

## Context

O desafio requer uma arquitetura que suporte **múltiplos times** desenvolvendo módulos independentes.

Opções consideradas:

- **Monorepo com Turborepo** - Build inteligente, cache, mas deploy atômico
- **Multi-repo com Module Federation** - Deploy independente, mas complexidade alta
- **Híbrido** - Monorepo agora, preparado para migrar

## Decision

Adotei uma **estrategia em fases**:

1. **MVP (Atual)**: Monorepo com pnpm workspaces + Turborepo
2. **Futuro**: Migração para multi-repo com contratos estáveis

A migração para multi-repo pode ser feita quando necessário, seguindo os contratos estabelecidos.

### Estrutura

```
tech-challenge-shipay/
├── apps/
│   └── shell/              # Next.js SSR application
├── packages/
│   ├── design-system/      # Componentes UI compartilhados
│   ├── payments-module/    # Módulo de pagamentos
│   └── types/              # TypeScript types compartilhados
└── cms/
    └── tenants/            # Configurações de tenant
```

### Integração entre Packages

```typescript
// Shell importa diretamente dos packages
import { Button, Card, ThemeProvider } from "@shipay/design-system";
import { PaymentsDashboard } from "@shipay/payments-module";

// Paginas usam componentes diretamente
export default function Home({ tenant }) {
  return (
    <ThemeProvider theme={tenant.theme}>
      <Header logo={tenant.logo} />
      <PaymentsDashboard data={payments} />
      <Footer />
    </ThemeProvider>
  );
}
```

## Rationale

### Por que Monorepo?

1. **Coesão**: Todos os packages versionados juntos
2. **Type Safety**: TypeScript compartilhado entre packages
3. **DX**: Um único `pnpm install`, um único repo para clonar
4. **Refactoring**: Mudanças em types propagam automaticamente

### Por que pnpm workspaces?

1. **Performance**: Instalação mais rápida com hard links
2. **Strict**: Previne phantom dependencies
3. **Workspace protocol**: `workspace:*` garante versões locais

### Por que Build-Time Integration?

1. **Simplicidade**: Sem overhead de carregamento dinâmico
2. **Performance**: Bundle otimizado pelo Next.js
3. **Confiabilidade**: Sem falhas de rede em runtime
4. **Tree-shaking**: Código não usado é removido

## Consequences

### Positive

- Setup simples e direto
- TypeScript funciona perfeitamente entre packages
- CI/CD único para todo o projeto
- Sem complexidade de versionamento de APIs remotas

### Negative

- Deploy atômico (todos os packages juntos)
- Build completo a cada mudança

## Alternativas Descartadas

### Runtime Module Federation

- Adiciona complexidade de infraestrutura
- Requer gestão de versões de APIs remotas
- Overhead de carregamento em runtime
- **Útil quando**: Times diferentes precisam deploy independente

### Multi-repo

- Dificulta refactoring cross-package
- Complexidade de publicação npm
- **Útil quando**: Packages são consumidos por projetos externos
