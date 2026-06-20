"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  User,
  FileText,
  Banknote,
  X,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";

const menuItems = [
  { title: "Home", icon: Home, url: "/printer_full" },
  { title: "Profile", icon: User, url: "/printer_full/profile" },
  { title: "Notes", icon: FileText, url: "/printer_full/notes" },
  { title: "Payments", icon: Banknote, url: "/printer_full/payments" },
];

export function PrinterFullSidebar() {
  const pathname = usePathname();
  const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore();
  const { setOpenMobile } = useSidebar();

  React.useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname, setMounted, setActivePath]);

  const activeUrl = React.useMemo(() => {
    if (!isMounted) return "";

    const sortedItems = [...menuItems].sort(
      (a, b) => b.url.length - a.url.length,
    );

    for (const item of sortedItems) {
      if (item.url === "/printer_full") {
        if (activePath === "/printer_full") return item.url;
        continue;
      }

      if (activePath === item.url || activePath.startsWith(item.url + "/")) {
        return item.url;
      }
    }

    return "";
  }, [isMounted, activePath]);

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar>
        <SidebarHeader className="p-4 font-bold text-xl border-b relative">
          Printer Portal
          <button
            onClick={() => setOpenMobile(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-8 rounded-lg hover:bg-primarycolor/10 flex items-center justify-center text-muted-foreground hover:text-primarycolor transition-all md:hidden cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const active = activeUrl === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          "transition-all duration-300 rounded-lg h-12 px-4 relative my-1",
                          "hover:bg-primarycolor/10 hover:text-primarycolor",
                          "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-lg data-[active=true]:shadow-primarycolor/30",
                        )}
                      >
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "w-5 h-5",
                                active ? "text-white" : "text-primarycolor",
                              )}
                            />
                            <span
                              className={cn(
                                active ? "text-white" : "text-foreground",
                              )}
                            >
                              {item.title}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t-2 border-primarycolor/10 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <Link
          href="/printer_full"
          onClick={() => setOpenMobile(false)}
          className={cn(
            "flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all",
            activePath === "/printer_full"
              ? "text-primarycolor"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          <Home className="size-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </Link>

        <button
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Menu className="size-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </div>
    </TooltipProvider>
  );
}
