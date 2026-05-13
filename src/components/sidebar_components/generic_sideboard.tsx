"use client";

import { usePathname } from "next/navigation"
import {
    Home,
    ChevronRight,
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
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TooltipProvider as ShadcnTooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { useSidebarStore } from "@/store/use-sidebar-store"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_DASHBOARD_MENUS } from "@/lib/dashboard-menu-config"
import { getMenuConfigForRole } from "@/app/actions/menu-actions"

interface GenericAppSidebarProps {
    title: string;
    rootPath: string;
    role: string;
    footerText?: string;
}

export function GenericAppSidebar({ title, rootPath, role, footerText }: GenericAppSidebarProps) {
    const pathname = usePathname()
    const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore()
    const [enabledMenuIds, setEnabledMenuIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        setMounted(true)
        setActivePath(pathname)
    }, [pathname, setMounted, setActivePath])

    useEffect(() => {
        const fetchConfig = async () => {
            const result = await getMenuConfigForRole(role)
            if (result.success && result.data) {
                setEnabledMenuIds(result.data as string[])
            }
            setIsLoading(false)
        }
        fetchConfig()
    }, [role])

    const menuItems = React.useMemo(() => {
        const filtered = ALL_DASHBOARD_MENUS.filter(item => 
            item.id === 'home' || enabledMenuIds.includes(item.id)
        )
        return filtered.map(item => ({
            ...item,
            url: item.path === "" ? rootPath : `${rootPath}/${item.path}`,
            subItems: item.subItems?.map(sub => ({
                ...sub,
                url: `${rootPath}/${sub.path}`
            }))
        }))
    }, [enabledMenuIds, rootPath])

    const activeUrl = React.useMemo(() => {
        if (!isMounted) return ""
        
        // Sort items by length descending to match most specific path first
        const sortedItems = [...menuItems].sort((a, b) => (b.url?.length || 0) - (a.url?.length || 0))
        
        for (const item of sortedItems) {
            // Special handling for root path (Home)
            if (item.url === rootPath) {
                if (activePath === rootPath) return item.url
                continue
            }
            
            if (activePath === item.url || activePath.startsWith(item.url + "/")) {
                return item.url
            }
        }
        
        return ""
    }, [isMounted, activePath, menuItems, rootPath])

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
                                    menuItems.map((item) => {
                                        if (item.subItems) {
                                            const isActive = activePath?.includes(item.id)
                                            return (
                                                <Collapsible key={item.id} asChild className="group/collapsible" defaultOpen={isActive}>
                                                    <SidebarMenuItem className="px-2">
                                                        <CollapsibleTrigger asChild>
                                                            <SidebarMenuButton
                                                                tooltip={item.title}
                                                                className={cn(
                                                                    "transition-all duration-300 h-11 px-4 rounded-xl",
                                                                    isActive ? "bg-primarycolor/10 text-primarycolor font-black" : "hover:bg-primarycolor/5 text-foreground font-bold"
                                                                )}
                                                            >
                                                                <item.icon className={cn("w-5 h-5", isActive ? "text-primarycolor" : "text-primarycolor/70")} />
                                                                <span className="uppercase tracking-tight text-xs">{item.title}</span>
                                                                <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                            </SidebarMenuButton>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            <SidebarMenuSub className="ml-4 border-l-2 border-primarycolor/5 mt-1 space-y-1">
                                                                {item.subItems.map((subItem) => (
                                                                    <SidebarMenuSubItem key={subItem.title}>
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={isMounted && (activePath === subItem.url || activePath.startsWith(subItem.url + "/"))}
                                                                            className={cn(
                                                                                "transition-all duration-300 rounded-lg h-9 px-4",
                                                                                "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black",
                                                                                "hover:bg-primarycolor/10 hover:text-primarycolor font-bold"
                                                                            )}
                                                                        >
                                                                            <Link href={subItem.url} className="flex items-center gap-3">
                                                                                <subItem.icon className="w-4 h-4" />
                                                                                <span className="text-[10px] uppercase tracking-widest">{subItem.title}</span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                ))}
                                                            </SidebarMenuSub>
                                                        </CollapsibleContent>
                                                    </SidebarMenuItem>
                                                </Collapsible>
                                            )
                                        }

                                        const active = activeUrl === item.url
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
                                                    <Link href={item.url as string} className="flex items-center gap-3">
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
