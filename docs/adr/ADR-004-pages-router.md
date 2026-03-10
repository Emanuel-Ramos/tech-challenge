# ADR-004: Next.js Pages Router vs App Router

## Status

Accepted

## Context

Next.js offers two routing paradigms:

- **Pages Router**: Traditional, stable, uses `getServerSideProps`
- **App Router**: New, uses React Server Components (RSC)

## Decision

I use **Pages Router** with `getServerSideProps` for server-side tenant resolution.

```typescript
// Simple SSR with tenant resolution
export const getServerSideProps = withTenant(async (ctx, tenant) => {
  return { customProp: "value" };
});
```

## Rationale

### Why Pages Router?

1. **SSR Simplicity**
   - `getServerSideProps` is straightforward
   - Clear separation between server and client code
   - Well-documented patterns

2. **Tenant Resolution Needs**
   - We need to read cookies/headers on each request
   - Pages Router makes this explicit and simple

3. **Stability**
   - Pages Router is mature and battle-tested
   - App Router is still evolving
   - Fewer edge cases and bugs

4. **Team Familiarity**
   - Most React developers know Pages Router
   - Less onboarding friction

### Why Not App Router?

1. **Complexity vs Value**
   - RSC adds complexity without clear benefit for our use case
   - We don't have heavy data fetching patterns
   - Our pages are relatively simple

2. **Cache Challenges**
   - App Router's aggressive caching may conflict with tenant resolution
   - We need fresh tenant data on each request

3. **Library Compatibility**
   - Some libraries still have issues with RSC
   - CSS-in-JS solutions require careful handling

## Consequences

### Positive

- Simpler mental model
- Predictable server-side behavior
- Easy testing with `getServerSideProps`
- Wide community support

### Negative

- May miss future RSC optimizations
- May require migration later
- Some newer Next.js features require App Router

## Migration Considerations

If migration to App Router becomes necessary:

1. Convert pages to `app/` directory structure
2. Replace `getServerSideProps` with server components
3. Update tenant resolution to use headers/cookies API
4. Carefully test caching behavior
