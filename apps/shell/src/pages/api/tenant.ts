import type { NextApiRequest, NextApiResponse } from "next";
import { getAllowedTenants } from "@/lib/tenant";

/**
 * API endpoint to manage tenant selection via secure cookie.
 *
 * POST /api/tenant - Set tenant cookie
 * DELETE /api/tenant - Clear tenant cookie
 * GET /api/tenant - List available tenants
 */

const TENANT_COOKIE_NAME = "shipay_tenant";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type ResponseData = {
  success: boolean;
  message?: string;
  tenants?: string[];
  current?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const isProduction = process.env.NODE_ENV === "production";
  const allowedTenants = getAllowedTenants();

  switch (req.method) {
    case "GET": {
      // Return list of available tenants and current selection
      const currentTenant = req.cookies[TENANT_COOKIE_NAME] || "default";
      return res.status(200).json({
        success: true,
        tenants: allowedTenants,
        current: currentTenant,
      });
    }

    case "POST": {
      // Set tenant cookie
      const { tenant } = req.body;

      if (!tenant || typeof tenant !== "string") {
        return res.status(400).json({
          success: false,
          message: "Tenant ID is required",
        });
      }

      if (!allowedTenants.includes(tenant)) {
        return res.status(403).json({
          success: false,
          message: `Invalid tenant. Allowed: ${allowedTenants.join(", ")}`,
        });
      }

      // Set secure cookie
      const cookieOptions = [
        `${TENANT_COOKIE_NAME}=${tenant}`,
        `Max-Age=${COOKIE_MAX_AGE}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        isProduction ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; ");

      res.setHeader("Set-Cookie", cookieOptions);

      return res.status(200).json({
        success: true,
        message: `Tenant set to: ${tenant}`,
        current: tenant,
      });
    }

    case "DELETE": {
      // Clear tenant cookie
      const cookieOptions = [
        `${TENANT_COOKIE_NAME}=`,
        "Max-Age=0",
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
      ].join("; ");

      res.setHeader("Set-Cookie", cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Tenant cookie cleared",
        current: "default",
      });
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }
}
