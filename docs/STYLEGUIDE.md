# Style Guide

## TypeScript

### Naming Conventions

| Type             | Convention  | Example                         |
| ---------------- | ----------- | ------------------------------- |
| Components       | PascalCase  | `Button`, `PaymentsDashboard`   |
| Functions        | camelCase   | `formatCurrency`, `handleClick` |
| Constants        | UPPER_SNAKE | `API_URL`, `MAX_RETRIES`        |
| Types/Interfaces | PascalCase  | `ButtonProps`, `TenantConfig`   |
| Component files  | PascalCase  | `Button.tsx`, `Card.tsx`        |
| Utility files    | camelCase   | `tenant.ts`, `formatters.ts`    |

### Interfaces vs Types

```typescript
// Interface for objects and props
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick?: () => void;
}

// Type for unions and aliases
type ButtonVariant = "primary" | "secondary" | "ghost";
type ID = string | number;
```

### Exports

```typescript
// Named exports (preferred)
export function Button() {}
export interface ButtonProps {}

// Avoid default exports
// export default Button  // NO
```

### Props

```typescript
// Destructure with default values
export function Button({ variant = "primary", size = "md", disabled = false }: ButtonProps) {
  // ...
}
```

## SCSS + BEM

### BEM Naming

```scss
// Block - standalone component
.button {
}

// Element - part of the component (__)
.button__icon {
}
.button__label {
}

// Modifier - variation (--)
.button--primary {
}
.button--large {
}
.button--disabled {
}
```

### SCSS File Structure

```scss
@use "@shipay/design-system/styles/breakpoints" as *;

.component {
  // Mobile-first properties
  display: flex;
  padding: var(--spacing-4);

  // Inline breakpoints (mobile-first)
  @include md {
    padding: var(--spacing-6);
  }

  // States
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

I use SCSS mixins for breakpoints. CSS custom properties **don't work** in media queries.

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

| Mixin         | Breakpoint | Usage            |
| ------------- | ---------- | ---------------- |
| `@include xs` | >= 480px   | Large mobile     |
| `@include sm` | >= 640px   | Tablet portrait  |
| `@include md` | >= 768px   | Tablet landscape |
| `@include lg` | >= 1024px  | Desktop          |
| `@include xl` | >= 1280px  | Large desktop    |

**Required import:**

```scss
// At the top of each .module.scss file
@use "@shipay/design-system/styles/breakpoints" as *;

// Inside design-system, use relative path:
@use "../../styles/breakpoints" as *;
```

### CSS Variables

```scss
// ALWAYS use design system tokens
.button {
  // Correct
  padding: var(--spacing-4);
  color: var(--color-text);
  border-radius: var(--border-radius);

  // Wrong - hardcoded values
  // padding: 16px;
  // color: #333;
}
```

### Available Tokens

```scss
// Colors
--color-primary
--color-secondary
--color-background
--color-text
--color-text-secondary
--color-error
--color-success

// Spacing
--spacing-1  // 0.25rem
--spacing-2  // 0.5rem
--spacing-4  // 1rem
--spacing-6  // 1.5rem
--spacing-8  // 2rem

// Typography
--font-size-sm
--font-size-base
--font-size-lg
--font-size-xl

// Others
--border-radius
--shadow-sm
--transition-fast
```

## React Components

### Folder Structure

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.scss
├── ComponentName.test.tsx    # if tests exist
└── index.ts                  # re-export (optional)
```

### Component Template

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

### Accessibility

```tsx
// Always include aria-labels on interactive elements
<button aria-label="Close modal">X</button>

// Use semantic roles
<div role="img" aria-label="Chart description">

// Loading states
<button aria-busy={loading} disabled={loading}>

// Focus visible for keyboard navigation
&:focus-visible {
  outline: 2px solid var(--color-primary);
}
```

## Tests

### Test Stack

| Tool                          | Usage                                     |
| ----------------------------- | ----------------------------------------- |
| **Vitest**                    | Test runner (Jest compatible)             |
| **@testing-library/react**    | Rendering and queries                     |
| **@testing-library/jest-dom** | Extra matchers (`toBeInTheDocument`, etc) |

### Generating Tests with Claude Code

Use the `/generate-tests` skill to automatically generate tests following project patterns:

```bash
# In Claude Code, run:
/generate-tests packages/design-system/src/components/Button/Button.tsx
```

The skill will:

1. Read the component and understand its props
2. Analyze existing test patterns in the project
3. Generate a complete `.test.tsx` file

### Running Tests

```bash
# Run all tests
pnpm test

# Run once (no watch)
pnpm test:run

# With coverage
pnpm test:coverage

# Visual interface
pnpm test:ui
```

### Test File Structure

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  describe("rendering", () => {
    it("renders correctly with required props", () => {
      render(<ComponentName title="Test" />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("applies primary variant by default", () => {
      render(<ComponentName />);
      const element = screen.getByRole("button");
      expect(element.className).toContain("primary");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("has correct aria-label", () => {
      render(<ComponentName aria-label="Action" />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Action");
    });
  });
});
```

### What to Test

| Category          | Examples                                      |
| ----------------- | --------------------------------------------- |
| **Rendering**     | Renders children, renders with optional props |
| **Variants**      | Applies correct BEM classes for each variant  |
| **States**        | Loading, disabled, error, empty               |
| **Interactions**  | onClick, onChange, onSubmit                   |
| **Accessibility** | aria-label, aria-busy, roles, focus           |

### Queries (order of preference)

```typescript
// 1. Accessible (prefer)
screen.getByRole("button", { name: "Submit" });
screen.getByLabelText("Email");
screen.getByText("Hello");

// 2. Semantic
screen.getByAltText("Logo");
screen.getByTitle("Tooltip");

// 3. Test IDs (last resort)
screen.getByTestId("custom-element");
```

### Testing BEM Classes (CSS Modules)

CSS Modules generate names like `_button_abc123`. Use `toContain`:

```typescript
// Correct
expect(element.className).toContain("button--primary");

// Wrong (doesn't work with CSS Modules)
expect(element).toHaveClass("button--primary");
```

### Mocks

```typescript
// Function mock
const handleClick = vi.fn();

// Module mock
vi.mock("@/lib/api", () => ({
  fetchData: vi.fn().mockResolvedValue({ data: [] }),
}));

// Clear mocks between tests
afterEach(() => {
  vi.clearAllMocks();
});
```

## Imports

### Order

```typescript
// 1. React/Next
import { useState } from "react";
import Image from "next/image";

// 2. External libraries
import { format } from "date-fns";

// 3. Internal packages
import { Button, Card } from "@shipay/design-system";
import type { TenantConfig } from "@shipay/types";

// 4. Relative imports
import { Header } from "@/components/Header";
import styles from "./Component.module.scss";
```

## Git

### Branches

```
feature/feature-name
fix/bug-description
refactor/refactored-area
```

## PR Checklist

- [ ] `pnpm build` passes
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] No `console.log` in production
- [ ] Props correctly typed
- [ ] Accessibility verified
- [ ] BEM applied to styles
- [ ] Using CSS variables (no hardcoded values)
