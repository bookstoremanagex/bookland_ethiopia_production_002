"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { translationProjectSchema, type TranslationProjectFormValues } from "../../lib/validation/translation-project-schema";

/** Unique, positive ids in the order they were picked (first = lead). */
function normalizeTranslatorIds(ids: number[] | undefined | null): number[] {
  return Array.from(new Set((ids ?? []).filter((id) => Number.isFinite(id) && id > 0)));
}

/** Paths that show project/edit data and therefore need refreshing. */
function revalidateProjectPaths() {
  revalidatePath("/admin_dashboard/production/translation_work");
  revalidatePath("/operation_manager_full_dashboard/production/translation-work");
  revalidatePath("/viewer_dashboard/production/translation-work");
  revalidatePath("/admin_dashboard/books");
}

/** The chosen edition has to exist and belong to the chosen book. */
async function assertEditionBelongsToBook(bookId: number, editionId: number) {
  const edition = await (prisma as any).bookedition.findFirst({
    where: { id: editionId, bookId, is_deleted: false },
    select: { id: true },
  });

  if (!edition) {
    return { ok: false as const, error: "The selected edition does not belong to that book" };
  }
  return { ok: true as const };
}

/** Forces an edition into the Translation stage (never throws). */
async function moveEditionToTranslation(editionId: number) {
  try {
    await (prisma as any).bookedition.update({
      where: { id: editionId },
      data: { productionstatus: "TRANSLATION", updatedAt: new Date() },
    });
  } catch (error) {
    console.error("Failed to move edition to translation:", error);
  }
}

/**
 * Projects created before `translator` became a many-to-many relation only have
 * the legacy `translator_id` column filled in. Resolve those into the relation
 * shape (read-only) so older projects still show their translator.
 */
async function withLegacyTranslators<T extends { translator?: any[]; translator_id?: number | null }>(
  projects: T[]
): Promise<T[]> {
  const missingIds = Array.from(
    new Set(
      projects
        .filter((project) => !(project.translator?.length) && project.translator_id)
        .map((project) => project.translator_id as number)
    )
  );

  if (missingIds.length === 0) return projects;

  try {
    const legacy = await (prisma as any).translator.findMany({
      where: { id: { in: missingIds } },
      select: { id: true, name: true },
    });

    return projects.map((project) =>
      project.translator?.length
        ? project
        : { ...project, translator: legacy.filter((translator: any) => translator.id === project.translator_id) }
    );
  } catch (error) {
    // Never fail the listing because the fallback lookup failed.
    console.error("Failed to resolve legacy translators:", error);
    return projects;
  }
}

