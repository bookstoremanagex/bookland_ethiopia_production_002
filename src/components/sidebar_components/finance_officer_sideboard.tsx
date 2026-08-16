"use client";

import { usePathname } from "next/navigation"
import {
    Home,
    User,
    BookOpen,
    ShoppingBag,
    TableProperties,
    BookCopy,
    FileText,
    Printer,
    Repeat,
    BadgeDollarSign,
    CalendarDays,
    CalendarRange,
    Loader2
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TooltipProvider as ShadcnTooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { useSidebarStore } from "@/store/use-sidebar-store"
import React, { useState, useEffect } from "react";
import Link from "next/link";

export const FINANCE_OFFICER_MENU_ITEMS = [
    { id: "home", title: "Home", icon: Home, url: "/finance_officer_dashboard" },
    { id: "profile", title: "Profile", icon: User, url: "/finance_officer_dashboard/profile" },
    { id: "book_shop", title: "Book Shop", icon: ShoppingBag, url: "/finance_officer_dashboard/book_shop" },
    { id: "books", title: "Books", icon: BookOpen, url: "/finance_officer_dashboard/books" },
    { id: "shop_table", title: "Shop Table", icon: TableProperties, url: "/finance_officer_dashboard/shop_table" },
    { id: "edition_table", title: "Edition Table", icon: BookCopy, url: "/finance_officer_dashboard/edition_table" },
    { id: "costs", title: "Costs", icon: FileText, url: "/finance_officer_dashboard/costs" },
    { id: "printing", title: "Printing", icon: Printer, url: "/finance_officer_dashboard/printing" },
    { id: "round_info", title: "Round Info", icon: Repeat, url: "/finance_officer_dashboard/round-info" },
    { id: "payments_due", title: "Payments Due", icon: BadgeDollarSign, url: "/finance_officer_dashboard/payments-due" },
    { id: "daily_report", title: "Daily Report", icon: CalendarDays, url: "/finance_officer_dashboard/daily-report" },
    { id: "period_report", title: "Period Report", icon: CalendarRange, url: "/finance_officer_dashboard/period-report" },
];

export function FinanceOfficerSidebar({ title = "Finance Hub", footerText = "Finance Department" }: { title?: string; footerText?: string }) {
    const pathname = usePathname()
    const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore()
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        setMounted(true)
        setActivePath(pathname)
    }, [pathname, setMounted, setActivePath])

    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <ShadcnTooltipProvider delayDuration={0}>
            <Sidebar>
                <SidebarHeader className="p-4 font-black text-xl border-b uppercase tracking-tighter italic text-primarycolor">
                    {title}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-4 mb-2">
                            Dashboard Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {isLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Loader2 className="size-4 animate-spin text-primarycolor/30" />
                                    </div>
                                ) : (
                                    FINANCE_OFFICER_MENU_ITEMS.map((item) => {
                                        const active = !!(isMounted && (activePath === item.url || activePath.startsWith(item.url + "/")))
                                        return (
                                            <SidebarMenuItem key={item.id} className="px-2">
                                                <SidebarMenuButton
                                                    asChild
                                                    tooltip={item.title}
                                                    className={cn(
                                                        "transition-all duration-300 h-11 px-4 rounded-xl",
                                                        active
                                                            ? "bg-primarycolor text-white font-black shadow-lg shadow-primarycolor/20"
                                                            : "hover:bg-primarycolor/5 text-foreground font-bold"
                                                    )}
                                                >
                                                    <Link href={item.url} className="flex items-center gap-3">
                                                        <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-primarycolor/70")} />
                                                        <span className="uppercase tracking-tight text-xs">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="p-6 border-t text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 bg-primarycolor/[0.02]">
                    © 2026 {footerText || "Book Land"}
                </SidebarFooter>
            </Sidebar>
        </ShadcnTooltipProvider>
    )
}