# ADR-005: SCSS com Metodologia BEM

## Status

Aceito

## Contexto

Precisavamos de uma metodologia CSS que fornecesse manutenibilidade, escalabilidade e colaboracao em equipe para nosso design system multi-tenant. A solucao de estilizacao precisava funcionar bem com CSS custom properties para theming enquanto mantinha o codebase organizado e previsivel.

Opcoes consideradas:

- **Tailwind CSS**: Framework CSS utility-first
- **CSS-in-JS** (styled-components, emotion): Geracao de CSS em runtime
- **SCSS + BEM**: CSS pre-compilado com convencao de nomenclatura

## Decisao

Uso **SCSS com BEM (Block Element Modifier)** para estilizacao de componentes.

## Justificativa

### Por que nao Tailwind CSS?

- **Explosao de classes**: Strings longas de className reduzem legibilidade
- **Curva de aprendizado**: Time precisa memorizar classes utilitarias
- **Complexidade de theming**: Design tokens customizados requerem configuracao
- **CSS output maior**: Inclui muitas utilities nao usadas em producao

### Por que nao CSS-in-JS?

- **Overhead em runtime**: Gera estilos em JavaScript em runtime
- **Complexidade de SSR**: Requer tratamento cuidadoso de hydration
- **Tamanho do bundle**: Adiciona peso de biblioteca em cada page load
- **Debug no DevTools**: Mais dificil inspecionar class names gerados

### Por que SCSS + BEM?

- **Zero runtime**: Compilado em build time, sem execucao de JavaScript
- **Previsibilidade**: Class names descrevem claramente proposito e relacionamentos
- **Sem guerras de especificidade**: Hierarquia de seletores plana evita conflitos
- **Padrao da industria**: Familiar para maioria dos desenvolvedores front-end
- **Suporte de IDE**: Excelente autocomplete e suporte a linting
- **Integracao com CSS Variables**: Funciona perfeitamente com nosso sistema de theming

## Consequencias

### Positivas

- **Nomenclatura clara**: Desenvolvedores entendem estrutura do componente pelos class names
- **Manutenibilidade**: Facil encontrar e modificar estilos
- **Sem custo runtime**: Melhor performance que CSS-in-JS
- **Escopo por CSS Modules**: Sem poluicao de namespace global
- **Funciona com CSS variables**: Suporta nosso theming multi-tenant

### Negativas

- **Verbosidade**: Class names podem ser mais longos que utility classes
- **Nomenclatura manual**: Requer disciplina para seguir convencoes
- **Sem estilos dinamicos**: Valores dinamicos complexos precisam de inline styles

## Breakpoints Responsivos

CSS custom properties nao podem ser usadas em media queries, entao uso SCSS mixins:

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
