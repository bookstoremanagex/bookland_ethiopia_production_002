import prisma from '../../../../lib/prisma'
import { notFound } from 'next/navigation'
import EditableBookContent from './EditableBookContent'
import { getBookShops, checkCurrentUserRole } from '../../../actions/book-shop-actions'

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const permission = await checkCurrentUserRole("Viewing Books")
    if (!permission.enabled) {
        return (
            <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center">
                    <h2 className="text-2xl font-black text-destructive uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-muted-foreground font-bold">You do not have the privilege to view books.</p>
                </div>
            </div>
        )
    }

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
