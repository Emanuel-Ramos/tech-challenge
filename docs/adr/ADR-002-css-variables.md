# ADR-002: CSS Variables for Theming

## Status

Accepted

## Context

We need a theming system that allows runtime theme switching for multi-tenant white-labeling. Options considered:

- CSS-in-JS (styled-components, emotion)
- CSS Modules with static themes
- CSS Custom Properties (CSS Variables)

## Decision

I use **CSS Custom Properties (CSS Variables)** for theming.

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-background: #ffffff;
  --color-text: #171717;
  --border-radius: 0.5rem;
}
```

Theme switching is done via inline styles in ThemeProvider, which injects CSS variables into the wrapper element:

```tsx
// ThemeProvider.tsx
const cssVariables = generateCSSVariables(theme);
return <div style={cssVariables as React.CSSProperties}>{children}</div>;
```

This allows variables to be applied via SSR without depending on client-side JavaScript.

## Rationale

### Why CSS Variables?

- **Zero runtime JavaScript**: Theme changes don't trigger React re-renders
- **Native browser support**: No library needed
- **Instant switching**: Browser handles updates efficiently
- **SSR-friendly**: Variables can be injected server-side

## Consequences

### Positive

- Instant theme switching without JavaScript execution
- Smaller bundle
- Better performance (no style recalculation in JS)
- Works with any CSS methodology

### Negative

- Limited to values expressible in CSS (no complex logic)
- Legacy browser support requires fallbacks (IE11)

## Implementation

See `packages/design-system/src/tokens/` for token definitions.
See `packages/design-system/src/components/ThemeProvider/` for the provider.
