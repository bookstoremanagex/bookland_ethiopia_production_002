import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AccountsTable from '@/components/admin_dashboard_components/AccountsTable';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
    const accounts = await prisma.accounts.findMany({
        where: {
            is_deleted: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

  return (
        <div className="px-4 py-6 sm:p-8 mx-auto w-full min-w-0 max-w-full overflow-hidden sm:overflow-visible space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tight">Accounts Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">View and manage all system accounts</p>
                </div>
                <Link
                    href="/admin_dashboard/settings/accounts/add_account"
                    className="inline-flex items-center justify-center gap-2 bg-primarycolor hover:bg-primarycolor/90 text-white px-6 py-3.5 rounded-2xl font-bold tracking-wide shadow-xl shadow-primarycolor/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
                >
                    <Plus className="size-5" />
                    <span>Add Account</span>
                </Link>
            </div>

            <AccountsTable accounts={accounts} />
        </div>
    );
}
