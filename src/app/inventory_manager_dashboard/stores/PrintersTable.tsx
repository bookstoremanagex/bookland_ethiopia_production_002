"use client"

import { Printer, MapPin, Phone, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrintersTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-[3rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
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
                    <Button variant="ghost" size="icon" disabled className="rounded-full text-slate-300">
                      <ChevronRight className="size-4" />
                    </Button>
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

      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {data.length > 0 ? (
          data.map((printer: any) => (
            <div
              key={printer.id}
              className="block bg-white rounded-2xl border-2 border-primarycolor/5 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                    <Printer className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-primarycolor text-sm leading-tight truncate">{printer.name}</div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Partner ID: #{printer.id}</div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-primarycolor/30 shrink-0 mt-1" />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primarycolor/40 shrink-0" />
                  <span className="font-bold text-primarycolor text-xs truncate">{printer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primarycolor/40 shrink-0" />
                  <span className="font-bold text-primarycolor text-xs truncate">{printer.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center space-y-4 opacity-30">
            <Printer className="size-12 mx-auto" />
            <p className="text-sm font-black uppercase tracking-widest">No printers registered</p>
          </div>
        )}
      </div>
    </div>
  )
}
