import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getCurrentSession } from "@/app/actions/auth-actions"
import CheckDetailClient from "./CheckDetailClient"

export const dynamic = "force-dynamic"

export default async function CheckDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const checkId = parseInt(id)

    const [check, session] = await Promise.all([
        (prisma as any).checks.findUnique({ where: { id: checkId } }),
        getCurrentSession(),
    ])

    if (!check || check.is_deleted) {
        notFound()
    }

    return <CheckDetailClient check={check} isAdmin={session?.role === "ADMIN"} />
}
