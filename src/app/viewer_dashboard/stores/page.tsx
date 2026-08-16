import React from 'react'
import { getStores } from '../../actions/get-stores'
import { StoresTable } from '../../../components/viewer_dashboard_components/StoresTable'

export default async function ViewerStoresPage() {
    const storesResponse = await getStores()
    const stores = storesResponse.success ? storesResponse.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div>
                <div className="mb-10 space-y-2 text-center md:text-left">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Stores <span className="text-secondarycolor not-italic">Network</span></h1>
                    <p className="text-muted-foreground font-bold tracking-tight">View physical locations and operational status across the network.</p>
                </div>

                {storesResponse.success ? (
                    <StoresTable data={stores as never[]} />
                ) : (
                    <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4">
                        <p className="text-destructive font-black text-xl uppercase">Critical Error</p>
                        <p className="text-muted-foreground font-bold">Failed to load stores: {storesResponse.error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}