import prisma from '../../../../lib/prisma'
import { notFound } from 'next/navigation'
import EditableBookContent from './EditableBookContent'
import { getBookShops } from '../../../actions/book-shop-actions'

export default async function InventoryBookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [book, shopsRes] = await Promise.all([
        prisma.books.findUnique({
            where: { unique_identification_code: id },
            include: {
                bookedition: {
                    where: { is_deleted: false },
                    include: {
                        bookeditionstores: {
                            where: { is_deleted: false },
                            include: { stores: true }
                        },
                        bookshopeditions: {
                            where: { is_deleted: false },
                            include: { bookshopes: true }
                        },
                        printorder_items: {
                            where: { printorder: { is_deleted: false } },
                            include: {
                                printorder: {
                                    include: { printer: true }
                                }
                            },
                            take: 1
                        },
                        bookeditionprinters: {
                            where: { is_deleted: false },
                            include: { printer: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                translatorbook: {
                    where: { is_deleted: false },
                    include: {
                        translator: true
                    }
                }
            }
        }),
        getBookShops()
    ])

    if (!book || book.is_deleted) {
        notFound()
    }

    return (
        <EditableBookContent book={book} bookShops={shopsRes.data || []} />
    )
}