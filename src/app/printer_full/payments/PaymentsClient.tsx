"use client"

import React from 'react'
import { Banknote, ArrowUpDown, Search } from 'lucide-react'
import { useCalendar } from '@/lib/calendar-context'
import { cn } from '@/lib/utils'

interface PaymentsClientProps {
  printer: any
}

export default function PaymentsClient({ printer }: PaymentsClientProps) {
  const { formatDate } = useCalendar()
  const [search, setSearch] = React.useState('')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const payments = React.useMemo(() => {
    const rows: {
      id: number
      projectName: string
      projectId: number
      amount: number
      paymentDate: Date
      reference: string | null
    }[] = []

    printer.printorder.forEach((order: any) => {
      ;(order.printorder_payments || []).forEach((payment: any) => {
        rows.push({
          id: payment.id,
          projectName: order.project_name || `Project #${order.id}`,
          projectId: order.id,
          amount: payment.amount,
          paymentDate: new Date(payment.payment_date),
          reference: payment.reference || null,
        })
      })
    })

    rows.sort((a, b) => {
      const diff = a.paymentDate.getTime() - b.paymentDate.getTime()
      return sortDir === 'desc' ? -diff : diff
    })

    if (!search.trim()) return rows

    const q = search.toLowerCase()
    return rows.filter(
      (r) =>
        r.projectName.toLowerCase().includes(q) ||
        (r.reference && r.reference.toLowerCase().includes(q)),
    )
  }, [printer.printorder, search, sortDir])

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0)

  const toggleSort = () => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Banknote className="size-5.5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payments</h1>
            <p className="text-sm font-bold text-slate-400">
              {payments.length} payment{payments.length !== 1 ? 's' : ''} across {printer.printorder.length} project{printer.printorder.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 rounded-xl px-4 py-2.5 text-center">
            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Total Paid</p>
            <p className="text-lg font-black text-emerald-700">{totalAmount.toLocaleString()} ETB</p>
          </div>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project or memo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border-2 border-slate-100 bg-white text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-primarycolor/30 focus:ring-2 focus:ring-primarycolor/10 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={toggleSort}
          className="h-10 px-4 rounded-xl border-2 border-slate-100 bg-white text-xs font-black uppercase tracking-widest text-slate-500 hover:border-primarycolor/30 hover:text-primarycolor transition-all flex items-center gap-2"
        >
          <ArrowUpDown className="size-3.5" />
          {sortDir === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Banknote className="size-8 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">
            {search.trim() ? 'No payments match your search' : 'No payments recorded yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-3.5 pl-6 pr-4 w-12">#</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 pr-6 pl-4">Memo / Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr
                    key={payment.id}
                    className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <span className="text-xs font-bold text-slate-300">{idx + 1}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-slate-700">
                        {payment.projectName}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-emerald-600">
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}{' '}
                        ETB
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-500">
                        {formatDate(payment.paymentDate)}
                      </span>
                    </td>
                    <td className="py-4 pr-6 pl-4">
                      {payment.reference ? (
                        <span className="text-xs font-bold text-slate-400 max-w-[240px] block truncate">
                          {payment.reference}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 italic">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-slate-100">
            {payments.map((payment, idx) => (
              <div key={payment.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {payment.projectName}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <span className="font-black text-emerald-600 shrink-0">
                    {payment.amount.toLocaleString()} ETB
                  </span>
                </div>
                {payment.reference && (
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Memo
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">{payment.reference}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
