import React from 'react'
import { getNotifications } from '../../actions/notification-actions'
import { NotificationsTable } from '../../../components/admin_dashboard_components/NotificationsTable'
import { Bell } from 'lucide-react'

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
    const response = await getNotifications()
    const notifications = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">
                        Notifications <span className="text-secondarycolor not-italic">Center</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight">
                        Real-time updates, alerts, and operational bulletins.
                    </p>
                </div>
            </div>

            {response.success ? (
                <NotificationsTable data={notifications as any[]} />
            ) : (
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
                    Failed to load notifications. Please refresh the page.
                </div>
            )}
        </div>
    )
}
