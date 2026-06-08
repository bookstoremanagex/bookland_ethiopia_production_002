"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";

export async function getUnreadCount(accountId?: number, notificationTo?: string) {
  try {
    const where: any = { is_deleted: false, is_read: false };
    if (notificationTo) {
      where.notification_to = notificationTo;
    } else if (accountId) {
      where.OR = [
        { accountId },
        { accountId: null },
      ];
    }
    const count = await (prisma as any).notification.count({ where })
    return { success: true, count }
  } catch (error: any) {
    return { success: false, count: 0 }
  }
}

export async function getNotifications(accountId?: number, notificationTo?: string, take?: number) {
  try {
    const where: any = { is_deleted: false };
    if (notificationTo) {
      where.notification_to = notificationTo;
    } else if (accountId) {
      where.OR = [
        { accountId },
        { accountId: null },
      ];
    }
    const notifications = await (prisma as any).notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      ...(take ? { take } : {}),
    });
    return { success: true, data: notifications || [] };
  } catch (error: any) {
    console.warn("Database empty or notifications not found. Defaulting to empty list.", error);
    return { success: true, data: [] };
  }
}

export async function createNotification(data: {
  title: string
  message: string
  details?: string
  type?: string
  notification_to?: string
  notification_from?: string
  accountId?: number
}) {
  try {
    const notification = await (prisma as any).notification.create({
      data: {
        title: data.title,
        message: data.message,
        details: data.details || null,
        type: data.type || "INFO",
        notification_to: data.notification_to || "ADMIN",
        notification_from: data.notification_from || null,
        accountId: data.accountId || undefined,
        updatedAt: new Date(),
      }
    })
    revalidatePath("/admin_dashboard/notifications")
    revalidatePath("/delivery_and_sales_dashboard/notifications")
    revalidatePath("/delivery_dashboard_full/notifications")
    revalidatePath("/finance_officer_dashboard/notifications")
    revalidatePath("/inventory_manager_dashboard/notifications")
    revalidatePath("/operation_manager_dashboard/notifications")
    revalidatePath("/retail_manager_dashboard/notifications")
    revalidatePath("/sales_staff_dashboard/notifications")
    revalidatePath("/viewer_dashboard/notifications")
    return { success: true, data: notification }
  } catch (error: any) {
    console.error("Error creating notification:", error)
    return { success: false, error: error.message || "Failed to create notification" }
  }
}

function revalidateAllNotificationPaths() {
  const paths = [
    "/admin_dashboard/notifications",
    "/delivery_and_sales_dashboard/notifications",
    "/delivery_dashboard_full/notifications",
    "/finance_officer_dashboard/notifications",
    "/inventory_manager_dashboard/notifications",
    "/operation_manager_dashboard/notifications",
    "/retail_manager_dashboard/notifications",
    "/sales_staff_dashboard/notifications",
    "/viewer_dashboard/notifications",
  ];
  paths.forEach(p => revalidatePath(p));
}

export async function markAsRead(id: number) {
  try {
    const updated = await (prisma as any).notification.update({
      where: { id },
      data: {
        is_read: true,
        updatedAt: new Date(),
      },
    });
    revalidateAllNotificationPaths();
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message || "Failed to update notification" };
  }
}

export async function deleteNotification(id: number) {
  try {
    const deleted = await (prisma as any).notification.update({
      where: { id },
      data: {
        is_deleted: true,
        updatedAt: new Date(),
      },
    });
    revalidateAllNotificationPaths();
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return { success: false, error: error.message || "Failed to delete notification" };
  }
}
