# Contributing

## Setup

```bash
# Requisitos
node >= 20
pnpm >= 9

# Instalacao
pnpm install

# Desenvolvimento
pnpm dev
```

## Estrutura do Projeto

```
apps/shell/          # Next.js SSR application
packages/
  design-system/     # Componentes compartilhados
  payments-module/   # Microfrontend de pagamentos
  types/             # TypeScript types compartilhados
cms/tenants/         # Configuracoes de tenant (JSON)
docs/                # Documentacao
```

## Comandos

| Comando          | Descricao                          |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Inicia servidor de desenvolvimento |
| `pnpm build`     | Build de producao                  |
| `pnpm test`      | Executa testes (watch mode)        |
| `pnpm test:run`  | Executa testes uma vez             |
| `pnpm lint`      | Verifica linting                   |
| `pnpm typecheck` | Verifica tipos TypeScript          |

---

## Git Workflow

### Branch Naming

Todas as branches devem seguir o padrao:

```
<tipo>/<descricao-curta>
```

| Tipo        | Uso                      | Exemplo                        |
| ----------- | ------------------------ | ------------------------------ |
| `feature/`  | Nova funcionalidade      | `feature/add-logout-button`    |
| `fix/`      | Correcao de bug          | `fix/tenant-cookie-expiration` |
| `refactor/` | Refatoracao de codigo    | `refactor/migrate-to-scss`     |
| `docs/`     | Apenas documentacao      | `docs/update-readme`           |
| `chore/`    | Tarefas de manutencao    | `chore/upgrade-dependencies`   |
| `hotfix/`   | Correcao urgente em prod | `hotfix/security-patch`        |

**Regras:**

- Use kebab-case (palavras separadas por hifen)
- Maximo 50 caracteres
- Sem caracteres especiais (exceto hifen)
- Sempre em ingles

**Exemplos:**

```bash
# Correto
git checkout -b feature/add-dark-mode
git checkout -b fix/button-loading-state
git checkout -b refactor/payments-dashboard

# Errado
git checkout -b addDarkMode          # sem tipo
git checkout -b feature/Add_Dark_Mode # underscore e maiusculas
git checkout -b feature/add-dark-mode-to-the-application-for-better-ux # muito longo
```

---

### Conventional Commits

Todos os commits devem seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descricao>

[corpo opcional]

[rodape opcional]
```

#### Tipos

| Tipo       | Quando usar                         | Exemplo                                  |
| ---------- | ----------------------------------- | ---------------------------------------- |
| `feat`     | Nova funcionalidade                 | `feat(button): add loading spinner`      |
| `fix`      | Correcao de bug                     | `fix(tenant): resolve cookie expiration` |
| `refactor` | Refatoracao sem mudar comportamento | `refactor(card): simplify class logic`   |
| `docs`     | Apenas documentacao                 | `docs: update contributing guide`        |
| `style`    | Formatacao (sem mudanca de logica)  | `style: fix indentation`                 |
| `test`     | Adicionar ou corrigir testes        | `test(button): add loading state tests`  |
| `chore`    | Tarefas de manutencao               | `chore: upgrade vitest to v2`            |
| `perf`     | Melhoria de performance             | `perf(chart): memoize calculations`      |
| `ci`       | Mudancas em CI/CD                   | `ci: add preview deployment`             |
| `build`    | Mudancas no build                   | `build: update turbo config`             |

#### Escopos

| Escopo          | Pacote                     |
| --------------- | -------------------------- |
| `shell`         | `apps/shell`               |
| `design-system` | `packages/design-system`   |
| `payments`      | `packages/payments-module` |
| `types`         | `packages/types`           |
| `deps`          | Dependencias               |
| (vazio)         | Mudancas globais           |

#### Regras da Mensagem

1. **Tipo**: obrigatorio, minusculo
2. **Escopo**: opcional, entre parenteses
3. **Descricao**: obrigatoria, imperativo, minuscula, sem ponto final
4. **Limite**: 72 caracteres na primeira linha

**Exemplos:**

```bash
# Correto
git commit -m "feat(button): add size variants"
git commit -m "fix(shell): resolve hydration mismatch"
git commit -m "docs: add accessibility section to readme"
git commit -m "refactor(payments): migrate styles to scss"

# Errado
git commit -m "Fixed bug"                    # sem tipo, passado
git commit -m "feat: Add new feature."       # maiuscula, ponto final
git commit -m "FEAT(BUTTON): ADD SIZES"      # maiusculas
git commit -m "feat(button): added sizes"    # passado ao inves de imperativo
```

---

### Git Hooks (Husky)

O projeto usa **Husky** para validar commits automaticamente:

| Hook         | Validacao                                |
| ------------ | ---------------------------------------- |
| `pre-commit` | Prettier nos arquivos staged             |
| `commit-msg` | Formato do commit (conventional commits) |

> **Nota:** ESLint é executado via `pnpm lint` (turbo) por pacote, não no pre-commit.

#### Como funciona

```bash
# Ao fazer commit, automaticamente:
# 1. pre-commit: roda lint-staged nos arquivos modificados
# 2. commit-msg: valida se a mensagem segue o padrao

