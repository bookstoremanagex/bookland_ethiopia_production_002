import React from 'react'
import { getStores } from '../../actions/get-stores'
import { StoresTable } from '../../../components/admin_dashboard_components/StoresTable'

export default async function StoresPage() {
    const response = await getStores()
    const stores = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 space-y-2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">Stores <span className="text-secondarycolor not-italic">Management</span></h1>
                <p className="text-muted-foreground font-bold tracking-tight">Manage your physical locations and monitor operational status across the network.</p>
            </div>

            {response.success ? (
                <StoresTable data={stores as never[]} />
            ) : (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4">
                    <p className="text-destructive font-black text-xl uppercase">Critical Error</p>
                    <p className="text-muted-foreground font-bold">Failed to load stores: {response.error}</p>
                </div>
            )}
        </div>
    )
}
