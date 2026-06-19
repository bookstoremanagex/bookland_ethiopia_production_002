import React from 'react'
import { notFound } from 'next/navigation'
import prisma from "@/lib/prisma"
import { getCurrentSession } from "@/app/actions/auth-actions"
import PrinterFullHomeDashboard from '@/components/printer_full_dashboard_components/PrinterFullHomeDashboard'

export default async function PrinterFullHomePage() {
    const session = await getCurrentSession()
    if (!session?.email) return notFound()

    const printer = await (prisma as any).printer.findFirst({
        where: {
            email: session.email,
            is_deleted: false,
        },
        include: {
            printorder: {
                include: {
                    printorder_items: {
                        include: {
                            bookedition: {
                                include: { books: true }
                            }
                        }
                    },
                    printorder_payments: true
                }
            },
            bookeditionprinters: {
                where: { is_deleted: false },
                include: {
                    bookedition: {
                        include: { books: true }
                    }
                }
            }
        }
    })

    if (!printer) return notFound()

    return <PrinterFullHomeDashboard printer={printer} />
}
