import React from 'react'
import { notFound } from 'next/navigation'
import { MODULE_MAP } from '@/lib/module-mapping'

export default async function DynamicModulePage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ slug: string[] }>,
    searchParams: Promise<any>
}) {
    const { slug: slugParts } = await params
    const sParams = await searchParams
    const slug = slugParts.join('/')
    
    let ModuleComponent = MODULE_MAP[slug]
    let adjustedParams: any = { slug: slugParts }

    // Handle dynamic routes (e.g., books/123 -> books/detail)
    if (!ModuleComponent && slugParts.length > 1) {
        const id = slugParts[slugParts.length - 1]
        const prefix = slugParts.slice(0, -1).join('/')
        const detailKey = `${prefix}/detail`
        
        if (MODULE_MAP[detailKey]) {
            ModuleComponent = MODULE_MAP[detailKey]
            adjustedParams = { slug: slugParts, id }
        }
    }

    if (!ModuleComponent) {
        notFound()
    }

    // Since we're passing these to other Server Components, 
    // we should pass them as the expected Promise type if the component expects it,
    // but MODULE_MAP components often expect plain objects in this project's pattern.
    // To be safe and compatible with Next 15, we wrap them back in a Promise or pass them as is.
    // However, the BookDetailsPage specifically uses `await params`, so it needs a Promise.
    
    return <ModuleComponent params={Promise.resolve(adjustedParams)} searchParams={Promise.resolve(sParams)} />
}
