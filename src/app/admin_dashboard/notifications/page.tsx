import React from 'react'
import { getNotifications } from '../../actions/notification-actions'
import { getCurrentSession } from '../../actions/auth-actions'
import { NotificationsTable } from '../../../components/admin_dashboard_components/NotificationsTable'
import { Bell } from 'lucide-react'

export const dynamic = "force-dynamic";

const ROLE_TO_NOTIFICATION_TO: Record<string, string> = {
    "ADMIN": "ADMIN",
    "Operations Manager": "OPERATION_MANAGER",
    "Inventory Manager": "INVENTORY_MANAGER",
    "Finance Officer": "FINANCE",
    "Sales Staff": "DELIVERY_AND_SALES",
    "Delivery and Sales Management": "DELIVERY_AND_SALES",
    "Delivery Sample": "DELIVERY_AND_SALES",
    "Printer": "PRINTER",
    "Viewer": "DATA_VIEWER",
};

export default async function NotificationsPage() {
    const session = await getCurrentSession()
    const accountId = session?.id || undefined
    const notificationTo = session?.role ? ROLE_TO_NOTIFICATION_TO[session.role] : undefined
    const response = await getNotifications(accountId, notificationTo)
    const notifications = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
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
