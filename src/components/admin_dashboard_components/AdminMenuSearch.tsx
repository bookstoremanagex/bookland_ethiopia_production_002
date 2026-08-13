"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronsUpDown,
  Home,
  Bell,
  FileText,
  User,
  BookOpen,
  Library,
  ShieldAlert,
  ShoppingBag,
  ClipboardList,
  Repeat,
  BadgeDollarSign,
  History,
  Store,
  BarChart3,
  FileCheck,
  Clock,
  Settings,
  Package,
  Languages,
  PenTool,
  Printer,
  List,
  FileSignature,
  Truck,
  Receipt,
  TableProperties,
  BookCopy,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  UserCog,
  Palette,
  AlertTriangle,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuEntry {
  title: string
  url: string
  group: string
  icon: LucideIcon
}

const menuEntries: MenuEntry[] = [
  { title: "Home", url: "/admin_dashboard", group: "Management", icon: Home },
  { title: "Notifications", url: "/admin_dashboard/notifications", group: "Management", icon: Bell },
  { title: "Notes", url: "/admin_dashboard/notes", group: "Management", icon: FileText },
  { title: "Profile", url: "/admin_dashboard/profile", group: "Management", icon: User },
  { title: "Books", url: "/admin_dashboard/books", group: "Management", icon: BookOpen },
  { title: "Book Shelf", url: "/admin_dashboard/books/shelf", group: "Management", icon: Library },
  { title: "Damaged Books", url: "/admin_dashboard/books/damaged", group: "Management", icon: ShieldAlert },
  { title: "Book Shop", url: "/admin_dashboard/book_shops", group: "Management", icon: ShoppingBag },
  { title: "Manage Orders", url: "/admin_dashboard/manage_orders", group: "Management", icon: ClipboardList },
  { title: "Manage Rounds", url: "/admin_dashboard/round-books", group: "Management", icon: Repeat },
  { title: "Manage Payment", url: "/admin_dashboard/manage_payment", group: "Management", icon: BadgeDollarSign },
  { title: "Selling to individual", url: "/admin_dashboard/retail_management", group: "Management", icon: ShoppingBag },
  { title: "Activity Log", url: "/admin_dashboard/activity_log", group: "Management", icon: History },

  { title: "Retail Shop Main", url: "/admin_dashboard/retail-shop", group: "Retail Shop", icon: Store },
  { title: "Our Books", url: "/admin_dashboard/retail-shop/our-books", group: "Retail Shop", icon: BookOpen },
  { title: "Retail Orders", url: "/admin_dashboard/retail-shop/orders", group: "Retail Shop", icon: ClipboardList },

  { title: "Statistics General", url: "/admin_dashboard/statistics", group: "Statistics", icon: BarChart3 },
  { title: "Statistics Books", url: "/admin_dashboard/statistics/books", group: "Statistics", icon: BookOpen },
  { title: "Statistics Stores", url: "/admin_dashboard/statistics/stores", group: "Statistics", icon: Store },
  { title: "Statistics Income", url: "/admin_dashboard/statistics/income", group: "Statistics", icon: BarChart3 },

  { title: "Checks List", url: "/admin_dashboard/checks", group: "Manage Checks", icon: FileCheck },
  { title: "Check Dates", url: "/admin_dashboard/checks/dates", group: "Manage Checks", icon: Clock },

  { title: "Manage Store", url: "/admin_dashboard/stores", group: "Stores", icon: Store },
  { title: "Store Options", url: "/admin_dashboard/stores/options", group: "Stores", icon: Settings },

  { title: "Production Books", url: "/admin_dashboard/production/books", group: "Production", icon: Package },
  { title: "Low Stock", url: "/admin_dashboard/production/low-stock", group: "Production", icon: AlertTriangle },

  { title: "Translators", url: "/admin_dashboard/production/translators", group: "Translations", icon: Languages },
  { title: "Translation Work", url: "/admin_dashboard/production/translation_work", group: "Translations", icon: PenTool },
  { title: "Translation Books", url: "/admin_dashboard/production/translations/books", group: "Translations", icon: BookOpen },

  { title: "Printers", url: "/admin_dashboard/printing/printers", group: "Printing", icon: Printer },
  { title: "Manage Printing", url: "/admin_dashboard/printing/manage", group: "Printing", icon: ClipboardList },
  { title: "Books List", url: "/admin_dashboard/printing/list", group: "Printing", icon: List },
  { title: "Printing Info", url: "/admin_dashboard/printing/info", group: "Printing", icon: BarChart3 },
  { title: "Delivery Records", url: "/admin_dashboard/printing/delivery-records", group: "Printing", icon: FileText },

  { title: "Contracts", url: "/admin_dashboard/document_management/contracts", group: "Document Management", icon: FileSignature },
  { title: "Print agreements", url: "/admin_dashboard/document_management/print_agreements", group: "Document Management", icon: FileText },
  { title: "Delivery notes", url: "/admin_dashboard/document_management/delivery_notes", group: "Document Management", icon: Truck },
  { title: "Invoices", url: "/admin_dashboard/document_management/invoices", group: "Document Management", icon: Receipt },
  { title: "Approval documents", url: "/admin_dashboard/document_management/approval_documents", group: "Document Management", icon: FileCheck },

  { title: "Finance Book Shop", url: "/admin_dashboard/finance/book_shop", group: "Finance", icon: ShoppingBag },
  { title: "Finance Books", url: "/admin_dashboard/finance/books", group: "Finance", icon: BookOpen },
  { title: "Shop Table", url: "/admin_dashboard/finance/shop_table", group: "Finance", icon: TableProperties },
  { title: "Edition Table", url: "/admin_dashboard/finance/edition_table", group: "Finance", icon: BookCopy },
  { title: "Finance Costs", url: "/admin_dashboard/finance/costs", group: "Finance", icon: FileText },
  { title: "Finance Printing", url: "/admin_dashboard/finance/printing", group: "Finance", icon: Printer },
  { title: "Round Info", url: "/admin_dashboard/finance/round-info", group: "Finance", icon: Repeat },
  { title: "Payments Due", url: "/admin_dashboard/finance/payments-due", group: "Finance", icon: BadgeDollarSign },
  { title: "Daily Report", url: "/admin_dashboard/finance/daily-report", group: "Finance", icon: CalendarDays },
  { title: "Period Report", url: "/admin_dashboard/finance/period-report", group: "Finance", icon: CalendarRange },

  { title: "Completed Deliveries", url: "/admin_dashboard/reports/completed_deliveries", group: "Reports", icon: CheckCircle2 },
  { title: "Pending Deliveries", url: "/admin_dashboard/reports/pending_deliveries", group: "Reports", icon: Clock },

  { title: "Accounts", url: "/admin_dashboard/settings/accounts", group: "Settings", icon: UserCog },
  { title: "Retail Shop Accounts", url: "/admin_dashboard/settings/retail-shop-accounts", group: "Settings", icon: Store },
  { title: "Menu Management", url: "/admin_dashboard/settings/menus", group: "Settings", icon: TableProperties },
  { title: "Theme Customization", url: "/admin_dashboard/settings/theme", group: "Settings", icon: Palette },
]

