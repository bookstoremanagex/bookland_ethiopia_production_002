"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  ShoppingCart,
  Clock,
  Users,
  UserRound,
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import { TooltipProvider as ShadcnTooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useSidebarStore } from "@/store/use-sidebar-store";
import React from "react";
import Link from "next/link";

const menuItems = [
  { id: "home", title: "Home", icon: Home, path: "" },
  { id: "books", title: "Books", icon: BookOpen, path: "books" },
  { id: "orders", title: "Orders", icon: ShoppingCart, path: "orders" },
  { id: "history", title: "History", icon: Clock, path: "history" },
];

const secondaryItems = [
  { id: "customers", title: "Customers", icon: Users, path: "customers" },
  { id: "profile", title: "Profile", icon: UserRound, path: "profile" },
];

export function RetailShopSidebar() {
  const pathname = usePathname();
  const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore();
  const rootPath = "/retail_shop_dashboard";

  React.useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname, setMounted, setActivePath]);

  const allItems = React.useMemo(
    () => [...menuItems, ...secondaryItems],
    []
  );

  const allWithUrls = React.useMemo(
    () =>
      allItems.map((item) => ({
        ...item,
        url: item.path === "" ? rootPath : `${rootPath}/${item.path}`,
      })),
    []
  );

  const menuWithUrls = React.useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        url: item.path === "" ? rootPath : `${rootPath}/${item.path}`,
      })),
    []
  );

  const secondaryWithUrls = React.useMemo(
    () =>
      secondaryItems.map((item) => ({
        ...item,
        url: `${rootPath}/${item.path}`,
      })),
    []
  );

  const getActiveUrl = (items: typeof menuWithUrls) => {
    if (!isMounted) return "";
    for (const item of items) {
      if (item.url === rootPath) {
        if (activePath === rootPath) return item.url;
        continue;
      }
      if (activePath === item.url || activePath.startsWith(item.url + "/")) {
        return item.url;
      }
    }
    return "";
  };

  const activeUrl = getActiveUrl(menuWithUrls);
  const secondaryActiveUrl = getActiveUrl(secondaryWithUrls);

  return (
    <ShadcnTooltipProvider delayDuration={0}>
      <Sidebar>
        <SidebarHeader className="p-4 font-black text-xl border-b uppercase tracking-tighter italic text-primarycolor">
          Retail Shop
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-4 mb-2">
              Dashboard Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuWithUrls.map((item) => {
                  const active = activeUrl === item.url;
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
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-4 mb-2">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryWithUrls.map((item) => {
                  const active = secondaryActiveUrl === item.url;
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
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-6 border-t text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 bg-primarycolor/[0.02]">
          &copy; 2026 Retail Shop
        </SidebarFooter>
      </Sidebar>
    </ShadcnTooltipProvider>
  );
}
