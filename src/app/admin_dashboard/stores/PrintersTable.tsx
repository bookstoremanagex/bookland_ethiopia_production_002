"use client"

import { Printer, MapPin, Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrintersTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-[3rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-100 bg-slate-50/50">
              <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">Printer</th>
              <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">Location</th>
              <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">Contact</th>
              <th className="h-16 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((printer: any) => (
                <tr key={printer.id} className="h-20 border-b border-slate-50 hover:bg-primarycolor/[0.02] transition-colors">
                  <td className="px-8">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                        <Printer className="size-5" />
                      </div>
                      <div>
                        <div className="font-black text-primarycolor leading-tight">{printer.name}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Partner ID: #{printer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-primarycolor/40" />
                      <span className="font-bold text-primarycolor text-xs">{printer.location}</span>
                    </div>
                  </td>
                  <td className="px-8">
                    <div className="text-[10px] font-bold text-primarycolor">{printer.phone || "N/A"}</div>
                  </td>
                  <td className="px-8 text-right">
                    <Link href={`/admin_dashboard/printing/printers/${printer.id}`}>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm">
                        <ExternalLink className="size-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <Printer className="size-12" />
                    <p className="text-sm font-black uppercase tracking-widest">No printers registered</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
