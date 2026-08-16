import React from 'react'
import { PenTool, Briefcase } from 'lucide-react'
import { getTranslationProjects } from '../../../actions/translation-project-actions'
import { TranslationProjectsTable } from '../../../../components/admin_dashboard_components/TranslationProjectsTable'

export default async function TranslationWorkPage() {
    const response = await getTranslationProjects()
    const projects = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-secondarycolor">
                        <Briefcase className="size-8" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] opacity-50">Operations</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Translation <span className="text-secondarycolor not-italic">Work</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-lg">
                        Track active assignments, deadlines, and completion status for all translation projects.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-3xl border-2 border-primarycolor/10 shadow-lg">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-2xl font-black text-primarycolor">{projects.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Projects</span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <PenTool className="size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Work Pipeline</span>
                    </div>
                </div>
            </div>

            {response.success ? (
                <TranslationProjectsTable data={projects as any[]} />
            ) : (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2rem] text-center space-y-4">
                    <div className="size-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto">
                        <PenTool className="size-8" />
                    </div>
                    <h3 className="text-xl font-black text-destructive uppercase">Pipeline Error</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                        We couldn't synchronize with the translation database. Please check your connection.
                    </p>
                </div>
            )}
        </div>
    )
}
