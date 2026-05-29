import { getChecks } from '../../actions/check-actions'
import ChecksTable from './ChecksTable'
import CreateCheckButton from './CreateCheckButton'

export const dynamic = "force-dynamic"

export default async function ChecksPage() {
    const res = await getChecks()
    const checks = res.success ? res.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Manage <span className="text-secondarycolor not-italic">Checks</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight">
                        Track and monitor all cheques across the organisation.
                    </p>
                </div>
                <CreateCheckButton />
            </div>

            {res.success ? (
                <ChecksTable data={checks} />
            ) : (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4">
                    <p className="text-destructive font-black text-xl uppercase">Critical Error</p>
                    <p className="text-muted-foreground font-bold">Failed to load checks: {res.error}</p>
                </div>
            )}
        </div>
    )
}
