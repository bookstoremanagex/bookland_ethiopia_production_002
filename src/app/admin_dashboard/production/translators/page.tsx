import React from 'react'
import { Languages, Users } from 'lucide-react'
import { getTranslators } from '../../../actions/translator-actions'
import { TranslatorsTable } from '../../../../components/admin_dashboard_components/TranslatorsTable'

export default async function TranslatorsPage() {
    const response = await getTranslators()
    const translators = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-secondarycolor">
                        <Users className="size-8" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] opacity-50">Operations</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Translators <span className="text-secondarycolor not-italic">Management</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-lg">
                        Manage your creative linguists and track their translation assignments.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-3xl border-2 border-primarycolor/10 shadow-lg">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-2xl font-black text-primarycolor">{translators.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Members</span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <Languages className="size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Translation Hub</span>
                    </div>
                </div>
            </div>

            {response.success ? (
                <TranslatorsTable data={translators as any[]} />
            ) : (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2rem] text-center space-y-4">
                    <div className="size-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto">
                        <Languages className="size-8" />
                    </div>
                    <h3 className="text-xl font-black text-destructive uppercase">Synchronization Error</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                        We encountered an issue while retrieving the translator records. Please verify your connection or try again later.
                    </p>
                </div>
            )}
        </div>
    )
}
