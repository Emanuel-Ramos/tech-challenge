---
name: generate-tests
description: Generate unit tests for components following project patterns (Vitest + RTL + BEM)
argument-hint: [file-path]
allowed-tools: Read, Grep, Write, Glob
---

# Generate Tests Skill

Generate comprehensive unit tests for React components following the project's established patterns.

## Project Context

- **Framework**: React 18 with TypeScript
- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **Styling**: SCSS with BEM methodology (CSS Modules)
- **Design System**: @shipay/design-system with @shipay/types

## Instructions

1. **Read the component file** at the provided path
2. **Analyze the component** to understand:
   - Props interface (check @shipay/types if imported)
   - Variants and modifiers (BEM classes)
   - Event handlers
   - Conditional rendering
   - Accessibility attributes
3. **Search for similar test files** in the project for patterns:
   ```
   packages/design-system/src/components/Button/Button.test.tsx
   packages/design-system/src/components/Chart/Chart.test.tsx
   ```
4. **Generate the test file** following the template below

## Test File Template

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  describe("rendering", () => {
    it("renders correctly with required props", () => {
      // Test basic rendering
    });

    it("renders children correctly", () => {
      // Test children prop if applicable
    });
  });

  describe("variants", () => {
    // Test each variant/modifier
  });

  describe("states", () => {
    // Test loading, disabled, error states
  });

  describe("interactions", () => {
    // Test onClick, onChange, etc.
  });

  describe("accessibility", () => {
    it("has correct ARIA attributes", () => {
      // Test aria-label, aria-busy, roles
    });

    it("can be focused", () => {
      // Test keyboard accessibility
    });
  });
});
```

## Conventions

1. **Test file location**: Same directory as component, named `ComponentName.test.tsx`
2. **Describe blocks**: Group by behavior category
3. **BEM class testing**: Use `toContain()` for modifier classes
4. **Mock functions**: Use `vi.fn()` from Vitest
5. **Queries**: Prefer `getByRole`, `getByText`, `getByLabelText`
6. **Assertions**: Use `@testing-library/jest-dom` matchers

## Example Output

For a Card component:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      render(<Card>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(<Card title="Card Title">Content</Card>);
      expect(screen.getByRole("heading", { name: "Card Title" })).toBeInTheDocument();
    });

    it("does not render title when not provided", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies custom className", () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});
```
