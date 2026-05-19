"use server";

import prisma from "@/lib/prisma";

export async function getSettings() {
    try {
        let currentSettings = await (prisma as any).settings.findFirst();
        if (!currentSettings) {
            currentSettings = await (prisma as any).settings.create({
                data: {
                    primaryColor: "#408A71"
                }
            });
        }
        return { success: true, data: currentSettings };
    } catch (error: any) {
        console.error("Error in getSettings:", error);
        return { success: false, error: error.message || "Failed to load settings." };
    }
}

export async function updateSettings(primaryColor: string) {
    try {
        let currentSettings = await (prisma as any).settings.findFirst();
        if (!currentSettings) {
            currentSettings = await (prisma as any).settings.create({
                data: { primaryColor }
            });
        } else {
            currentSettings = await (prisma as any).settings.update({
                where: { id: currentSettings.id },
                data: { primaryColor }
            });
        }
        return { success: true, data: currentSettings };
    } catch (error: any) {
        console.error("Error in updateSettings:", error);
        return { success: false, error: error.message || "Failed to update settings." };
    }
}
