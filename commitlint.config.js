module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Tipo é obrigatorio e deve ser um dos listados
    "type-enum": [
      2,
      "always",
      [
        "feat", // Nova funcionalidade
        "fix", // Correcao de bug
        "docs", // Documentacao
        "style", // Formatacao (sem mudanca de logica)
        "refactor", // Refatoracao sem mudar comportamento
        "perf", // Melhoria de performance
        "test", // Testes
        "build", // Build e dependencias
        "ci", // CI/CD
        "chore", // Outras mudancas
        "revert", // Reverter commit anterior
      ],
    ],
    // Escopo é opcional, mas se presente deve ser minusculo
    "scope-case": [2, "always", "lower-case"],
    // Descricao em minusculo
    "subject-case": [2, "always", "lower-case"],
    // Sem ponto final na descricao
    "subject-full-stop": [2, "never", "."],
    // Maximo 72 caracteres no header
    "header-max-length": [2, "always", 72],
  },
};