const groups = Array.from(new Set(menuEntries.map((m) => m.group)))

export default function AdminMenuSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState("all")
  const [groupOpen, setGroupOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menuEntries.filter((m) => {
      const matchesGroup = groupFilter === "all" || m.group === groupFilter
      if (!matchesGroup) return false
      if (!q) return true
      return (
        m.title.toLowerCase().includes(q) ||
        m.group.toLowerCase().includes(q) ||
        m.url.toLowerCase().includes(q)
      )
    })
  }, [query, groupFilter])

  useEffect(() => {
    setHighlighted(0)
  }, [query, groupFilter])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const goTo = (url: string) => {
    setOpen(false)
    setQuery("")
    setGroupFilter("all")
    router.push(url)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filtered[highlighted]) goTo(filtered[highlighted].url)
    }
  }

  return (
    <div ref={containerRef} className="relative hidden md:block w-64 lg:w-80 shrink-0">
      <div className="flex items-center gap-1.5 h-10 px-2 rounded-xl border border-primarycolor/10 bg-white shadow-sm focus-within:border-primarycolor/40 focus-within:ring-2 focus-within:ring-primarycolor/10 transition-all">
        <Search className="size-4 text-primarycolor/50 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search menus..."
          className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-semibold min-w-0"
        />
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors shrink-0"
          >
            esc
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-full sm:w-96 rounded-2xl border border-primarycolor/10 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Group filter dropdown */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <button
                onClick={() => {
                  const next = !groupOpen
                  setGroupOpen(next)
                }}
                className="flex items-center justify-between w-full h-9 px-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 hover:border-primarycolor/30 hover:bg-white transition-all text-left"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {groupFilter === "all" ? "All Groups" : groupFilter}
                </span>
                <ChevronsUpDown className="size-3.5 text-primarycolor/50" />
              </button>
              {groupOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border-2 border-slate-100 bg-white shadow-lg z-10">
                  <button
                    onClick={() => {
                      setGroupFilter("all")
                      setGroupOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-primarycolor/5 transition-colors"
                  >
                    All Groups
                  </button>
                  {groups.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGroupFilter(g)
                        setGroupOpen(false)
                      }}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primarycolor/5 transition-colors",
                        groupFilter === g ? "text-primarycolor" : "text-slate-600",
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  No menus found
                </p>
                <p className="text-[9px] font-bold text-muted-foreground mt-1">
                  Try a different search or group
                </p>
              </div>
            ) : (
              filtered.map((m, i) => (
                <button
                  key={m.url}
                  onClick={() => goTo(m.url)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors",
                    highlighted === i ? "bg-primarycolor/5" : "hover:bg-primarycolor/5",
                  )}
                >
                  <div
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center shrink-0",
                      highlighted === i ? "bg-primarycolor text-white" : "bg-primarycolor/10 text-primarycolor",
                    )}
                  >
                    <m.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={cn("font-black text-xs truncate", highlighted === i ? "text-primarycolor" : "text-slate-700")}>
                      {m.title}
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground truncate">
                      {m.group}
                    </p>
                  </div>
                  {highlighted === i && (
                    <CornerDownLeft className="size-3.5 text-primarycolor shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
