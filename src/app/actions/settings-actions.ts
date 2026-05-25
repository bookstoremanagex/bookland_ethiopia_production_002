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

export async function updateSettings(primaryColor: string, badgeColor?: string) {
    try {
        let currentSettings = await (prisma as any).settings.findFirst();
        const data: any = { primaryColor };
        if (badgeColor !== undefined) {
            data.badgeColor = badgeColor;
        }
        if (!currentSettings) {
            currentSettings = await (prisma as any).settings.create({ data });
        } else {
            currentSettings = await (prisma as any).settings.update({
                where: { id: currentSettings.id },
                data
            });
        }
        return { success: true, data: currentSettings };
    } catch (error: any) {
        console.error("Error in updateSettings:", error);
        return { success: false, error: error.message || "Failed to update settings." };
    }
}
