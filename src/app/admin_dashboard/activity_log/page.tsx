import React from 'react'
import { getActivityLogs } from '../../actions/activity-log-actions'
import { ActivityLogsTable } from '../../../components/admin_dashboard_components/ActivityLogsTable'

export const dynamic = "force-dynamic";

export default async function ActivityLogPage() {
    const response = await getActivityLogs()
    const logs = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">
                        Activity <span className="text-secondarycolor not-italic">Logs</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight">
                        Complete system audit log and security event tracker.
                    </p>
                </div>
            </div>

            {response.success ? (
                <ActivityLogsTable data={logs as any[]} />
            ) : (
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
                    Failed to load activity logs. Please refresh the page.
                </div>
            )}
        </div>
    )
}
