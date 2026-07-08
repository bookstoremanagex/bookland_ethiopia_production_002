"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { translationProjectSchema, type TranslationProjectFormValues } from "../../lib/validation/translation-project-schema";

export async function getTranslationProjects() {
  try {
    const projects = await (prisma as any).translatorbook.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        books: true,
        translator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function createTranslationProject(data: TranslationProjectFormValues) {
  const result = translationProjectSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    const project = await (prisma as any).translatorbook.create({
      data: {
        bookId: result.data.bookId,
        translator_id: result.data.translator_id,
        Status: result.data.Status,
        cost: result.data.cost ?? null,
        payment_status: result.data.payment_status,
        currently_paid: result.data.currently_paid,
        startDate: result.data.startDate ? new Date(result.data.startDate) : null,
        endDate: result.data.endDate ? new Date(result.data.endDate) : null,
        updatedAt: new Date()
      },
    });
    revalidatePath("/admin_dashboard/production/translation_work");
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function getAvailableBooks() {
    try {
        const books = await prisma.books.findMany({
            where: { is_deleted: false, productionstatus: "TRANSLATION" },
            select: { id: true, title: true, unique_identification_code: true }
        })
        return { success: true, data: books }
    } catch (error) {
        return { success: false, error: "Failed to fetch books" }
    }
}

export async function getActiveTranslators() {
    try {
        const translators = await (prisma as any).translator.findMany({
            where: { is_deleted: false },
            select: { id: true, name: true }
        })
        return { success: true, data: translators }
    } catch (error) {
        return { success: false, error: "Failed to fetch translators" }
    }
}

export async function getTranslationProjectById(id: number) {
    try {
        const project = await (prisma as any).translatorbook.findUnique({
            where: { id },
            include: {
                books: true,
                translator: true,
            }
        });
        if (!project) return { success: false, error: "Project not found" };
        return { success: true, data: project };
    } catch (error) {
        return { success: false, error: "Failed to fetch project" };
    }
}

export async function updateTranslationProject(id: number, data: Partial<TranslationProjectFormValues>) {
    try {
        console.log("Update received data:", JSON.stringify(data));
        const updateData: any = { updatedAt: new Date() };
        
        if (data.bookId) updateData.bookId = data.bookId;
        if (data.translator_id) updateData.translator_id = data.translator_id;
        if (data.Status) updateData.Status = data.Status;
        if (data.cost !== undefined) updateData.cost = data.cost;
        if (data.payment_status) updateData.payment_status = data.payment_status;
        if (data.currently_paid !== undefined) updateData.currently_paid = data.currently_paid;
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);

console.log("Prisma update data:", JSON.stringify(updateData));
        const updated = await (prisma as any).translatorbook.update({
            where: { id },
            data: updateData
        });
        revalidatePath("/admin_dashboard/production/translation_work");
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update translation project:", error);
        return { success: false, error: "Failed to update project" };
    }
}

export async function deleteTranslationProject(id: number) {
    try {
        await (prisma as any).translatorbook.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() }
        });
        revalidatePath("/admin_dashboard/production/translation_work");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete project" };
    }
}

export async function updateTranslationProjectStatus(projectId: number, status: string) {
    try {
        const updated = await (prisma as any).translatorbook.update({
            where: { id: projectId },
            data: { Status: status as any, updatedAt: new Date() }
        });
        revalidatePath("/admin_dashboard/books");
        revalidatePath("/admin_dashboard/production/translation_work");
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
