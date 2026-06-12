"use client"

import * as React from "react"
import Link from "next/link"
import {
    Banknote,
    Building2,
    User,
    ChevronRight,
    ChevronDown,
    Calendar,
    Timer,
    AlertTriangle,
    CheckCircle2,
    Search,
    X,
    Store,
    Receipt,
    Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCalendar } from "@/lib/calendar-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateCheckStatus } from "@/app/actions/check-actions"

const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    DELIVERED: "bg-blue-100 text-blue-700 border-blue-200",
    CLEARED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    BOUNCED: "bg-rose-100 text-rose-700 border-rose-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
}

function getDaysInfo(recordeddate: string | Date | null | undefined): { label: string; expired: boolean; diffDays: number } | null {
    if (!recordeddate) return null
    const checkDate = new Date(recordeddate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    checkDate.setHours(0, 0, 0, 0)
    const diffMs = checkDate.getTime() - today.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays > 0) return { label: `${diffDays} day${diffDays > 1 ? "s" : ""} left`, expired: false, diffDays }
    if (diffDays === 0) return { label: "Today", expired: false, diffDays: 0 }
    return { label: "Expired", expired: true, diffDays }
}

const STATUS_OPTIONS = ["PENDING", "DELIVERED", "CLEARED", "CANCELLED"]

