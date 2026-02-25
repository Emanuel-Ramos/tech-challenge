# Guia de Estilo

## TypeScript

### Nomenclatura

| Tipo                | Convencao   | Exemplo                         |
| ------------------- | ----------- | ------------------------------- |
| Componentes         | PascalCase  | `Button`, `PaymentsDashboard`   |
| Funcoes             | camelCase   | `formatCurrency`, `handleClick` |
| Constantes          | UPPER_SNAKE | `API_URL`, `MAX_RETRIES`        |
| Tipos/Interfaces    | PascalCase  | `ButtonProps`, `TenantConfig`   |
| Arquivos componente | PascalCase  | `Button.tsx`, `Card.tsx`        |
| Arquivos util       | camelCase   | `tenant.ts`, `formatters.ts`    |

### Interfaces vs Types

```typescript
// Interface para objetos e props
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick?: () => void;
}

// Type para unions e aliases
type ButtonVariant = "primary" | "secondary" | "ghost";
type ID = string | number;
```

### Exports

```typescript
// Named exports (preferido)
export function Button() {}
export interface ButtonProps {}

// Evitar default exports
// export default Button  // NAO
```

### Props

```typescript
// Desestruturar com valores default
export function Button({ variant = "primary", size = "md", disabled = false }: ButtonProps) {
  // ...
}
```

## SCSS + BEM

### Nomenclatura BEM

```scss
// Block - componente standalone
.button {
}

// Element - parte do componente (__)
.button__icon {
}
.button__label {
}

// Modifier - variacao (--)
.button--primary {
}
.button--large {
}
.button--disabled {
}
```

### Estrutura do Arquivo SCSS

```scss
@use "@shipay/design-system/styles/breakpoints" as *;

.component {
  // Propriedades mobile-first
  display: flex;
  padding: var(--spacing-4);

  // Breakpoints inline (mobile-first)
  @include md {
    padding: var(--spacing-6);
  }

  // Estados
  &:hover {
  }
  &:focus-visible {
  }

  // Modifiers
  &--variant {
  }

  // Elements
  &__child {
    font-size: var(--font-size-sm);

    @include md {
      font-size: var(--font-size-base);
    }
  }
}
```

### Breakpoints (Mobile-First)

Uso SCSS mixins para breakpoints. CSS custom properties **nao funcionam** em media queries.

```scss
@use "@shipay/design-system/styles/breakpoints" as *;

.component {
  // Mobile (default)
  padding: var(--spacing-4);

  @include xs {
    // >= 480px
    padding: var(--spacing-5);
  }

  @include sm {
    // >= 640px
    padding: var(--spacing-6);
  }

  @include md {
    // >= 768px
    padding: var(--spacing-8);
  }

  @include lg {
    // >= 1024px
    padding: var(--spacing-10);
  }

  @include xl {
    // >= 1280px
    padding: var(--spacing-12);
  }
}
```

| Mixin         | Breakpoint | Uso              |
| ------------- | ---------- | ---------------- |
| `@include xs` | >= 480px   | Mobile grande    |
| `@include sm` | >= 640px   | Tablet portrait  |
| `@include md` | >= 768px   | Tablet landscape |
| `@include lg` | >= 1024px  | Desktop          |
| `@include xl` | >= 1280px  | Desktop grande   |

**Import obrigatorio:**

```scss
// No topo de cada arquivo .module.scss
@use "@shipay/design-system/styles/breakpoints" as *;

// Dentro do design-system, use caminho relativo:
@use "../../styles/breakpoints" as *;
```

### CSS Variables

```scss
// SEMPRE usar tokens do design system
.button {
  // Correto
  padding: var(--spacing-4);
  color: var(--color-text);
  border-radius: var(--border-radius);

  // Errado - valores hardcoded
  // padding: 16px;
  // color: #333;
}
```

### Tokens Disponiveis

```scss
// Cores
--color-primary
--color-secondary
--color-background
--color-text
--color-text-secondary
--color-error
--color-success

// Espacamento
--spacing-1  // 0.25rem
--spacing-2  // 0.5rem
--spacing-4  // 1rem
--spacing-6  // 1.5rem
--spacing-8  // 2rem

// Tipografia
--font-size-sm
--font-size-base
--font-size-lg
--font-size-xl

// Outros
--border-radius
--shadow-sm
--transition-fast
```

## Componentes React

### Estrutura de Pasta

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.scss
├── ComponentName.test.tsx    # se houver testes
└── index.ts                  # re-export (opcional)
```

### Template de Componente

```tsx
import styles from "./ComponentName.module.scss";

