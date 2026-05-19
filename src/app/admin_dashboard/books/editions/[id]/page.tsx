import React from 'react';
import { getEditionById } from '../../../../actions/edition-actions';
import { getAllStores } from '../../../../actions/store-inventory-actions';
import { notFound } from 'next/navigation';
import EditionDetailsClient from './EditionDetailsClient';

export const dynamic = "force-dynamic";

export default async function EditionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [response, storesRes] = await Promise.all([
    getEditionById(Number(id)),
    getAllStores()
  ]);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <EditionDetailsClient 
        initialEdition={response.data} 
        stores={storesRes.data || []}
    />
  );
}