function CheckCard({ check }: { check: any }) {
    const { formatDate } = useCalendar()
    const [open, setOpen] = React.useState(false)
    const [statusDialogOpen, setStatusDialogOpen] = React.useState(false)
    const [clearConfirmOpen, setClearConfirmOpen] = React.useState(false)
    const [changing, setChanging] = React.useState(false)
    const status = check.status || "PENDING"
    const daysInfo = getDaysInfo(check.recordeddate)
    const payments = check.payments || []

    async function handleStatusChange(newStatus: string) {
        setChanging(true)
        try {
            const res = await updateCheckStatus(check.id, newStatus)
            if (res.success) {
                toast.success(`Check #${check.id} marked as ${newStatus}`)
                setStatusDialogOpen(false)
                setClearConfirmOpen(false)
            } else {
                toast.error(res.error || "Failed to update status")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setChanging(false)
        }
    }

    return (
        <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 hover:shadow-xl hover:border-primarycolor/10 transition-all">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left p-6 flex items-start justify-between gap-4"
            >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                        <Banknote className="size-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-black text-primarycolor text-lg leading-tight truncate">
                                {check.username || "Unknown"}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground/50">#{check.id}</span>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                statusStyles[status] || "bg-slate-100 text-slate-600"
                            )}>
                                {status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold text-muted-foreground">
                            {check.bankname && (
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="size-3.5 text-primarycolor/40" />
                                    {check.bankname}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <User className="size-3.5 text-primarycolor/40" />
                                {check.username}
                            </span>
                            <span className="font-black text-primarycolor">
                                {check.amount ? `${Number(check.amount).toLocaleString()} ETB` : "—"}
                            </span>
                            {check.recordeddate && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5 text-primarycolor/40" />
                                    {formatDate(new Date(check.recordeddate))}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    {status !== "CLEARED" && daysInfo ? (
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                            daysInfo.expired
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}>
                            {daysInfo.expired ? (
                                <AlertTriangle className="size-3.5" />
                            ) : (
                                <Timer className="size-3.5" />
                            )}
                            {daysInfo.label}
                        </span>
                    ) : status !== "CLEARED" ? (
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            {check.type || "—"}
                        </span>
                    ) : null}
                    {status !== "CLEARED" && daysInfo && check.type && (
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            {check.type}
                        </span>
                    )}
                    <div className={cn(
                        "size-6 rounded-lg flex items-center justify-center transition-colors",
                        open ? "bg-primarycolor/10 text-primarycolor" : "text-primarycolor/30"
                    )}>
                        {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </div>
                </div>
            </button>

            {open && (
                <div className="px-6 pb-6 pt-2 border-t border-primarycolor/5 space-y-4">
                    {payments.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Receipt className="size-3.5" /> Payments ({payments.length})
                            </h4>
                            <div className="space-y-2">
                                {payments.map((p: any) => (
                                    <div key={p.id} className="bg-primarycolor/[0.03] rounded-2xl p-4 space-y-2">
                                        <div className="flex items-center justify-between gap-3 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <Store className="size-4 text-primarycolor/50" />
                                                <span className="font-bold text-sm">{p.shop?.name || "Unknown Shop"}</span>
                                            </div>
                                            <span className="font-black text-primarycolor">
                                                {p.amount?.toLocaleString()} ETB
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-bold text-muted-foreground/70">
                                            <span className="flex items-center gap-1">
                                                <Hash className="size-3" /> #{p.id}
                                            </span>
                                            <span>Status: {p.status}</span>
                                            <span>Type: {p.payment_type}</span>
                                            {p.shop?.location && <span>{p.shop.location}</span>}
                                            {p.shop?.phone && <span>{p.shop.phone}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-[11px] font-bold text-muted-foreground/50 py-2">No payments linked to this check</p>
                    )}

                    {check.imageUrl && (
                        <div className="rounded-2xl overflow-hidden border border-primarycolor/5">
                            <img
                                src={check.imageUrl}
                                alt="Check"
                                className="w-full max-h-64 object-contain bg-primarycolor/[0.02]"
                            />
                        </div>
                    )}

                    {check.memo && (
                        <div className="text-xs text-muted-foreground bg-primarycolor/[0.02] rounded-xl p-3">
                            <span className="font-bold text-muted-foreground/70">Memo: </span>
                            {check.memo}
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-1">
                        <Link
                            href={`/admin_dashboard/checks/${check.id}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primarycolor hover:text-primarycolor/70 transition-colors"
                        >
                            View full details <ChevronRight className="size-3.5" />
                        </Link>

                        {status !== "CLEARED" && (<>
                        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest h-8 rounded-xl">
                                    Options
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-black uppercase tracking-widest">Change Status</DialogTitle>
                                    <DialogDescription className="text-xs">
                                        Current status: <span className="font-bold text-foreground">{status}</span>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-2 py-2">
                                    {STATUS_OPTIONS.filter(s => s !== status).map(s => (
                                        <button
                                            key={s}
                                            disabled={changing}
                                            onClick={() => {
                                                if (s === "CLEARED") {
                                                    setStatusDialogOpen(false)
                                                    setClearConfirmOpen(true)
                                                } else {
                                                    handleStatusChange(s)
                                                }
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border-2",
                                                s === "PENDING" && "border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-50",
                                                s === "DELIVERED" && "border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-50",
                                                s === "CLEARED" && "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50",
                                                s === "CANCELLED" && "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50",
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <AlertDialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
                            <AlertDialogContent className="sm:max-w-md rounded-3xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-sm font-black uppercase tracking-widest">Clear this check?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="text-xs space-y-2">
                                    <div>This will:</div>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        <li>Mark the check as <strong className="text-emerald-700">CLEARED</strong></li>
                                        <li>Approve all pending linked payments</li>
                                        <li><strong className="text-rose-600">Deduct the payment amounts from the shop's outstanding debt</strong></li>
                                    </ul>
                                    <div className="pt-1 font-semibold text-foreground">Are you sure you want to proceed?</div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel asChild>
                                        <button disabled={changing} className="h-10 px-5 rounded-xl text-xs font-bold border border-border hover:bg-muted transition-colors cursor-pointer disabled:opacity-50">
                                            Cancel
                                        </button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <button
                                            disabled={changing}
                                            onClick={() => handleStatusChange("CLEARED")}
                                            className="h-10 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {changing ? "Processing..." : "Yes, Clear Check"}
                                        </button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ChecksFollowUpClient({ checks }: { checks: any[] }) {
    const [search, setSearch] = React.useState("")

    const filtered = React.useMemo(() => {
        if (!search.trim()) return checks
        const q = search.toLowerCase()
        return checks.filter((c: any) =>
            (c.username || "").toLowerCase().includes(q) ||
            (c.bankname || "").toLowerCase().includes(q) ||
            (c.amount || "").toString().includes(q) ||
            (c.memo || "").toLowerCase().includes(q) ||
            (c.type || "").toLowerCase().includes(q)
        )
    }, [checks, search])

    const upcoming = React.useMemo(() => {
        const withDays = filtered
            .filter((c: any) => c.status !== "CLEARED" && c.recordeddate)
            .map((c: any) => {
                const info = getDaysInfo(c.recordeddate)
                return { ...c, _daysDiff: info && !info.expired ? info.diffDays : null }
            })
            .filter((c: any) => c._daysDiff !== null)
        withDays.sort((a: any, b: any) => a._daysDiff - b._daysDiff)
        return withDays
    }, [filtered])

    const expired = React.useMemo(() => {
        const withDays = filtered
            .filter((c: any) => c.status !== "CLEARED" && c.recordeddate)
            .map((c: any) => {
                const info = getDaysInfo(c.recordeddate)
                return { ...c, _daysDiff: info?.expired ? info.diffDays : null }
            })
            .filter((c: any) => c._daysDiff !== null)
        withDays.sort((a: any, b: any) => b._daysDiff - a._daysDiff)
        return withDays
    }, [filtered])

    const pending = React.useMemo(() => filtered.filter((c: any) => c.status === "PENDING"), [filtered])
    const delivered = React.useMemo(() => filtered.filter((c: any) => c.status === "DELIVERED"), [filtered])
    const cleared = React.useMemo(() => filtered.filter((c: any) => c.status === "CLEARED"), [filtered])

    const dateSorted = React.useMemo(() => {
        const combined = filtered
            .filter((c: any) => (c.status === "PENDING" || c.status === "DELIVERED") && c.recordeddate)
            .map((c: any) => {
                const info = getDaysInfo(c.recordeddate)
                return { ...c, _daysDiff: info && !info.expired ? info.diffDays : null }
            })
            .filter((c: any) => c._daysDiff !== null)
        combined.sort((a: any, b: any) => a._daysDiff - b._daysDiff)
        return combined
    }, [filtered])

    const empty = filtered.length === 0

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by username, bank, amount, memo..."
                    className="h-14 pl-14 pr-12 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                )}
            </div>

        <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-white border-2 border-primarycolor/5 rounded-2xl p-1.5">
                <TabsTrigger
                    value="all"
                    className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primarycolor data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    All ({filtered.length})
                </TabsTrigger>
                <TabsTrigger
                    value="pending"
                    className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    Pending ({pending.length})
                </TabsTrigger>
                <TabsTrigger
                    value="delivered"
                    className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    Delivered ({delivered.length})
                </TabsTrigger>
                <TabsTrigger
                    value="cleared"
                    className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    Cleared ({cleared.length})
                </TabsTrigger>
                <TabsTrigger
                    value="date-sorted"
                    className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    Date Sorted ({dateSorted.length})
                </TabsTrigger>

                <TabsTrigger
                    value="expired"
                    className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    Expired ({expired.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-0">
                {empty ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Banknote className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No checks found</p>
                    </div>
                ) : (
                    <>
                        {pending.length > 0 && (
                            <>
                                <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                                    <span className="w-4 h-px bg-amber-200" /> Pending
                                </div>
                                {pending.map((check: any) => <CheckCard key={check.id} check={check} />)}
                            </>
                        )}
                        {delivered.length > 0 && (
                            <>
                                <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <span className="w-4 h-px bg-blue-200" /> Delivered
                                </div>
                                {delivered.map((check: any) => <CheckCard key={check.id} check={check} />)}
                            </>
                        )}
                        {cleared.length > 0 && (
                            <>
                                <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                    <span className="w-4 h-px bg-emerald-200" /> Cleared
                                </div>
                                {cleared.map((check: any) => <CheckCard key={check.id} check={check} />)}
                            </>
                        )}
                        {upcoming.length > 0 && (
                            <>
                                <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-teal-600 flex items-center gap-2">
                                    <span className="w-4 h-px bg-teal-200" /> Upcoming
                                </div>
                                {upcoming.map((check: any) => <CheckCard key={check.id} check={check} />)}
                            </>
                        )}
                        {expired.length > 0 && (
                            <>
                                <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                                    <span className="w-4 h-px bg-rose-200" /> Expired
                                </div>
                                {expired.map((check: any) => <CheckCard key={check.id} check={check} />)}
                            </>
                        )}
                    </>
                )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-0">
                {empty ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Banknote className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No checks found</p>
                    </div>
                ) : pending.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Timer className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No pending checks</p>
                    </div>
                ) : (
                    pending.map((check: any) => <CheckCard key={check.id} check={check} />)
                )}
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4 mt-0">
                {empty ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Banknote className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No checks found</p>
                    </div>
                ) : delivered.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <CheckCircle2 className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No delivered checks</p>
                    </div>
                ) : (
                    delivered.map((check: any) => <CheckCard key={check.id} check={check} />)
                )}
            </TabsContent>

            <TabsContent value="cleared" className="space-y-4 mt-0">
                {empty ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Banknote className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No checks found</p>
                    </div>
                ) : cleared.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <CheckCircle2 className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No cleared checks</p>
                    </div>
                ) : (
                    cleared.map((check: any) => <CheckCard key={check.id} check={check} />)
                )}
            </TabsContent>

            <TabsContent value="date-sorted" className="space-y-4 mt-0">
                {empty ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Banknote className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No checks found</p>
                    </div>
                ) : dateSorted.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Timer className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No pending or delivered checks with upcoming dates</p>
                    </div>
                ) : (
                    dateSorted.map((check: any) => <CheckCard key={check.id} check={check} />)
                )}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4 mt-0">
                {empty ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Banknote className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No checks found</p>
                    </div>
                ) : expired.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <CheckCircle2 className="size-16 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No expired checks</p>
                    </div>
                ) : (
                    expired.map((check: any) => <CheckCard key={check.id} check={check} />)
                )}
            </TabsContent>
        </Tabs>
        </div>
    )
}

