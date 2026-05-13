import React from 'react'
import { 
    TableProperties, 
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import MenuManagementClient from './MenuManagementClient'

export default function MenuManagementPage() {
    return (
        <div className="p-6 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <TableProperties className="size-8" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] opacity-50">System Configuration</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primarycolor uppercase italic leading-none">
                        Menu <span className="text-secondarycolor not-italic">Management</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-lg">
                        Define which navigation modules are visible for each specific dashboard type.
                    </p>
                </div>

                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                    <Link href="/admin_dashboard/settings" className="flex items-center gap-1">
                        <ArrowLeft className="size-3" /> Back to Settings
                    </Link>
                </Button>
            </div>

            <MenuManagementClient />
        </div>
    )
}
