import type { NextApiRequest, NextApiResponse } from "next";
import type { TenantConfig } from "@shipay/types";
import fs from "fs";
import path from "path";
import { getAllowedTenants } from "@/lib/tenant";

const TENANTS_DIR = path.join(process.cwd(), "../../cms/tenants");

/**
 * Simple API to read/write tenant config.
 * GET - Returns current tenant config
 * PUT - Saves updated config to JSON file
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenantId = req.cookies["shipay_tenant"] || "default";
  const allowedTenants = getAllowedTenants();

  if (!allowedTenants.includes(tenantId)) {
    return res.status(403).json({ error: "Invalid tenant" });
  }

  const tenantFile = path.join(TENANTS_DIR, `${tenantId}.json`);

  if (req.method === "GET") {
    const content = fs.readFileSync(tenantFile, "utf-8");
    return res.json(JSON.parse(content));
  }

  if (req.method === "PUT") {
    const existing = JSON.parse(fs.readFileSync(tenantFile, "utf-8")) as TenantConfig;
    const updates = req.body;

    const updated: TenantConfig = {
      ...existing,
      name: updates.name ?? existing.name,
      logo: updates.logo ?? existing.logo,
      theme: { ...existing.theme, ...updates.theme },
    };

    fs.writeFileSync(tenantFile, JSON.stringify(updated, null, 2));
    return res.json({ success: true });
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Method not allowed" });
}
