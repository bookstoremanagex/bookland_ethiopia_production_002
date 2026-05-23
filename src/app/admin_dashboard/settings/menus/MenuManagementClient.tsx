"use client"

import React, { useState, useEffect } from 'react'
import { 
    Layout, 
    Shield, 
    Save, 
    CheckCircle2, 
    Circle,
    Home,
    BookOpen,
    Library,
    Store,
    ShieldAlert,
    ShoppingBag,
    BarChart3,
    Package,
    Languages,
    Printer,
    BadgeDollarSign,
    FileText,
    Settings,
    User,
    Loader2,
    Bell,
    History,
    FileCheck
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateDashboardMenu, getDashboardMenus } from "@/app/actions/menu-actions"
import { cn } from "@/lib/utils"

const ROLES = [
    { id: "finance_officer", label: "Finance Officer", icon: BadgeDollarSign },
    { id: "inventory_manager", label: "Inventory Manager", icon: Package },
    { id: "operation_manager", label: "Operation Manager", icon: Shield },
    { id: "retail_manager", label: "Retail Manager", icon: ShoppingBag },
    { id: "sales_staff", label: "Sales Staff", icon: TagIcon },
    { id: "delivery_sales", label: "Delivery and Sales", icon: TruckIcon },
    { id: "printer", label: "Printer", icon: Printer },
    { id: "viewer", label: "Data Viewer", icon: Layout },
]

function TruckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10a1 1 0 0 0 1 1Z" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
        </svg>
    )
}

function TagIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
            <path d="M7 7h.01" />
        </svg>
    )
}

const AVAILABLE_MENUS = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "shelf", label: "Book Shelf", icon: Library },
    { id: "stores", label: "Stores", icon: Store },
    { id: "damaged", label: "Damaged Books", icon: ShieldAlert },
    { id: "shop", label: "Book Shop", icon: ShoppingBag },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "checks", label: "Manage Checks", icon: FileCheck },
    { id: "manage_payment", label: "Manage Payment", icon: BadgeDollarSign },
    { id: "activity_log", label: "Activity Log", icon: History },
    { id: "production", label: "Production", icon: Package },
    { id: "translations", label: "Translations", icon: Languages },
    { id: "printing", label: "Printing", icon: Printer },
    { id: "finance", label: "Finance", icon: BadgeDollarSign },
    { id: "reports", label: "Reports", icon: FileText },
]

export default function MenuManagementClient() {
    const [selectedRole, setSelectedRole] = useState(ROLES[0].id)
    const [menuConfigs, setMenuConfigs] = useState<Record<string, string[]>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchConfigs()
    }, [])

    const fetchConfigs = async () => {
        setIsLoading(true)
        const result = await getDashboardMenus()
        if (result.success && result.data) {
            const configs: Record<string, string[]> = {}
            result.data.forEach((item: any) => {
                const menus = typeof item.menus === 'string' ? JSON.parse(item.menus) : item.menus;
                configs[item.role] = menus as string[]
            })
            setMenuConfigs(configs)
        }
        setIsLoading(false)
    }

    const toggleMenu = (menuId: string) => {
        const currentMenus = menuConfigs[selectedRole] || []
        const newMenus = currentMenus.includes(menuId)
            ? currentMenus.filter(id => id !== menuId)
            : [...currentMenus, menuId]
        
        setMenuConfigs({
            ...menuConfigs,
            [selectedRole]: newMenus
        })
    }

    const handleSave = async () => {
        setIsSaving(true)
        const result = await updateDashboardMenu(selectedRole, menuConfigs[selectedRole] || [])
        if (result.success) {
            toast.success(`${ROLES.find(r => r.id === selectedRole)?.label} menu updated successfully`)
        } else {
            toast.error("Failed to update menu configuration")
        }
        setIsSaving(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primarycolor" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Role Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Dashboard Roles</h3>
                    <div className="space-y-2">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border-2",
                                    selectedRole === role.id 
                                        ? "bg-primarycolor text-white border-primarycolor shadow-lg shadow-primarycolor/20" 
                                        : "bg-white text-primarycolor/60 border-primarycolor/5 hover:border-primarycolor/20 hover:bg-primarycolor/5"
                                )}
                            >
                                <role.icon className="size-4" />
                                <span className="text-xs font-black uppercase tracking-tight">{role.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Toggles */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl bg-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Settings className="size-48" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-primarycolor uppercase tracking-tighter italic">
                                    Configure <span className="text-secondarycolor not-italic">Navigation</span>
                                </h2>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Enabling menus for {ROLES.find(r => r.id === selectedRole)?.label}
                                </p>
                            </div>
                            <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg shadow-primarycolor/20 gap-2 shrink-0"
                            >
                                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Save Configuration
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10">
                            {AVAILABLE_MENUS.map((menu) => {
                                const isEnabled = (menuConfigs[selectedRole] || []).includes(menu.id)
                                return (
                                    <button
                                        key={menu.id}
                                        onClick={() => toggleMenu(menu.id)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 group",
                                            isEnabled 
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm" 
                                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "size-10 rounded-xl flex items-center justify-center transition-colors",
                                                isEnabled ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"
                                            )}>
                                                <menu.icon className="size-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{menu.label}</span>
                                        </div>
                                        {isEnabled ? <CheckCircle2 className="size-5 text-emerald-500" /> : <Circle className="size-5 text-slate-100" />}
                                    </button>
                                )
                            })}
                        </div>
                    </Card>

                    {/* Preview Info */}
                    <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center gap-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05))]" />
                        <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <Shield className="size-6 text-secondarycolor" />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Access Control Policy</p>
                            <p className="text-xs font-bold leading-relaxed text-white/80">
                                Changes to menu configurations will take effect immediately across all active sessions for the selected dashboard type.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
