"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  User,
  FileText,
  X,
  Menu,
  BookOpen,
  Languages,
  PenTool,
  Printer,
  ClipboardList,
  List,
  Truck,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";

const topItems = [
  { title: "Home", icon: Home, url: "/operation_manager_full_dashboard" },
  { title: "Notifications", icon: Bell, url: "/operation_manager_full_dashboard/notifications" },
  { title: "Notes", icon: FileText, url: "/operation_manager_full_dashboard/notes" },
  { title: "Profile", icon: User, url: "/operation_manager_full_dashboard/profile" },
  { title: "Delivery Sample", icon: Truck, url: "/operation_manager_full_dashboard/delivery-sample" },
  { title: "Manage Orders", icon: ClipboardList, url: "/operation_manager_full_dashboard/manage-orders" },
];

const productionItems = [
  { title: "Books", icon: BookOpen, url: "/operation_manager_full_dashboard/production/books" },
  { title: "Translators", icon: Languages, url: "/operation_manager_full_dashboard/production/translators" },
  { title: "Translation Work", icon: PenTool, url: "/operation_manager_full_dashboard/production/translation-work" },
  { title: "Translation Books", icon: BookOpen, url: "/operation_manager_full_dashboard/production/translation-books" },
];

const printingItems = [
  { title: "Printers", icon: Printer, url: "/operation_manager_full_dashboard/printing/printers" },
  { title: "Manage Printing", icon: ClipboardList, url: "/operation_manager_full_dashboard/printing/manage" },
  { title: "Books List", icon: List, url: "/operation_manager_full_dashboard/printing/list" },
  { title: "Delivery Records", icon: Truck, url: "/operation_manager_full_dashboard/printing/delivery-records" },
  { title: "Info", icon: BarChart3, url: "/operation_manager_full_dashboard/printing/info" },
];

const reportItems = [
  { title: "Completed Deliveries", icon: CheckCircle2, url: "/operation_manager_full_dashboard/reports/completed-deliveries" },
  { title: "Pending Deliveries", icon: Clock, url: "/operation_manager_full_dashboard/reports/pending-deliveries" },
];

interface SidebarMenuItemsProps {
  items: { title: string; icon: any; url: string }[];
  activeUrl: string;
  pathname: string;
  setOpenMobile: (v: boolean) => void;
}

function SimpleMenuItems({ items, activeUrl, pathname, setOpenMobile }: SidebarMenuItemsProps) {
  return (
    <>
      {items.map((item) => {
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
                  <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-primarycolor")} />
                  <span className={cn(active ? "text-white" : "text-foreground")}>{item.title}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

export function OperationManagerFullSidebar() {
  const pathname = usePathname();
  const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore();
  const { setOpenMobile } = useSidebar();

  React.useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname, setMounted, setActivePath]);

  const activeUrl = React.useMemo(() => {
    if (!isMounted) return "";
    const allItems = [...topItems, ...productionItems, ...printingItems, ...reportItems];
    const sortedItems = allItems.sort((a, b) => b.url.length - a.url.length);
    for (const item of sortedItems) {
      if (item.url === "/operation_manager_full_dashboard") {
        if (activePath === "/operation_manager_full_dashboard") return item.url;
        continue;
      }
      if (activePath === item.url || activePath.startsWith(item.url + "/")) return item.url;
    }
    return "";
  }, [isMounted, activePath]);

  const isProductionActive = isMounted && productionItems.some(i => activePath?.startsWith(i.url));
  const isPrintingActive = isMounted && printingItems.some(i => activePath?.startsWith(i.url));
  const isReportsActive = isMounted && reportItems.some(i => activePath?.startsWith(i.url));

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar>
        <SidebarHeader className="p-4 font-bold text-xl border-b relative">
          Operations Hub
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
                <SimpleMenuItems items={topItems} activeUrl={activeUrl} pathname={pathname} setOpenMobile={setOpenMobile} />

                {/* Production Collapsible */}
                <Collapsible asChild className="group/collapsible" defaultOpen={isProductionActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Production"
                        className={cn(
                          "transition-all duration-300 h-12 px-4 my-1",
                          isProductionActive
                            ? "bg-primarycolor text-white font-black shadow-lg shadow-primarycolor/30"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Package className={cn("w-5 h-5", isProductionActive ? "text-white" : "text-primarycolor/70")} />
                        <span>Production</span>
                        <svg className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu>
                        <SimpleMenuItems items={productionItems} activeUrl={activeUrl} pathname={pathname} setOpenMobile={setOpenMobile} />
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Printing Collapsible */}
                <Collapsible asChild className="group/collapsible" defaultOpen={isPrintingActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Printing"
                        className={cn(
                          "transition-all duration-300 h-12 px-4 my-1",
                          isPrintingActive
                            ? "bg-primarycolor text-white font-black shadow-lg shadow-primarycolor/30"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Printer className={cn("w-5 h-5", isPrintingActive ? "text-white" : "text-primarycolor/70")} />
                        <span>Printing</span>
                        <svg className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu>
                        <SimpleMenuItems items={printingItems} activeUrl={activeUrl} pathname={pathname} setOpenMobile={setOpenMobile} />
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Reports Collapsible */}
                <Collapsible asChild className="group/collapsible" defaultOpen={isReportsActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Reports"
                        className={cn(
                          "transition-all duration-300 h-12 px-4 my-1",
                          isReportsActive
                            ? "bg-primarycolor text-white font-black shadow-lg shadow-primarycolor/30"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <BarChart3 className={cn("w-5 h-5", isReportsActive ? "text-white" : "text-primarycolor/70")} />
                        <span>Reports</span>
                        <svg className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu>
                        <SimpleMenuItems items={reportItems} activeUrl={activeUrl} pathname={pathname} setOpenMobile={setOpenMobile} />
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t-2 border-primarycolor/10 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <Link
          href="/operation_manager_full_dashboard"
          onClick={() => setOpenMobile(false)}
          className={cn("flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all", activePath === "/operation_manager_full_dashboard" ? "text-primarycolor" : "text-slate-400 hover:text-slate-600")}
        >
          <Home className="size-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </Link>
        <button onClick={() => setOpenMobile(true)} className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all text-slate-400 hover:text-slate-600 cursor-pointer">
          <Menu className="size-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </div>
    </TooltipProvider>
  );
}