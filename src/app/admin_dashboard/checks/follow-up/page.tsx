import { FileCheck } from "lucide-react";
import { getChecksFollowUp } from '@/app/actions/check-actions'
import ChecksFollowUpClient from './ChecksFollowUpClient'

export const dynamic = "force-dynamic"

export default async function ChecksFollowUpPage() {
    const res = await getChecksFollowUp()
    const checks = res.success ? res.data : []

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-primarycolor">
                    <FileCheck className="size-6" />
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Checks <span className="text-secondarycolor not-italic">Follow Up</span>
                    </h1>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                    All checks sorted by check date — soonest first
                </p>
            </div>

            {res.success ? (
                <ChecksFollowUpClient checks={checks} />
            ) : (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4">
                    <p className="text-destructive font-black text-xl uppercase">Error</p>
                    <p className="text-muted-foreground font-bold">Failed to load checks: {res.error}</p>
                </div>
            )}
        </div>
    )
}
