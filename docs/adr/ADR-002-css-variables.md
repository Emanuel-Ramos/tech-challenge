# ADR-002: CSS Variables para Theming

## Status

Accepted

## Contexto

Precisamos de um sistema de temas que permita troca de tema em runtime para white-labeling multi-tenant. Opcoes consideradas:

- CSS-in-JS (styled-components, emotion)
- CSS Modules com temas estaticos
- CSS Custom Properties (CSS Variables)

## Decisao

Uso **CSS Custom Properties (CSS Variables)** para theming.

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-background: #ffffff;
  --color-text: #171717;
  --border-radius: 0.5rem;
}
```

A troca de tema e feita atualizando CSS variables no elemento document:

```typescript
document.documentElement.style.setProperty("--color-primary", "#newColor");
```

## Justificativa

### Por que nao CSS-in-JS?

- **Overhead em runtime**: Gera estilos em JavaScript
- **Complexidade de SSR**: Requer tratamento cuidadoso de hydration
- **Tamanho do bundle**: Adiciona peso de biblioteca em cada pagina

### Por que CSS Variables?

- **Zero runtime JavaScript**: Mudancas de tema nao disparam re-renders do React
- **Suporte nativo do browser**: Nenhuma biblioteca necessaria
- **Troca instantanea**: Browser trata atualizacoes eficientemente
- **SSR-friendly**: Variables podem ser injetadas server-side

## Consequencias

### Positivas

- Troca de tema instantanea sem execucao de JavaScript
- Bundle menor
- Melhor performance (sem recalculo de estilos em JS)
- Funciona com qualquer metodologia CSS

### Negativas

- Limitado a valores expressaveis em CSS (sem logica complexa)
- Suporte a browsers antigos requer fallbacks (IE11)

## Implementacao

Veja `packages/design-system/src/tokens/` para definicoes de tokens.
Veja `packages/design-system/src/components/ThemeProvider/` para o provider.
