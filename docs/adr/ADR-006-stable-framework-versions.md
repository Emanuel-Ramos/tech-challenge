# ADR-006: Stable Framework Versions (Next.js 14 LTS)

## Status

Accepted

## Context

When starting the project, we needed to decide which Next.js and React versions to use. The options were:

1. **Bleeding edge** (Next.js 16, React 19): Latest features, but potentially unstable
2. **Stable/LTS** (Next.js 14, React 18): Battle-tested, widely adopted, stable

## Decision

I chose **Next.js 14.2.x (LTS)** with **React 18.3.x** for this project.

## Rationale

### Why NOT Use the Latest Versions?

| Concern                   | Next.js 16 + React 19 | Next.js 14 + React 18         |
| ------------------------- | --------------------- | ----------------------------- |
| **Stability**             | New, potential bugs   | Battle-tested                 |
| **Community**             | Limited resources     | Extensive docs/Stack Overflow |
| **Enterprise adoption**   | Rare                  | Industry standard             |
| **Breaking changes**      | Frequent              | Stable API                    |
| **Third-party libraries** | Compatibility issues  | Full ecosystem support        |

### Enterprise Mindset

In production environments, stability is paramount:

1. **Risk Management**: New versions may introduce regressions
2. **Team Onboarding**: More developers are familiar with React 18
3. **Debugging**: More community knowledge for troubleshooting
4. **Long-Term Support**: LTS versions receive security patches longer

### What We Get with Next.js 14

- **App Router Maturity**: Stable server components (if needed)
- **Pages Router**: Fully supported, battle-tested
- **Turbopack**: Available for dev (optional)
- **Security Patches**: Active maintenance

## Consequences

### Positive

- Predictable behavior in production
- Easier to hire developers familiar with the stack
- More Stack Overflow answers and tutorials available
- Lower risk of hitting undocumented bugs

### Negative

- Missing some React Compiler performance optimizations
- Will need to upgrade eventually when Next.js 14 reaches EOL
