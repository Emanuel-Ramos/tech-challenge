# ADR-001: Tenant Resolution Strategy

## Status

Accepted

## Context

We need a reliable way to identify which tenant is accessing the multi-tenant platform. The solution must be:

- Secure against injection attacks
- SEO-friendly for production
- Easy to test during development
- Persistent across user sessions

## Decision

I implemented a **three-layer tenant resolution** with the following priority:

1. **Subdomain** (Primary - Production)
   - `tenant-a.shipay.emanuel.app.br` → `tenant-a`
   - SEO-friendly, clear brand separation
   - Each tenant has its own URL

2. **Secure Cookie** (Fallback - Session Persistence)
   - HttpOnly, Secure, SameSite=Strict
   - Allows session persistence when subdomain is not available
   - 30-day expiration

3. **Query Parameter**
   - `?tenant=tenant-a`
   - Facilitates testing and demos without DNS configuration

## Security Measures

- **Whitelist validation**: Only pre-approved tenant IDs are accepted
- **Input sanitization**: Regex removes special characters
- **Cookie security**: HttpOnly prevents XSS, SameSite prevents CSRF

## Consequences

### Positive

- Clear separation between production (subdomain) and development/testing (query param)
- Secure by default with multiple protection layers
- Easy to add new tenants (just add to the list and create config file)

### Negative

- Requires wildcard DNS configuration for production
- Tenant list needs to be maintained (could migrate to database)

## Implementation

See `apps/shell/src/lib/tenant.ts` for the complete implementation.
