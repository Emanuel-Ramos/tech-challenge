import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getAllowedTenants } from "@/lib/tenant";

const TENANTS_DIR = path.join(process.cwd(), "../../cms/tenants");

/**
 * API to read tenant config.
 * GET - Returns current tenant config
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const tenantId = req.cookies["shipay_tenant"] || "default";
  const allowedTenants = getAllowedTenants();

  if (!allowedTenants.includes(tenantId)) {
    return res.status(403).json({ error: "Invalid tenant" });
  }

  const tenantFile = path.join(TENANTS_DIR, `${tenantId}.json`);
  const content = fs.readFileSync(tenantFile, "utf-8");
  return res.json(JSON.parse(content));
}
