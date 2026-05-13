"use client"

import React, { useState } from 'react'
import { Plus, X, Printer, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createPrinter } from '@/app/actions/printer-actions'

export default function CreatePrinterButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        phone: "",
        email: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.location) {
            toast.error("Name and Location are required")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createPrinter(formData)
            if (response.success) {
                toast.success("Printer registered successfully")
                setIsOpen(false)
                setFormData({ name: "", location: "", phone: "", email: "" })
            } else {
                toast.error(response.error || "Failed to register printer")
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
                onClick={() => setIsOpen(true)}
                className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primarycolor/20 transition-all active:scale-95"
            >
                <Plus className="size-5" /> Register Printer
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg shrink-0">
                                    <Printer className="size-6 md:size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic">New <span className="text-rose-500 not-italic">Partner</span></h3>
                                    <p className="text-muted-foreground font-bold text-[10px] md:text-sm">Register a new printing facility.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
                                <X className="size-5 md:size-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Printer Identity</label>
                                <Input 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-2 font-bold"
                                    placeholder="Enter facility name..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Facility Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input 
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold"
                                        placeholder="City, Area, or Specific Address"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold text-xs"
                                            placeholder="+251..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input 
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold text-xs"
                                            placeholder="contact@printer.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col md:flex-row gap-4">
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] h-14 md:h-16 rounded-xl md:rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20 transition-all text-xs"
                                >
                                    {isSubmitting ? "Registering..." : "Create Partner"}
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
