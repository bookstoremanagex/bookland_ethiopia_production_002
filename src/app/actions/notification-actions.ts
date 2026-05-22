"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUnreadCount() {
  try {
    const count = await (prisma as any).notification.count({
      where: { is_deleted: false, is_read: false }
    })
    return { success: true, count }
  } catch (error: any) {
    return { success: false, count: 0 }
  }
}

export async function getNotifications() {
  try {
    const notifications = await (prisma as any).notification.findMany({
      where: {
        is_deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
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
        updatedAt: new Date(),
      }
    })
    revalidatePath("/admin_dashboard/notifications")
    return { success: true, data: notification }
  } catch (error: any) {
    console.error("Error creating notification:", error)
    return { success: false, error: error.message || "Failed to create notification" }
  }
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
    revalidatePath("/admin_dashboard/notifications");
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
    revalidatePath("/admin_dashboard/notifications");
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return { success: false, error: error.message || "Failed to delete notification" };
  }
}
