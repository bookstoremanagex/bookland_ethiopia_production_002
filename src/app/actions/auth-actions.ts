"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  try {
    const account = await (prisma as any).accounts.findFirst({
      where: {
        account_email: email,
        is_deleted: false,
        account_status: true,
      },
    });

    if (!account) {
      return { success: false, error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Determine redirect path based on account type
    let redirectPath = "/";
    const type = account.account_type;

    switch (type) {
      case "ADMIN":
        redirectPath = "/admin_dashboard";
        break;
      case "Operations Manager":
        redirectPath = "/operation_manager_dashboard";
        break;
      case "Inventory Manager":
        redirectPath = "/inventory_manager_dashboard";
        break;
      case "Finance Officer":
        redirectPath = "/finance_officer_dashboard";
        break;
      case "Sales Staff":
        redirectPath = "/sales_staff_dashboard";
        break;
      case "Retail Manager":
        redirectPath = "/retail_manager_dashboard";
        break;
      case "Delivery and Sales Management":
        redirectPath = "/delivery_and_sales_dashboard";
        break;
      case "Printer":
        redirectPath = "/printer_dashboard";
        break;
      case "Viewer":
        redirectPath = "/viewer_dashboard";
        break;
      default:
        redirectPath = "/admin_dashboard"; // Fallback
    }

    // Set session cookie
    const sessionData = {
      id: account.id,
      name: account.name,
      email: account.account_email,
      role: account.account_type,
    };
    
    (await cookies()).set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { 
      success: true, 
      redirectPath,
      user: sessionData
    };
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
