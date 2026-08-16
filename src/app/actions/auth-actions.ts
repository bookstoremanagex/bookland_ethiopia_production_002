"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

function getRedirectPath(role: string): string {
  switch (role) {
    case "ADMIN": return "/admin_dashboard";
    case "Operations Manager": return "/operation_manager_full_dashboard";
    case "Inventory Manager": return "/inventory_manager_dashboard";
    case "Finance Officer": return "/finance_officer_dashboard";
    case "Sales Staff": return "/sales_staff_dashboard";
    case "Delivery and Sales Management": return "/delivery_and_sales_dashboard";
    case "Delivery Sample": return "/delivery_sample_dashboard";
    case "Printer": return "/printer_full";
    case "Viewer": return "/viewer_dashboard";
    case "Delivery Account": return "/delivery_dashboard_full";
    default: return "/admin_dashboard";
  }
}

export async function loginAction(email: string, password: string) {
  try {
    // 1. Try accounts table by email
    let account = await (prisma as any).accounts.findFirst({
      where: {
        account_email: email,
        is_deleted: false,
        account_status: true,
      },
    });

    // 2. Try accounts table by phone number
    if (!account) {
      account = await (prisma as any).accounts.findFirst({
        where: {
          phonenumber: email,
          is_deleted: false,
          account_status: true,
        },
      });
    }

    // 3. If still not found, try matching via printer table (backwards compatibility)
    if (!account) {
      const printer = await (prisma as any).printer.findFirst({
        where: {
          OR: [
            { phone: email },
            { email: email },
          ],
          is_deleted: false,
        },
      });

      if (printer) {
        if (printer.email) {
          account = await (prisma as any).accounts.findFirst({
            where: {
              account_email: printer.email,
              is_deleted: false,
              account_status: true,
            },
          });
        }
        if (!account) {
          account = await (prisma as any).accounts.findFirst({
            where: {
              name: printer.name,
              is_deleted: false,
              account_status: true,
            },
          });
        }
      }
    }

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
