import React from 'react'
import { getStores } from '../../actions/get-stores'
import { getPrinters } from '../../actions/printer-actions'
import { StoresTable } from '../../../components/admin_dashboard_components/StoresTable'
import PrintersTable from './PrintersTable'

export default async function StoresPage() {
    const storesResponse = await getStores()
    const printersResponse = await getPrinters()
    const stores = storesResponse.success ? storesResponse.data : []
    const printers = printersResponse.success ? printersResponse.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto space-y-20">
            <div>
                <div className="mb-10 space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">Stores <span className="text-secondarycolor not-italic">Management</span></h1>
                    <p className="text-muted-foreground font-bold tracking-tight">Manage your physical locations and monitor operational status across the network.</p>
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

            <div>
                <div className="mb-8 space-y-1 px-4">
                    <h2 className="text-3xl font-black tracking-tight text-primarycolor uppercase italic">Printing <span className="text-secondarycolor not-italic">Partners</span></h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">External printing facilities</p>
                </div>

                {printersResponse.success ? (
                    <PrintersTable data={printers} />
                ) : (
                    <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4">
                        <p className="text-destructive font-black text-xl uppercase">Critical Error</p>
                        <p className="text-muted-foreground font-bold">Failed to load printers: {printersResponse.error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
