import React from 'react'
import { AddBookForm } from '../../../../components/form_components/AddBookForm'
import { checkCurrentUserRole } from '../../../actions/book-shop-actions'

export default async function Addbook() {
    const permission = await checkCurrentUserRole("Adding Books")
    if (!permission.enabled) {
        return (
            <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center">
                    <h2 className="text-2xl font-black text-destructive uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-muted-foreground font-bold">You do not have the privilege to add books.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <AddBookForm />
        </div>
    )
}