interface ComponentNameProps {
  title: string;
  variant?: "primary" | "secondary";
}

export function ComponentName({ title, variant = "primary" }: ComponentNameProps) {
  const classNames = [styles.component, styles[`component--${variant}`]].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      <h2 className={styles["component__title"]}>{title}</h2>
    </div>
  );
}
```

### Acessibilidade

```tsx
// Sempre incluir aria-labels em elementos interativos
<button aria-label="Fechar modal">X</button>

// Usar roles semanticos
<div role="img" aria-label="Descricao do grafico">

// Estados de loading
<button aria-busy={loading} disabled={loading}>

// Focus visible para navegacao por teclado
&:focus-visible {
  outline: 2px solid var(--color-primary);
}
```

## Testes

### Stack de Testes

| Ferramenta                    | Uso                                        |
| ----------------------------- | ------------------------------------------ |
| **Vitest**                    | Test runner (compativel com Jest)          |
| **@testing-library/react**    | Renderizacao e queries                     |
| **@testing-library/jest-dom** | Matchers extras (`toBeInTheDocument`, etc) |

### Gerando Testes com Claude Code

Use a skill `/generate-tests` para gerar testes automaticamente seguindo os padroes do projeto:

```bash
# No Claude Code, execute:
/generate-tests packages/design-system/src/components/Button/Button.tsx
```

A skill ira:

1. Ler o componente e entender suas props
2. Analisar padroes de testes existentes no projeto
3. Gerar um arquivo `.test.tsx` completo

### Rodando Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar uma vez (sem watch)
pnpm test:run

# Com coverage
pnpm test:coverage

# Interface visual
pnpm test:ui
```

### Estrutura do Arquivo de Teste

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  describe("renderizacao", () => {
    it("renderiza corretamente com props obrigatorias", () => {
      render(<ComponentName title="Test" />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("variantes", () => {
    it("aplica variante primary por padrao", () => {
      render(<ComponentName />);
      const element = screen.getByRole("button");
      expect(element.className).toContain("primary");
    });
  });

  describe("interacoes", () => {
    it("chama onClick quando clicado", () => {
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("acessibilidade", () => {
    it("tem aria-label correto", () => {
      render(<ComponentName aria-label="Acao" />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Acao");
    });
  });
});
```

### O que testar

| Categoria          | Exemplos                                          |
| ------------------ | ------------------------------------------------- |
| **Renderizacao**   | Renderiza children, renderiza com props opcionais |
| **Variantes**      | Aplica classes BEM corretas para cada variante    |
| **Estados**        | Loading, disabled, error, empty                   |
| **Interacoes**     | onClick, onChange, onSubmit                       |
| **Acessibilidade** | aria-label, aria-busy, roles, focus               |

### Queries (ordem de preferencia)

```typescript
// 1. Acessiveis (preferir)
screen.getByRole("button", { name: "Enviar" });
screen.getByLabelText("Email");
screen.getByText("Ola");

// 2. Semanticas
screen.getByAltText("Logo");
screen.getByTitle("Tooltip");

// 3. Test IDs (ultimo recurso)
screen.getByTestId("custom-element");
```

### Testando Classes BEM (CSS Modules)

CSS Modules geram nomes como `_button_abc123`. Use `toContain`:

```typescript
// Correto
expect(element.className).toContain("button--primary");

// Errado (nao funciona com CSS Modules)
expect(element).toHaveClass("button--primary");
```

### Mocks

```typescript
// Mock de funcao
const handleClick = vi.fn();

// Mock de modulo
vi.mock("@/lib/api", () => ({
  fetchData: vi.fn().mockResolvedValue({ data: [] }),
}));

// Limpar mocks entre testes
afterEach(() => {
  vi.clearAllMocks();
});
```

## Imports

### Ordem

```typescript
// 1. React/Next
import { useState } from "react";
import Image from "next/image";

// 2. Bibliotecas externas
import { format } from "date-fns";

// 3. Packages internos
import { Button, Card } from "@shipay/design-system";
import type { TenantConfig } from "@shipay/types";

// 4. Imports relativos
import { Header } from "@/components/Header";
import styles from "./Component.module.scss";
```

## Git

### Branches

```
feature/nome-da-feature
fix/descricao-do-bug
refactor/area-refatorada
```

## Checklist antes do PR

- [ ] `pnpm build` passa
- [ ] `pnpm test` passa
- [ ] `pnpm lint` passa
- [ ] Sem `console.log` em producao
- [ ] Props tipadas corretamente
- [ ] Acessibilidade verificada
- [ ] BEM aplicado nos estilos
- [ ] Usando CSS variables (sem valores hardcoded)
