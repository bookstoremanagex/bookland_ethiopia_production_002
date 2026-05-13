import React from 'react';
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/app/actions/auth-actions";
import { notFound } from "next/navigation";
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await getCurrentSession();
  
  if (!session || !session.id) {
    notFound();
  }

  // Fetch full user data from DB
  const user = await (prisma as any).accounts.findUnique({
    where: { id: session.id, is_deleted: false }
  });

  if (!user) {
    notFound();
  }

  return (
    <ProfileClient 
      user={{
        id: user.id,
        name: user.name,
        email: user.account_email,
        role: user.account_type,
        status: user.account_status,
        createdAt: user.createdAt
      }} 
    />
  );
}