git commit -m "feat(button): add hover effect"
# ✅ Passa - formato correto

git commit -m "added hover effect"
# ❌ Falha - formato incorreto
```

#### Bypass (apenas em emergencias)

```bash
# Pular hooks (NAO recomendado)
git commit --no-verify -m "emergency fix"
```

---

## Pull Requests

### Criando um PR

1. Crie uma branch a partir de `master`:

   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/my-feature
   ```

2. Faca commits seguindo o padrao

3. Garanta que todos os checks passam:

   ```bash
   pnpm build && pnpm test:run && pnpm lint
   ```

4. Push e abra o PR:
   ```bash
   git push -u origin feature/my-feature
   ```

### Titulo do PR

Siga o mesmo padrao de commits:

```
feat(design-system): add Card component
fix(shell): resolve tenant resolution bug
```

### Template de PR

```markdown
## Summary

- Bullet point describing change 1
- Bullet point describing change 2

## Test plan

- [ ] Step 1 to test
- [ ] Step 2 to test

## Checklist

- [ ] Tests passing
- [ ] Lint passing
- [ ] Build passing
- [ ] Documentation updated (if needed)
```

### Code Review

- Minimo 1 aprovacao
- Todos os checks devem passar
- Sem conflitos com master
- Squash merge preferido

---

## Boas Praticas

### Codigo

| Pratica                  | Descricao                           |
| ------------------------ | ----------------------------------- |
| **TypeScript strict**    | Sem `any`, tipos explicitos         |
| **Named exports**        | Preferir sobre default exports      |
| **Componentes pequenos** | Uma responsabilidade por componente |
| **BEM para CSS**         | Nomenclatura consistente            |
| **CSS Variables**        | Usar tokens do design system        |
| **Testes**               | Cobertura para novos componentes    |

### Commits

| Pratica        | Descricao                                   |
| -------------- | ------------------------------------------- |
| **Atomicos**   | Um commit = uma mudanca logica              |
| **Frequentes** | Commitar cedo e frequentemente              |
| **Revisaveis** | Cada commit deve ser revisavel isoladamente |
| **Sem WIP**    | Evitar "WIP", "fix", "update" genericos     |

### Branches

| Pratica                | Descricao                                  |
| ---------------------- | ------------------------------------------ |
| **Curta duracao**      | Branches devem viver no maximo alguns dias |
| **Atualizadas**        | Fazer rebase com master frequentemente     |
| **Deletar apos merge** | Manter repositorio limpo                   |

### PRs

| Pratica         | Descricao                                 |
| --------------- | ----------------------------------------- |
| **Pequenos**    | PRs menores = reviews mais rapidos        |
| **Descritivos** | Explicar o "porque", nao apenas o "o que" |
| **Screenshots** | Incluir para mudancas visuais             |
| **Testaveis**   | Passos claros para QA                     |

---

## Criando Componentes

Ver [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md) para padroes de codigo detalhados.

### Checklist de Novo Componente

- [ ] Arquivo `.tsx` com tipagem completa
- [ ] Arquivo `.module.scss` com BEM
- [ ] Props documentadas com JSDoc
- [ ] `aria-label` para elementos interativos
- [ ] Estados: loading, error, disabled
- [ ] Testes com `@testing-library/react`
- [ ] Export no `index.ts` do pacote

---

## Decisoes Arquiteturais

Todas as decisoes importantes estao documentadas em ADRs:

| ADR                                                      | Decisao                           |
| -------------------------------------------------------- | --------------------------------- |
| [ADR-001](docs/adr/ADR-001-tenant-resolution.md)         | Estrategia de Resolucao de Tenant |
| [ADR-002](docs/adr/ADR-002-css-variables.md)             | CSS Variables para theming        |
| [ADR-003](docs/adr/ADR-003-build-time-federation.md)     | Build-time federation             |
| [ADR-004](docs/adr/ADR-004-pages-router.md)              | Next.js Pages Router              |
| [ADR-005](docs/adr/ADR-005-scss-bem-methodology.md)      | SCSS + BEM                        |
| [ADR-006](docs/adr/ADR-006-stable-framework-versions.md) | Next.js 14 LTS (versoes estaveis) |

---

## Duvidas

- Consulte a documentacao em `/docs`
- Abra uma issue para discussao
- Pergunte no code review
