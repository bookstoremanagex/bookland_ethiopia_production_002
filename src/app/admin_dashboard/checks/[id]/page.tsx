import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import CheckDetailClient from "./CheckDetailClient"

export const dynamic = "force-dynamic"

export default async function CheckDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const checkId = parseInt(id)

    const check = await (prisma as any).checks.findUnique({
        where: { id: checkId }
    })

    if (!check || check.is_deleted) {
        notFound()
    }

    return <CheckDetailClient check={check} />
}
