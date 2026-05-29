import React from 'react'
import { AddStoreForm } from '@/components/form_components/AddStoreForm'
import { checkCurrentUserRole } from '../../../actions/book-shop-actions'

export default async function AddStoresPage() {
    const permission = await checkCurrentUserRole("Adding Stores")
    if (!permission.enabled) {
        return (
            <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center">
                    <h2 className="text-2xl font-black text-destructive uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-muted-foreground font-bold">You do not have the privilege to add stores.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen py-16 px-4 md:px-8">
            <AddStoreForm />
        </div>
    )
}
