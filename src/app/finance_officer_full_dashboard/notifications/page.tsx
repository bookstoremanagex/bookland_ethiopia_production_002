import { getNotifications } from '../../actions/notification-actions'
import { NotificationsTable } from '../../../components/admin_dashboard_components/NotificationsTable'
import { Bell } from 'lucide-react'

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
    const response = await getNotifications(undefined, "ADMIN")
    const notifications = response.success ? response.data : []

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
            <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="mb-6 flex justify-center">
                    <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                        <Bell className="size-7" />
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
        </div>
    )
}