# Contributing

## Setup

```bash
# Requirements
node >= 20
pnpm >= 9

# Installation
pnpm install

# Development
pnpm dev
```

## Project Structure

```
apps/shell/          # Next.js SSR application
packages/
  design-system/     # Shared components
  payments-module/   # Payments microfrontend
  types/             # Shared TypeScript types
cms/tenants/         # Tenant configurations (JSON)
docs/                # Documentation
```

## Commands

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Production build         |
| `pnpm test`      | Run tests (watch mode)   |
| `pnpm test:run`  | Run tests once           |
| `pnpm lint`      | Check linting            |
| `pnpm typecheck` | Check TypeScript types   |

---

## Git Workflow

### Branch Naming

All branches must follow the pattern:

```
<type>/<short-description>
```

| Type        | Usage              | Example                        |
| ----------- | ------------------ | ------------------------------ |
| `feature/`  | New feature        | `feature/add-logout-button`    |
| `fix/`      | Bug fix            | `fix/tenant-cookie-expiration` |
| `refactor/` | Code refactoring   | `refactor/migrate-to-scss`     |
| `docs/`     | Documentation only | `docs/update-readme`           |
| `chore/`    | Maintenance tasks  | `chore/upgrade-dependencies`   |
| `hotfix/`   | Urgent prod fix    | `hotfix/security-patch`        |

**Rules:**

- Use kebab-case (words separated by hyphens)
- Maximum 50 characters
- No special characters (except hyphens)
- Always in English

**Examples:**

```bash
# Correct
git checkout -b feature/add-dark-mode
git checkout -b fix/button-loading-state
git checkout -b refactor/payments-dashboard

# Wrong
git checkout -b addDarkMode          # no type
git checkout -b feature/Add_Dark_Mode # underscore and uppercase
git checkout -b feature/add-dark-mode-to-the-application-for-better-ux # too long
```

---

### Conventional Commits

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Type       | When to use                         | Example                                  |
| ---------- | ----------------------------------- | ---------------------------------------- |
| `feat`     | New feature                         | `feat(button): add loading spinner`      |
| `fix`      | Bug fix                             | `fix(tenant): resolve cookie expiration` |
| `refactor` | Refactoring without behavior change | `refactor(card): simplify class logic`   |
| `docs`     | Documentation only                  | `docs: update contributing guide`        |
| `style`    | Formatting (no logic change)        | `style: fix indentation`                 |
| `test`     | Add or fix tests                    | `test(button): add loading state tests`  |
| `chore`    | Maintenance tasks                   | `chore: upgrade vitest to v2`            |
| `perf`     | Performance improvement             | `perf(chart): memoize calculations`      |
| `ci`       | CI/CD changes                       | `ci: add preview deployment`             |
| `build`    | Build changes                       | `build: update turbo config`             |

#### Scopes

| Scope           | Package                    |
| --------------- | -------------------------- |
| `shell`         | `apps/shell`               |
| `design-system` | `packages/design-system`   |
| `payments`      | `packages/payments-module` |
| `types`         | `packages/types`           |
| `deps`          | Dependencies               |
| (empty)         | Global changes             |

#### Message Rules

1. **Type**: required, lowercase
2. **Scope**: optional, in parentheses
3. **Description**: required, imperative, lowercase, no period at end
4. **Limit**: 72 characters on first line

**Examples:**

```bash
# Correct
git commit -m "feat(button): add size variants"
git commit -m "fix(shell): resolve hydration mismatch"
git commit -m "docs: add accessibility section to readme"
git commit -m "refactor(payments): migrate styles to scss"

# Wrong
git commit -m "Fixed bug"                    # no type, past tense
git commit -m "feat: Add new feature."       # uppercase, period
git commit -m "FEAT(BUTTON): ADD SIZES"      # all uppercase
git commit -m "feat(button): added sizes"    # past tense instead of imperative
```

---

### Git Hooks (Husky)

The project uses **Husky** to validate commits automatically:

| Hook         | Validation                           |
| ------------ | ------------------------------------ |
| `pre-commit` | Prettier on staged files             |
| `commit-msg` | Commit format (conventional commits) |

> **Note:** ESLint is run via `pnpm lint` (turbo) per package, not in pre-commit.

#### How It Works

```bash
# When committing, automatically:
# 1. pre-commit: runs lint-staged on modified files
# 2. commit-msg: validates message format

git commit -m "feat(button): add hover effect"
# ✅ Passes - correct format

git commit -m "added hover effect"
# ❌ Fails - incorrect format
```

#### Bypass (emergencies only)

```bash
# Skip hooks (NOT recommended)
git commit --no-verify -m "emergency fix"
```

---

## Pull Requests

### Creating a PR

1. Create a branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/my-feature
   ```

2. Make commits following the standard

3. Ensure all checks pass:

   ```bash
   pnpm build && pnpm test:run && pnpm lint
   ```

4. Push and open the PR:
   ```bash
   git push -u origin feature/my-feature
   ```

### PR Title

Follow the same commit pattern:

```
feat(design-system): add Card component
fix(shell): resolve tenant resolution bug
```

### PR Template

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

- Minimum 1 approval
- All checks must pass
- No conflicts with main
- Squash merge preferred

---

## Best Practices

### Code

| Practice              | Description                      |
| --------------------- | -------------------------------- |
| **TypeScript strict** | No `any`, explicit types         |
| **Named exports**     | Prefer over default exports      |
| **Small components**  | One responsibility per component |
| **BEM for CSS**       | Consistent naming                |
| **CSS Variables**     | Use design system tokens         |
| **Tests**             | Coverage for new components      |

### Commits

| Practice       | Description                                   |
| -------------- | --------------------------------------------- |
| **Atomic**     | One commit = one logical change               |
| **Frequent**   | Commit early and often                        |
| **Reviewable** | Each commit should be reviewable in isolation |
| **No WIP**     | Avoid generic "WIP", "fix", "update"          |

### Branches

| Practice               | Description                             |
| ---------------------- | --------------------------------------- |
| **Short-lived**        | Branches should live at most a few days |
| **Up to date**         | Rebase with main frequently             |
| **Delete after merge** | Keep repository clean                   |

### PRs

| Practice        | Description                            |
| --------------- | -------------------------------------- |
| **Small**       | Smaller PRs = faster reviews           |
| **Descriptive** | Explain the "why", not just the "what" |
| **Screenshots** | Include for visual changes             |
| **Testable**    | Clear steps for QA                     |

---

## Creating Components

See [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md) for detailed code standards.

### New Component Checklist

- [ ] `.tsx` file with complete typing
- [ ] `.module.scss` file with BEM
- [ ] Props documented with JSDoc
- [ ] `aria-label` for interactive elements
- [ ] States: loading, error, disabled
- [ ] Tests with `@testing-library/react`
- [ ] Export in package's `index.ts`

---

## Architectural Decisions

Important decisions are documented in ADRs at [docs/adr/](docs/adr/).

---

## Questions

- Check the documentation in `/docs`
- Open an issue for discussion
- Ask in code review
