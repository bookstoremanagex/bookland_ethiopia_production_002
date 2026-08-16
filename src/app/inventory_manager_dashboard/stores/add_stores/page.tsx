import React from 'react'
import { AddStoreForm } from '@/components/form_components/AddStoreForm'

export default async function InventoryAddStoresPage() {
    return (
        <div className="w-full min-h-screen py-16 px-4 md:px-8">
            <AddStoreForm />
        </div>
    )
}