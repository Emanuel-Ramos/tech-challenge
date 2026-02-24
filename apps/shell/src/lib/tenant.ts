import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { TenantConfig } from "@shipay/types";
import fs from "fs";
import path from "path";

const TENANTS_DIR = path.join(process.cwd(), "../../cms/tenants");

/**
 * List of allowed tenant IDs.
 * This whitelist prevents unauthorized tenant access and injection attacks.
 * In production, this could be loaded from a database or environment variable.
 */
const ALLOWED_TENANTS = new Set(["tenant-a", "tenant-b", "default"]);

/**
 * Cookie configuration for secure tenant storage.
 */
const TENANT_COOKIE_NAME = "shipay_tenant";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Extracts tenant ID from subdomain.
 * Example: tenant-a.shipay.com -> tenant-a
 *          tenant-a.localhost -> tenant-a
 *          localhost -> null
 *          shipay.com -> null
 */
function extractTenantFromSubdomain(host: string | undefined): string | null {
  if (!host) return null;

  // Remove port if present (e.g., localhost:3000)
  const hostWithoutPort = host.split(":")[0];

  // Split by dots
  const parts = hostWithoutPort.split(".");

  // For localhost or single-part domains, no subdomain
  if (parts.length === 1) return null;

  // For domains like tenant-a.localhost or tenant-a.shipay.com
  // The first part is the subdomain (potential tenant)
  const subdomain = parts[0];

  // Ignore common subdomains that aren't tenants
  const ignoredSubdomains = new Set(["www", "api", "admin", "app"]);
  if (ignoredSubdomains.has(subdomain)) return null;

  return subdomain;
}

/**
 * Validates if a tenant ID is allowed.
 * Prevents unauthorized access and injection attacks.
 */
function isValidTenant(tenantId: string): boolean {
  // Sanitize: only allow alphanumeric and hyphens
  const sanitized = tenantId.replace(/[^a-zA-Z0-9-]/g, "");
  if (sanitized !== tenantId) return false;

  // Check whitelist
  return ALLOWED_TENANTS.has(tenantId);
}

/**
 * Resolves the tenant from the request with security validations.
 *
 * Priority:
 * 1. Subdomain (production): tenant-a.shipay.com
 * 2. Secure Cookie (fallback): For session persistence
 * 3. Query param (dev only): ?tenant=x for testing
 * 4. Default tenant
 *
 * Security measures:
 * - Whitelist validation prevents unauthorized tenants
 * - Input sanitization prevents injection
 * - Cookie is HttpOnly, Secure, SameSite=Strict
 */
export function resolveTenantId(ctx: GetServerSidePropsContext): string {
  const isDev = process.env.NODE_ENV === "development";

  // 1. Check subdomain (primary method for production)
  const host = ctx.req.headers.host;
  const subdomainTenant = extractTenantFromSubdomain(host);
  if (subdomainTenant && isValidTenant(subdomainTenant)) {
    return subdomainTenant;
  }

  // 2. Check secure cookie (fallback for session persistence)
  const cookieTenant = ctx.req.cookies?.[TENANT_COOKIE_NAME];
  if (cookieTenant && isValidTenant(cookieTenant)) {
    return cookieTenant;
  }

  // 3. Check query parameter (only in development for testing)
  if (isDev) {
    const queryTenant = ctx.query.tenant;
    if (typeof queryTenant === "string" && isValidTenant(queryTenant)) {
      return queryTenant;
    }
  }

  // 4. Return default tenant
  return "default";
}

/**
 * Sets a secure tenant cookie in the response.
 * Use this when a user explicitly selects a tenant.
 */
export function setTenantCookie(ctx: GetServerSidePropsContext, tenantId: string): void {
  if (!isValidTenant(tenantId)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Attempted to set invalid tenant cookie: ${tenantId}`);
    }
    return;
  }

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = [
    `${TENANT_COOKIE_NAME}=${tenantId}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    "Path=/",
    "HttpOnly", // Prevents JavaScript access (XSS protection)
    "SameSite=Strict", // Prevents CSRF attacks
    isProduction ? "Secure" : "", // HTTPS only in production
  ]
    .filter(Boolean)
    .join("; ");

  ctx.res.setHeader("Set-Cookie", cookieOptions);
}

/**
 * Clears the tenant cookie.
 * Use this for logout or tenant switching.
 */
export function clearTenantCookie(ctx: GetServerSidePropsContext): void {
  const cookieOptions = [
    `${TENANT_COOKIE_NAME}=`,
    "Max-Age=0",
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
  ].join("; ");

  ctx.res.setHeader("Set-Cookie", cookieOptions);
}

/**
 * Loads tenant configuration from the CMS JSON files.
 * Validates tenant ID before loading for security.
 */
export async function loadTenantConfig(tenantId: string): Promise<TenantConfig> {
  // Security: validate tenant ID before file system access
  const safeId = isValidTenant(tenantId) ? tenantId : "default";

  try {
    const tenantFile = path.join(TENANTS_DIR, `${safeId}.json`);

    if (fs.existsSync(tenantFile)) {
      const content = fs.readFileSync(tenantFile, "utf-8");
      return JSON.parse(content) as TenantConfig;
    }

    // Fall back to default tenant
    const defaultFile = path.join(TENANTS_DIR, "default.json");
    const content = fs.readFileSync(defaultFile, "utf-8");
    return JSON.parse(content) as TenantConfig;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Failed to load tenant config for ${safeId}:`, error);
    }

    return {
      id: "fallback",
      name: "Shipay",
      logo: "/logos/shipay.svg",
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#6b7280",
        backgroundColor: "#ffffff",
        textColor: "#171717",
        borderRadius: "0.5rem",
      },
      layout: [],
    };
  }
}

/**
 * Gets tenant configuration based on the request context.
 * Used in getServerSideProps for SSR.
 */
export async function getTenantConfig(ctx: GetServerSidePropsContext): Promise<TenantConfig> {
  const tenantId = resolveTenantId(ctx);
  return loadTenantConfig(tenantId);
}

/**
 * Helper to get allowed tenants list.
 * Useful for tenant selection UI.
 */
export function getAllowedTenants(): string[] {
  return Array.from(ALLOWED_TENANTS);
}

/**
 * Type for pages that need tenant-aware SSR.
 */
export interface TenantPageProps {
  tenant: TenantConfig;
}

/**
 * Higher-order function for tenant-aware getServerSideProps.
 * Automatically resolves tenant and handles errors.
 */
export function withTenant<P extends TenantPageProps>(
  handler?: (
    ctx: GetServerSidePropsContext,
    tenant: TenantConfig
  ) => Promise<Partial<P>> | Partial<P>
): (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>> {
  return async (ctx) => {
    const tenant = await getTenantConfig(ctx);

    const additionalProps = handler ? await handler(ctx, tenant) : {};

    return {
      props: {
        tenant,
        ...additionalProps,
      } as P,
    };
  };
}
