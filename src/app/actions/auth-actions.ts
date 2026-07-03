"use server";

import prisma from "@/lib/prisma";
import retailPrisma from "@/lib/retail-prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

function getRedirectPath(role: string): string {
  switch (role) {
    case "ADMIN": return "/admin_dashboard";
    case "Operations Manager": return "/operation_manager_dashboard";
    case "Inventory Manager": return "/inventory_manager_dashboard";
    case "Finance Officer": return "/finance_officer_dashboard";
    case "Sales Staff": return "/sales_staff_dashboard";
    case "Retail Manager": return "/retail_manager_dashboard";
    case "Delivery and Sales Management": return "/delivery_and_sales_dashboard";
    case "Delivery Sample": return "/delivery_sample_dashboard";
    case "Printer": return "/printer_full";
    case "Viewer": return "/viewer_dashboard";
    case "Delivery Account": return "/delivery_dashboard_full";
    case "Retail Shop": return "/retail_shop_dashboard";
    default: return "/admin_dashboard";
  }
}

export async function loginAction(email: string, password: string) {
  try {
    // 1. Try main database accounts table first
    const account = await (prisma as any).accounts.findFirst({
      where: {
        account_email: email,
        is_deleted: false,
        account_status: true,
      },
    });

    if (account) {
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (isPasswordValid) {
        const sessionData = {
          id: account.id,
          name: account.name,
          email: account.account_email,
          role: account.account_type,
        };

        (await cookies()).set("session", JSON.stringify(sessionData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        return {
          success: true,
          redirectPath: getRedirectPath(account.account_type),
          user: sessionData,
        };
      }
    }

    // 2. Fall back to retail database users table
    const retailUser = await retailPrisma.users.findFirst({
      where: { email },
    });

    if (retailUser && retailUser.password) {
      const isPasswordValid = await bcrypt.compare(password, retailUser.password);
      if (isPasswordValid) {
        const role = retailUser.role ?? "Retail Shop";
        const sessionData = {
          id: retailUser.id,
          name: retailUser.name ?? "Retail User",
          email: retailUser.email ?? email,
          role,
        };

        (await cookies()).set("session", JSON.stringify(sessionData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        return {
          success: true,
          redirectPath: getRedirectPath(role),
          user: sessionData,
        };
      }
    }

    return { success: false, error: "Invalid email or password" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function logoutAction() {
  (await cookies()).delete("session");
  return { success: true };
}

export async function getCurrentSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie);
  } catch (error) {
    return null;
  }
}
