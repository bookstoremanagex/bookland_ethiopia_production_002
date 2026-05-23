"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDashboardMenus() {
  try {
    // Use raw query as a fallback in case the prisma client is stale
    const menus = await (prisma as any).$queryRaw`SELECT * FROM dashboardmenu`;
    return { success: true, data: menus };
  } catch (error) {
    console.error("Failed to fetch dashboard menus:", error);
    // If table doesn't exist yet or other error
    return { success: false, error: "Failed to fetch dashboard menus" };
  }
}

export async function updateDashboardMenu(role: string, enabledMenus: string[]) {
  try {
    const menusJson = JSON.stringify(enabledMenus);
    
    // Check if exists
    const existing: any[] = await (prisma as any).$queryRaw`SELECT id FROM dashboardmenu WHERE role = ${role} LIMIT 1`;
    
    if (existing && existing.length > 0) {
        await (prisma as any).$executeRaw`UPDATE dashboardmenu SET menus = ${menusJson}, updatedAt = NOW() WHERE role = ${role}`;
    } else {
        await (prisma as any).$executeRaw`INSERT INTO dashboardmenu (role, menus, updatedAt, createdAt) VALUES (${role}, ${menusJson}, NOW(), NOW())`;
    }

    // Revalidate the settings page AND all role dashboards so sidebars reflect changes immediately
    revalidatePath("/admin_dashboard/settings/menus");
    revalidatePath("/finance_officer_dashboard", "layout");
    revalidatePath("/inventory_manager_dashboard", "layout");
    revalidatePath("/operation_manager_dashboard", "layout");
    revalidatePath("/retail_manager_dashboard", "layout");
    revalidatePath("/sales_staff_dashboard", "layout");
    revalidatePath("/printer_dashboard", "layout");
    revalidatePath("/viewer_dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update dashboard menu:", error);
    return { success: false, error: "Failed to update dashboard menu" };
  }
}

export async function getMenuConfigForRole(role: string) {
    try {
        const config: any[] = await (prisma as any).$queryRaw`SELECT menus FROM dashboardmenu WHERE role = ${role} LIMIT 1`;
        if (config && config.length > 0) {
            // MySQL JSON columns might come back as strings or objects depending on the driver
            const menus = typeof config[0].menus === 'string' ? JSON.parse(config[0].menus) : config[0].menus;
            return { success: true, data: menus || [] };
        }
        return { success: true, data: [] };
    } catch (error) {
        return { success: false, error: "Failed to fetch config" };
    }
}
