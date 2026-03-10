# ADR-003: Microfrontend Architecture with Build-Time Federation

## Status

Accepted

## Context

### The Problem

The project requires an architecture that supports **multiple teams** developing independent modules (microfrontends) for a multi-tenant admin panel. Each team would be responsible for a functional area:

- **Payments Team**: Transaction dashboard, reports
- **Users Team**: Account management, permissions
- **Settings Team**: Theme editor, CMS

### Requirements

1. **Isolation**: Each module must be developed independently
2. **Consistency**: All modules must use the same design system
3. **Type Safety**: Shared interfaces between modules
4. **Scalability**: Facilitate adding new modules/teams

### Options Considered

| Option                   | Deploy      | Complexity | Type Safety |
| ------------------------ | ----------- | ---------- | ----------- |
| Monorepo + Build-time    | Atomic      | Low        | Full        |
| Multi-repo + Module Fed. | Independent | High       | Partial     |
| Monorepo + Runtime Fed.  | Independent | Medium     | Partial     |

---

## Decision

I adopted **Monorepo with Build-Time Federation** using pnpm workspaces + Turborepo.

### Pragmatic Decision for MVP

This decision was made specifically for an **MVP** context. Implementing Module Federation from the start would be over-engineering for a project that doesn't yet have:

- Multiple teams working in parallel
- Need for independent deployment
- Scale that justifies the additional complexity

**If the project scales, the ideal path is to migrate to Module Federation**, and the current architecture was designed to facilitate this transition. The modules are already isolated in independent packages, contracts are already defined in `@shipay/types`, and the design system is already consumed as an external dependency.

The idea is: **start simple, scale when necessary**.

---

## Technical Rationale

### Why pnpm?

| Characteristic       | pnpm              | npm/yarn       |
| -------------------- | ----------------- | -------------- |
| Installation         | Hard links (fast) | Copies (slow)  |
| Phantom dependencies | Blocked           | Allowed        |
| Workspace protocol   | `workspace:*`     | `*` or `link:` |
| Disk usage           | Shared            | Duplicated     |

### Why Turborepo?

1. **Smart Cache**: Doesn't rebuild packages that haven't changed
2. **Parallelization**: Runs tasks in parallel when possible
3. **Topological Order**: Respects dependencies between packages

### Why Build-Time (vs Runtime)?

| Aspect        | Build-Time          | Runtime (Module Fed.)     |
| ------------- | ------------------- | ------------------------- |
| Type Safety   | 100% (compile time) | Partial (runtime)         |
| Performance   | Optimized bundle    | Extra requests            |
| Complexity    | Low                 | High                      |
| Deploy        | Atomic              | Independent               |
| Network Fails | Impossible          | Possible                  |
| Stacks        | React only          | React, Vue, Angular, etc. |

---

## Consequences

### Positive

- **Simplicity**: One repo, one CI/CD, one deploy
- **Full Type Safety**: Interface errors detected at build
- **Safe Refactoring**: Changes propagate automatically
- **Excellent DX**: `pnpm install` and `pnpm dev` work immediately
- **Performance**: Optimized bundle, no runtime overhead

### Negative

- **Atomic Deploy**: All modules deploy together
- **Full Build**: Change in types rebuilds all dependents
- **Team Scalability**: More than ~10 devs may cause merge conflicts
- **Single Stack**: All modules need to use React - not possible to have a microfrontend in Vue or Angular, as everything is built together by Next.js. With runtime Module Federation, each microfrontend can use its own stack.

### Mitigations

- **CODEOWNERS**: Define owners per directory for code review
- **Feature Flags**: Decouple deploy from release
- **Trunk-Based Development**: Short branches, frequent merges

---

## When to Use Module Federation

Module Federation would be the ideal choice for this project if:

| Scenario                              | Why Module Federation                                |
| ------------------------------------- | ---------------------------------------------------- |
| **3+ teams developing in parallel**   | Each team deploys independently, no waiting          |
| **Frequent and decoupled releases**   | Team A can hotfix without rebuilding modules B and C |
| **Modules with different lifecycles** | Payments updates daily, Admin updates monthly        |
| **Need for granular rollback**        | Revert only the problematic module                   |
| **Different stacks per module**       | One team wants Vue, another React                    |

### Real Migration Cost

Migration from build-time to runtime federation **is not trivial**:

| Aspect                     | Complexity                                                    |
| -------------------------- | ------------------------------------------------------------- |
| **Shared deps versioning** | React, design-system - ensure same version across all remotes |
| **Error boundaries**       | Each remote module can fail independently                     |
| **Loading states**         | UI needs to handle modules loading async                      |
| **Integration tests**      | How to test shell + remote modules? Mocks? Staging?           |
| **CI/CD**                  | Separate pipeline per module + release orchestration          |
| **Debugging**              | Stack traces cross network boundaries                         |

### Why Not Use It Now

For an MVP, Module Federation adds complexity without benefit.