export async function getTranslationProjects() {
  try {
    const projects = await (prisma as any).translatorbook.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        books: {
          include: {
            bookedition: {
              where: { is_deleted: false },
              select: { id: true, edition_name: true, productionstatus: true },
            },
          },
        },
        translator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: await withLegacyTranslators(projects) };
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

  const translatorIds = normalizeTranslatorIds(result.data.translator_ids);

  if (translatorIds.length === 0) {
    return { success: false, error: "At least one translator is required" };
  }

  try {
    // The edition must exist and belong to the chosen book.
    const editionCheck = await assertEditionBelongsToBook(result.data.bookId, result.data.edition_id);
    if (!editionCheck.ok) {
      return { success: false, error: editionCheck.error };
    }

    const project = await (prisma as any).translatorbook.create({
      data: {
        // Relation form is required because `translator` (the many-to-many
        // relation) can only be set through the checked create input.
        books: { connect: { id: result.data.bookId } },
        // Stored as a string because the column predates the relation.
        edition: String(result.data.edition_id),
        // Legacy single-translator column: the first pick is the lead.
        translator_id: translatorIds[0],
        // Full set of translators for this project.
        translator: { connect: translatorIds.map((id) => ({ id })) },
        Status: result.data.Status,
        cost: result.data.cost ?? null,
        payment_status: result.data.payment_status,
        currently_paid: result.data.currently_paid,
        info: result.data.info ?? "",
        startDate: result.data.startDate ? new Date(result.data.startDate) : null,
        endDate: result.data.endDate ? new Date(result.data.endDate) : null,
        updatedAt: new Date()
      },
      include: {
        books: true,
        translator: true,
      },
    });

    // Starting a translation project always moves the edition into the
    // Translation stage, whatever it was before.
    await moveEditionToTranslation(result.data.edition_id);

    revalidateProjectPaths();
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

/** Every book (any production status) with its live editions. */
export async function getAvailableBooks() {
    try {
        const books = await (prisma as any).books.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                title: true,
                unique_identification_code: true,
                book_image_url: true,
                bookedition: {
                    where: { is_deleted: false },
                    select: { id: true, edition_name: true, productionstatus: true },
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { title: "asc" },
        })
        return { success: true, data: books }
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return { success: false, error: "Failed to fetch books" }
    }
}

/**
 * Minimal inline book creation straight from the project form. Everything the
 * schema requires but the user does not care about (code + SKU) is generated.
 */
export async function quickCreateTranslationBook(data: {
    title: string;
    author?: string;
    category?: string;
    publication_year?: string;
    language?: string;
}) {
    const title = data.title?.trim();
    if (!title) {
        return { success: false, error: "Title is required" };
    }

    try {
        const unique_code = `BOOK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const sku = `SKU-${title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const book = await (prisma as any).books.create({
            data: {
                title,
                author: data.author?.trim() || null,
                category: data.category?.trim() || null,
                language: data.language?.trim() || null,
                publication_year: data.publication_year?.trim() || String(new Date().getFullYear()),
                unique_identification_code: unique_code,
                book_sku: sku,
                status: "available",
                productionstatus: "TRANSLATION",
                updatedAt: new Date(),
            },
            select: {
                id: true,
                title: true,
                unique_identification_code: true,
                book_image_url: true,
            },
        });

        revalidateProjectPaths();
        return { success: true, data: { ...book, bookedition: [] } };
    } catch (error) {
        console.error("Failed to create book:", error);
        return { success: false, error: "Failed to create book" };
    }
}

/**
 * Creates an edition that is only an empty shell: name + TRANSLATION status.
 * Every price/cost/count starts at 0 and every text field stays blank.
 */
export async function quickCreateTranslationEdition(data: { bookId: number; edition_name: string }) {
    const editionName = data.edition_name?.trim();
    if (!data.bookId) {
        return { success: false, error: "Book is required" };
    }
    if (!editionName) {
        return { success: false, error: "Edition name is required" };
    }

    try {
        const edition = await (prisma as any).bookedition.create({
            data: {
                edition_name: editionName,
                bookId: data.bookId,
                productionstatus: "TRANSLATION",
                // Blank text fields
                memo: null,
                book_image_url: null,
                book_id: null,
                // All numbers start at zero
                selling_price: 0,
                production_price: 0,
                printing_cost: 0,
                binding_cost: 0,
                design_cost: 0,
                translation_cost: 0,
                cover_price: 0,
                total_print_count: 0,
                number_of_pages: 0,
                editing_cost: 0,
                other_expenses: 0,
                transportation_cost: 0,
                count_remening_for_transfer: 0,
                translator_cost: 0,
                cover_design_cost: 0,
                text_design_cost: 0,
                editor_cost: 0,
                typewriting_cost: 0,
                store_cost: 0,
                distribution_cost: 0,
                advertisement_cost: 0,
                purchasing_right_cost: 0,
                updatedAt: new Date(),
            },
            select: { id: true, edition_name: true, productionstatus: true },
        });

        revalidateProjectPaths();
        return { success: true, data: edition };
    } catch (error) {
        console.error("Failed to create edition:", error);
        return { success: false, error: "Failed to create edition" };
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
        const [enriched] = await withLegacyTranslators([project]);
        return { success: true, data: enriched };
    } catch (error) {
        return { success: false, error: "Failed to fetch project" };
    }
}

export async function updateTranslationProject(id: number, data: Partial<TranslationProjectFormValues>) {
    try {
        const updateData: any = { updatedAt: new Date() };

        if (data.bookId) updateData.books = { connect: { id: data.bookId } };

        if (data.edition_id !== undefined) {
            // Edition + book must agree, otherwise the project would point at an
            // edition that belongs to another title.
            const bookId = data.bookId ?? (await (prisma as any).translatorbook.findUnique({
                where: { id },
                select: { bookId: true },
            }))?.bookId;

            if (!bookId) {
                return { success: false, error: "Book is required" };
            }

            const editionCheck = await assertEditionBelongsToBook(bookId, data.edition_id);
            if (!editionCheck.ok) {
                return { success: false, error: editionCheck.error };
            }

            updateData.edition = String(data.edition_id);
        }

        if (data.translator_ids !== undefined) {
            const translatorIds = normalizeTranslatorIds(data.translator_ids);
            if (translatorIds.length === 0) {
                return { success: false, error: "At least one translator is required" };
            }
            updateData.translator_id = translatorIds[0];
            // Replace the whole set so removals are persisted too.
            updateData.translator = { set: translatorIds.map((translatorId) => ({ id: translatorId })) };
        }

        if (data.Status) updateData.Status = data.Status;
        if (data.cost !== undefined) updateData.cost = data.cost;
        if (data.payment_status) updateData.payment_status = data.payment_status;
        if (data.currently_paid !== undefined) updateData.currently_paid = data.currently_paid;
        if (data.info !== undefined) updateData.info = data.info ?? "";
        if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
        if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;

        const updated = await (prisma as any).translatorbook.update({
            where: { id },
            data: updateData,
            include: {
                books: true,
                translator: true,
            },
        });

        if (data.edition_id !== undefined) {
            await moveEditionToTranslation(data.edition_id);
        }

        revalidateProjectPaths();
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
        revalidateProjectPaths();
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
        revalidateProjectPaths();
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
