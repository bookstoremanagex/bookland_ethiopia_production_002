"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

// ── Old dashboardmenu system (keep for backward compat) ──

export async function getDashboardMenus() {
  try {
    const menus = await (prisma as any).$queryRaw`SELECT * FROM dashboardmenu`;
    return { success: true, data: menus };
  } catch (error) {
    console.error("Failed to fetch dashboard menus:", error);
    return { success: false, error: "Failed to fetch dashboard menus" };
  }
}

export async function updateDashboardMenu(role: string, enabledMenus: string[]) {
  try {
    const menusJson = JSON.stringify(enabledMenus);
    const existing: any[] = await (prisma as any).$queryRaw`SELECT id FROM dashboardmenu WHERE role = ${role} LIMIT 1`;
    if (existing && existing.length > 0) {
        await (prisma as any).$executeRaw`UPDATE dashboardmenu SET menus = ${menusJson}, updatedAt = NOW() WHERE role = ${role}`;
    } else {
        await (prisma as any).$executeRaw`INSERT INTO dashboardmenu (role, menus, updatedAt, createdAt) VALUES (${role}, ${menusJson}, NOW(), NOW())`;
    }
    revalidatePath("/admin_dashboard/settings/menus");
    revalidatePath("/finance_officer_dashboard", "layout");
    revalidatePath("/inventory_manager_dashboard", "layout");
    revalidatePath("/operation_manager_full_dashboard", "layout");
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
            const menus = typeof config[0].menus === 'string' ? JSON.parse(config[0].menus) : config[0].menus;
            return { success: true, data: menus || [] };
        }
        return { success: true, data: [] };
    } catch (error) {
        return { success: false, error: "Failed to fetch config" };
    }
}

// ── New menu_management system ──

const ROLE_TO_ACCOUNT_TYPE: Record<string, string> = {
  finance_officer: "Finance Officer",
  inventory_manager: "Inventory Manager",
  operation_manager: "Operations Manager",
  sales_staff: "Sales Staff",
  delivery_sales: "Delivery and Sales Management",
  delivery_sample: "Delivery Sample",
  printer: "Printer",
  viewer: "Viewer",
};

export async function getEnabledMenuNamesForRole(role: string) {
  try {
    const accountType = ROLE_TO_ACCOUNT_TYPE[role];
    if (!accountType) return { success: true, data: [] };

    const management = await (prisma as any).menu_management.findMany({
      where: { account_type: accountType, is_deleted: false },
      include: { menus: true },
    });

    const names: string[] = management.map((m: any) => m.menus?.name).filter(Boolean);

    // Always enable Settings and Theme Customization for all non-admin roles
    // except Inventory Manager, who has no settings pages
    if (role !== "admin" && role !== "inventory_manager") {
      if (!names.includes("Settings")) names.push("Settings");
      if (!names.includes("Theme Customization")) names.push("Theme Customization");
    }

    return { success: true, data: names };
  } catch (error) {
    console.error("Failed to fetch enabled menus:", error);
    return { success: false, data: [] };
  }
}

const ACCOUNT_TYPES = [
  "Operations Manager",
  "Inventory Manager",
  "Finance Officer",
  "Sales Staff",
  "Delivery and Sales Management",
  "Delivery Sample",
  "Printer",
  "Viewer",
];

export async function getAllMenusWithAssignments() {
  try {
    const menus = await (prisma as any).menus.findMany({
      where: { is_deleted: false },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });

    const assignments = await (prisma as any).menu_management.findMany({
      where: { is_deleted: false },
    });

    const assignmentMap: Record<string, string[]> = {};
    for (const a of assignments) {
      if (!assignmentMap[a.account_type]) assignmentMap[a.account_type] = [];
      assignmentMap[a.account_type].push(String(a.menuId));
    }

    return { success: true, data: { menus, assignments: assignmentMap } };
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    return { success: false, error: "Failed to fetch menus" };
  }
}

export async function saveMenuAssignments(accountType: string, menuIds: number[]) {
  try {
    const now = new Date();

    const existing = await (prisma as any).menu_management.findMany({
      where: { account_type: accountType },
    });

    const existingIds = new Set(existing.filter((e: any) => !e.is_deleted).map((e: any) => e.menuId));
    const deletedMap = new Map<number, any>(
      existing.filter((e: any) => e.is_deleted).map((e: any) => [e.menuId, e])
    );
    const newIds = new Set(menuIds);

    const toDelete = existing.filter((e: any) => !e.is_deleted && !newIds.has(e.menuId));
    const toRestore = menuIds.filter((id) => deletedMap.has(id));
    const toCreate = menuIds.filter((id) => !existingIds.has(id) && !deletedMap.has(id));

    if (toDelete.length > 0) {
      await (prisma as any).menu_management.updateMany({
        where: { id: { in: toDelete.map((e: any) => e.id) } },
        data: { is_deleted: true, deletedAt: now, updatedAt: now },
      });
    }

    for (const menuId of toRestore) {
      const record = deletedMap.get(menuId);
      if (record) {
        await (prisma as any).menu_management.update({
          where: { id: record.id },
          data: { is_deleted: false, deletedAt: now, updatedAt: now },
        });
      }
    }

    if (toCreate.length > 0) {
      await (prisma as any).menu_management.createMany({
        data: toCreate.map((menuId) => ({
          account_type: accountType,
          menuId,
          updatedAt: now,
        })),
      });
    }

    const ACCOUNT_TYPE_TO_DASHBOARD: Record<string, string> = {
      "Operations Manager": "/operation_manager_full_dashboard",
      "Inventory Manager": "/inventory_manager_dashboard",
      "Finance Officer": "/finance_officer_dashboard",
      "Sales Staff": "/sales_staff_dashboard",
      "Delivery and Sales Management": "/delivery_and_sales_dashboard",
      "Delivery Sample": "/delivery_sample_dashboard",
      "Printer": "/printer_dashboard",
      "Viewer": "/viewer_dashboard",
    };
    revalidatePath("/admin_dashboard/settings/menus");
    for (const p of Object.values(ACCOUNT_TYPE_TO_DASHBOARD)) {
      revalidatePath(p, "layout");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to save menu assignments:", error);
    return { success: false, error: "Failed to save menu assignments" };
  }
}
