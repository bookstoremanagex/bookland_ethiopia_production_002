"use client"

import React, { useState } from 'react'
import { Plus, X, Banknote, User, Building2, Tag, DollarSign, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { createCheck } from '@/app/actions/check-actions'
import { checkCurrentUserRole } from '@/app/actions/book-shop-actions'
import { useRouter } from 'next/navigation'

export default function CreateCheckButton() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        bankname: "",
        type: "PAYMENT",
        amount: "",
        recordeddate: "",
        memo: ""
    })

    const handleOpen = async () => {
        const roleCheck = await checkCurrentUserRole("adding_checks");
        if (!roleCheck.enabled) {
            toast.error("You do not have permission to add checks.");
            return;
        }
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.username || !formData.bankname) {
            toast.error("Username and Bank Name are required")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createCheck(formData)
            if (response.success) {
                toast.success("Check recorded successfully")
                setIsOpen(false)
                setFormData({ username: "", bankname: "", type: "PAYMENT", amount: "", recordeddate: "", memo: "" })
                router.refresh()
            } else {
                toast.error(response.error || "Failed to create check")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button
                onClick={handleOpen}
                className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primarycolor/20 transition-all active:scale-95"
            >
                <Plus className="size-5" /> New Check
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg shrink-0">
                                    <Banknote className="size-6 md:size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic">New <span className="text-secondarycolor not-italic">Check</span></h3>
                                    <p className="text-muted-foreground font-bold text-[10px] md:text-sm">Record a new cheque entry.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
                                <X className="size-5 md:size-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold"
                                        placeholder="Enter account username..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Bank Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        required
                                        value={formData.bankname}
                                        onChange={(e) => setFormData({...formData, bankname: e.target.value})}
                                        className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold"
                                        placeholder="Enter bank name..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Type</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                                        <Select
                                            value={formData.type}
                                            onValueChange={(v) => setFormData({...formData, type: v})}
                                        >
                                            <SelectTrigger className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl p-2 border-2">
                                                <SelectItem value="PAYMENT" className="rounded-xl h-10 font-bold">Payment</SelectItem>
                                                <SelectItem value="COLLATERAL" className="rounded-xl h-10 font-bold">Collateral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Amount</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold text-xs"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Recorded Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <DateInput
                                        value={formData.recordeddate}
                                        onChange={(e) => setFormData({...formData, recordeddate: e.target.value})}
                                        className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Memo</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-3 size-4 text-muted-foreground" />
                                    <textarea
                                        value={formData.memo}
                                        onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                        className="h-24 md:h-32 w-full pl-10 pt-3 rounded-xl md:rounded-2xl border-2 font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col md:flex-row gap-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] h-14 md:h-16 rounded-xl md:rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20 transition-all text-xs"
                                >
                                    {isSubmitting ? "Recording..." : "Record Check"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
