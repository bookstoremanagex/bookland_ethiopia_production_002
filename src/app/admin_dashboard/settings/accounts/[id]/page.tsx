import React from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AccountDetailClient from './AccountDetailClient';

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accountId = parseInt(id);
  
  if (isNaN(accountId)) {
    notFound();
  }

  const account = await (prisma as any).accounts.findUnique({
    where: { id: accountId, is_deleted: false },
    include: {
      roles: {
        where: { is_deleted: false }
      }
    }
  });

  if (!account) {
    notFound();
  }

  const roletypes = await (prisma as any).roletypes.findMany({
    where: { is_deleted: false },
    orderBy: { id: "asc" }
  });

  return <AccountDetailClient account={account} roletypes={roletypes} />;
}
