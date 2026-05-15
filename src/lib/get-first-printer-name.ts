import prisma from "@/lib/prisma";

export type FirstPrinterNameResult =
  | { ok: true; name: string }
  | { ok: false };

export async function getFirstPrinterName(): Promise<FirstPrinterNameResult> {
  try {
    const printer = await prisma.printer.findFirst({
      where: { is_deleted: false },
      orderBy: { id: "asc" },
      select: { name: true },
    });

    if (!printer?.name?.trim()) {
      return { ok: false };
    }

    return { ok: true, name: printer.name.trim() };
  } catch {
    return { ok: false };
  }
}
