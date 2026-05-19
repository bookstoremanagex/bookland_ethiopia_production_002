import React from 'react'
import prisma from '../../../../lib/prisma'
import { notFound } from 'next/navigation'
import StoreDetailsClient from './StoreDetailsClient'

export const dynamic = "force-dynamic";

export default async function StoreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const store = await (prisma as any).stores.findUnique({
        where: { id: parseInt(id) },
        include: {
            bookeditionstores: {
                where: { is_deleted: false },
                include: {
                    bookedition: {
                        include: {
                            books: true
                        }
                    }
                }
            }
        }
    })

    if (!store || store.is_deleted) {
        notFound()
    }

    return <StoreDetailsClient store={store} />
}
