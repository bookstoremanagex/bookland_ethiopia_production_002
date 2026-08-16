import React, { Suspense } from 'react'
import { getAvailableBooks, getActiveTranslators } from '../../../../actions/translation-project-actions'
import { NewTranslationProjectForm } from '../../../../../components/form_components/NewTranslationProjectForm'

export default async function NewProjectPage() {
    const [booksRes, translatorsRes] = await Promise.all([
        getAvailableBooks(),
        getActiveTranslators()
    ])

    const books = booksRes.success ? booksRes.data : []
    const translators = translatorsRes.success ? translatorsRes.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <Suspense fallback={<div className="text-muted-foreground text-sm">Loading form…</div>}>
                <NewTranslationProjectForm 
                    books={books as any[]} 
                    translators={translators as any[]} 
                />
            </Suspense>
        </div>
    )
}
