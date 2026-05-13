import React from 'react';
import {
  getTranslationProjectById,
  getAvailableBooks,
  getActiveTranslators
} from '../../../../actions/translation-project-actions';
import { notFound } from 'next/navigation';
import ProjectDetailsClient from './ProjectDetailsClient';

interface ProjectDetailsPageProps {
  params: { id: string };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [projectRes, booksRes, translatorsRes] = await Promise.all([
    getTranslationProjectById(Number(id)),
    getAvailableBooks(),
    getActiveTranslators()
  ]);

  if (!projectRes.success || !projectRes.data) {
    notFound();
  }

  return (
    <ProjectDetailsClient
      initialProject={projectRes.data}
      books={booksRes.data || []}
      translators={translatorsRes.data || []}
    />
  );
}
