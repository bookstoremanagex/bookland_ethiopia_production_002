import React from 'react'
import { Truck } from 'lucide-react'

export default function DeliverySamplePage() {
  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-2 w-full lg:w-auto">
          <div className="flex items-center gap-3 text-secondarycolor">
            <Truck className="size-5 md:size-6" />
            <span className="text-[9px] md:text-xs font-normal uppercase tracking-[0.3em] opacity-50">Delivery Sample</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Delivery <span className="text-secondarycolor not-italic">Sample</span>
          </h1>
          <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
            Delivery Sample Management
          </p>
        </div>
      </div>
    </div>
  )
}
