# ADR-005: SCSS with BEM Methodology

## Status

Accepted

## Context

We needed a CSS methodology that provides maintainability, scalability, and team collaboration for our multi-tenant design system. The styling solution needed to work well with CSS custom properties for theming while keeping the codebase organized and predictable.

Options considered:

- **Tailwind CSS**: Utility-first CSS framework
- **CSS-in-JS** (styled-components, emotion): Runtime CSS generation
- **SCSS + BEM**: Pre-compiled CSS with naming convention

## Decision

I use **SCSS with BEM (Block Element Modifier)** for component styling.

## Rationale

### Why Not Tailwind CSS?

- **Class explosion**: Long className strings reduce readability
- **Learning curve**: Team needs to memorize utility classes
- **Theming complexity**: Custom design tokens require configuration
- **Larger CSS output**: Includes many unused utilities in production

### Why Not CSS-in-JS?

See [ADR-002](ADR-002-css-variables.md) for detailed rationale.

### Why SCSS + BEM?

- **Zero runtime**: Compiled at build time, no JavaScript execution
- **Predictability**: Class names clearly describe purpose and relationships
- **No specificity wars**: Flat selector hierarchy avoids conflicts
- **Industry standard**: Familiar to most front-end developers
- **IDE support**: Excellent autocomplete and linting support
- **CSS Variables integration**: Works perfectly with our theming system

## Consequences

### Positive

- **Clear naming**: Developers understand component structure from class names
- **Maintainability**: Easy to find and modify styles
- **No runtime cost**: Better performance than CSS-in-JS
- **Scoped by CSS Modules**: No global namespace pollution
- **Works with CSS variables**: Supports our multi-tenant theming

### Negative

- **Verbosity**: Class names can be longer than utility classes
- **Manual naming**: Requires discipline to follow conventions
- **No dynamic styles**: Complex dynamic values need inline styles

## Responsive Breakpoints

CSS custom properties cannot be used in media queries, so I use SCSS mixins:

```scss
@use "@shipay/design-system/styles/breakpoints" as *;

.card {
  padding: var(--spacing-4);

  @include md {
    padding: var(--spacing-6);
  }

  @include lg {
    padding: var(--spacing-8);
  }
}
```

| Mixin         | Breakpoint |
| ------------- | ---------- |
| `@include xs` | >= 480px   |
| `@include sm` | >= 640px   |
| `@include md` | >= 768px   |
| `@include lg` | >= 1024px  |
| `@include xl` | >= 1280px  |
