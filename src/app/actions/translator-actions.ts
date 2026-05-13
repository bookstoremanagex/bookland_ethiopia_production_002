"use server";

import prisma from "../../lib/prisma";
import { translatorSchema, type TranslatorFormValues } from "../../lib/validation/translator-schema";
import { revalidatePath } from "next/cache";

export async function getTranslators() {
  try {
    const translators = await (prisma as any).translator.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        _count: {
          select: { translatorbook: true }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map _count.translatorbook to _count.books for the frontend
    const mappedTranslators = translators.map((t: any) => ({
      ...t,
      _count: {
        books: t._count?.translatorbook || 0
      }
    }));

    return { success: true, data: mappedTranslators };
  } catch (error) {
    console.error("Failed to fetch translators:", error);
    return { success: false, error: "Failed to fetch translators" };
  }
}

export async function createTranslator(data: TranslatorFormValues) {
  const result = translatorSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    const translator = await (prisma as any).translator.create({
      data: {
        ...result.data,
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin_dashboard/production/translators");
    return { success: true, data: translator };
  } catch (error) {
    console.error("Failed to create translator:", error);
    return { success: false, error: "Failed to create translator" };
  }
}

export async function getTranslatorById(id: number) {
  try {
    const translator = await (prisma as any).translator.findUnique({
      where: { id },
      include: {
        translatorbook: {
          include: {
            books: true
          }
        }
      }
    });
    if (!translator) return { success: false, error: "Translator not found" };

    // Map translatorbook to books for the frontend
    const mappedTranslator = {
      ...translator,
      books: translator.translatorbook || []
    };

    return { success: true, data: mappedTranslator };
  } catch (error) {
    console.error("Failed to fetch translator:", error);
    return { success: false, error: "Failed to fetch translator" };
  }
}
