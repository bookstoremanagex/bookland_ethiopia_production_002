"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DASHBOARD_MENU_REGISTRY } from "@/lib/dashboard-menu-registry";

/**
 * Idempotent seed: records each dashboard's menu list into the `menus` table
 * (creating missing rows by unique name) and resets menu_management so every
 * dashboard menu is turned ON by default.
 *
 * Running it again yields the same result. Admin can then toggle menus off from
 * Settings -> Menu Management. Home is always kept ON.
 */
export async function seedDashboardMenus() {
  const now = new Date();
  const report: Record<string, { menus: number; assignments: number }> = {};

  try {
    for (const dashboard of DASHBOARD_MENU_REGISTRY) {
      let menusCreated = 0;
      let assignmentsChanged = 0;

      const menuRows: Array<{ id: number; name: string; alwaysOn: boolean }> = [];

      for (const menu of dashboard.menus) {
        const existing = await (prisma as any).menus.findUnique({
          where: { name: menu.name },
        });

        let row = existing;
        if (!row) {
          row = await (prisma as any).menus.create({
            data: { name: menu.name, order: 999, updatedAt: now, createdAt: now },
          });
          menusCreated++;
        }
        menuRows.push({ id: row.id, name: row.name, alwaysOn: !!menu.alwaysOn });
      }

      const wantedIds = menuRows.map((m) => m.id);
      const current = await (prisma as any).menu_management.findMany({
        where: { account_type: dashboard.accountType },
      });

      const activeIds = new Set(
        current.filter((c: any) => !c.is_deleted).map((c: any) => c.menuId)
      );
      const deletedMap = new Map<number, any>(
        current.filter((c: any) => c.is_deleted).map((c: any) => [c.menuId, c])
      );

      // Enable (restore or create) every wanted menu.
      for (const menuId of wantedIds) {
        const deleted = deletedMap.get(menuId);
        if (deleted) {
          await (prisma as any).menu_management.update({
            where: { id: deleted.id },
            data: { is_deleted: false, deletedAt: now, updatedAt: now },
          });
          assignmentsChanged++;
        } else if (!activeIds.has(menuId)) {
          await (prisma as any).menu_management.create({
            data: {
              account_type: dashboard.accountType,
              menuId,
              updatedAt: now,
              createdAt: now,
            },
          });
          assignmentsChanged++;
        }
      }

      // Disable any assignment that is not part of this dashboard's list.
      const wantedSet = new Set(wantedIds);
      for (const c of current) {
        if (!wantedSet.has(c.menuId) && !c.is_deleted) {
          await (prisma as any).menu_management.update({
            where: { id: c.id },
            data: { is_deleted: true, deletedAt: now, updatedAt: now },
          });
          assignmentsChanged++;
        }
      }

      report[dashboard.accountType] = {
        menus: menusCreated,
        assignments: assignmentsChanged,
      };
    }

    revalidatePath("/admin_dashboard/settings/menus");
    for (const d of DASHBOARD_MENU_REGISTRY) {
      revalidatePath(d.rootPath, "layout");
    }

    return { success: true, data: report };
  } catch (error) {
    console.error("Failed to seed dashboard menus:", error);
    return { success: false, error: "Failed to seed dashboard menus" };
  }
}