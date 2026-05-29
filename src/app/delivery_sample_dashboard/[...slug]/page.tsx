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

    return <ModuleComponent params={Promise.resolve(adjustedParams)} searchParams={Promise.resolve(sParams)} />
}
