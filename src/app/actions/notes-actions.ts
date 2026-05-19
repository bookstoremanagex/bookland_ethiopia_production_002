"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  try {
    const notes = await (prisma as any).notes.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        accounts: {
          select: {
            name: true,
            account_email: true,
            account_type: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: notes || [] };
  } catch (error: any) {
    console.warn("Database empty or notes not found. Defaulting to empty list.", error);
    return { success: true, data: [] };
  }
}

export async function deleteNote(id: number) {
  try {
    const deleted = await (prisma as any).notes.update({
      where: { id },
      data: {
        is_deleted: true,
      },
    });
    revalidatePath("/admin_dashboard/notes");
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return { success: false, error: error.message || "Failed to delete note" };
  }
}

export async function createNote(title: string, note_content: string, accountId: number) {
  try {
    const newNote = await (prisma as any).notes.create({
      data: {
        title,
        note_content,
        accountId: Number(accountId),
        updatedAt: new Date(),
      },
      include: {
        accounts: {
          select: {
            name: true,
            account_email: true,
            account_type: true,
          }
        }
      }
    });
    revalidatePath("/admin_dashboard/notes");
    return { success: true, data: newNote };
  } catch (error: any) {
    console.error("Error creating note:", error);
    return { success: false, error: error.message || "Failed to create note" };
  }
}

export async function getNoteById(id: number) {
  try {
    const note = await (prisma as any).notes.findFirst({
      where: {
        id,
        is_deleted: false,
      },
      include: {
        accounts: {
          select: {
            name: true,
            account_email: true,
            account_type: true,
          }
        }
      }
    });
    return { success: true, data: note };
  } catch (error: any) {
    console.error("Error fetching note by ID:", error);
    return { success: false, error: error.message || "Failed to fetch note" };
  }
}

export async function updateNote(id: number, title: string, note_content: string) {
  try {
    const updated = await (prisma as any).notes.update({
      where: { id },
      data: {
        title,
        note_content,
        updatedAt: new Date(),
      },
      include: {
        accounts: {
          select: {
            name: true,
            account_email: true,
            account_type: true,
          }
        }
      }
    });
    revalidatePath("/admin_dashboard/notes");
    revalidatePath(`/admin_dashboard/notes/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating note:", error);
    return { success: false, error: error.message || "Failed to update note" };
  }
}
