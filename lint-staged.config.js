module.exports = {
  // TypeScript e JavaScript - apenas prettier (ESLint roda via turbo lint)
  "*.{ts,tsx,js,jsx}": ["prettier --write"],

  // SCSS
  "*.scss": ["prettier --write"],

  // JSON e Markdown
  "*.{json,md}": ["prettier --write"],
};
