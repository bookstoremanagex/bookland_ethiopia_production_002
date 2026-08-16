"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  User,
  BookOpen,
  Library,
  BarChart3,
  Store,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Languages,
  PenTool,
  Printer,
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
import { getEnabledMenuNamesForRole } from "@/app/actions/menu-actions";

interface ViewerMenuItem {
  title: string;
  icon: any;
  url: string;
  menuName: string;
}

const topItems: ViewerMenuItem[] = [
  { title: "Home", icon: Home, url: "/viewer_dashboard", menuName: "Home" },
  { title: "Profile", icon: User, url: "/viewer_dashboard/profile", menuName: "Profile" },
];

const catalogItems: ViewerMenuItem[] = [
  { title: "Books", icon: BookOpen, url: "/viewer_dashboard/books", menuName: "Books" },
  { title: "Book Shelf", icon: Library, url: "/viewer_dashboard/books/shelf", menuName: "Book Shelf" },
];

const analyticsItems: ViewerMenuItem[] = [
  { title: "General", icon: BarChart3, url: "/viewer_dashboard/statistics", menuName: "Statistics" },
  { title: "Books", icon: BookOpen, url: "/viewer_dashboard/statistics/books", menuName: "Statistics" },
  { title: "Stores", icon: Store, url: "/viewer_dashboard/statistics/stores", menuName: "Statistics" },
  { title: "Income", icon: BarChart3, url: "/viewer_dashboard/statistics/income", menuName: "Statistics" },
];

const networkItems: ViewerMenuItem[] = [
  { title: "Stores", icon: Store, url: "/viewer_dashboard/stores", menuName: "Stores" },
  { title: "Book Shops", icon: ShoppingBag, url: "/viewer_dashboard/book_shops", menuName: "Book Shops" },
];

const reportItems: ViewerMenuItem[] = [
  { title: "Completed Deliveries", icon: CheckCircle2, url: "/viewer_dashboard/reports/completed-deliveries", menuName: "Completed Deliveries" },
  { title: "Pending Deliveries", icon: Clock, url: "/viewer_dashboard/reports/pending-deliveries", menuName: "Pending Deliveries" },
];

const productionItems: ViewerMenuItem[] = [
  { title: "Translators", icon: Languages, url: "/viewer_dashboard/production/translators", menuName: "Translators" },
  { title: "Translation Work", icon: PenTool, url: "/viewer_dashboard/production/translation-work", menuName: "Translation Work" },
  { title: "Printing Info", icon: Printer, url: "/viewer_dashboard/printing/info", menuName: "Printing Info" },
];

interface SidebarMenuItemsProps {
  items: { title: string; icon: any; url: string }[];
  activeUrl: string;
  setOpenMobile: (v: boolean) => void;
}

function SimpleMenuItems({ items, activeUrl, setOpenMobile }: SidebarMenuItemsProps) {
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

interface CollapsibleGroupProps {
  label: string;
  icon: any;
  items: { title: string; icon: any; url: string }[];
  activeUrl: string;
  defaultOpen: boolean;
  setOpenMobile: (v: boolean) => void;
}

function CollapsibleGroup({ label, icon: Icon, items, activeUrl, setOpenMobile, defaultOpen }: CollapsibleGroupProps) {
  const isActive = defaultOpen;
  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={isActive}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={label}
            className={cn(
              "transition-all duration-300 h-12 px-4 my-1",
              isActive
                ? "bg-primarycolor text-white font-black shadow-lg shadow-primarycolor/30"
                : "hover:bg-primarycolor/5 text-foreground",
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-primarycolor/70")} />
            <span>{label}</span>
            <svg className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu>
            <SimpleMenuItems items={items} activeUrl={activeUrl} setOpenMobile={setOpenMobile} />
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function ViewerSidebar() {
  const pathname = usePathname();
  const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore();
  const { setOpenMobile } = useSidebar();
  const [enabledMenuNames, setEnabledMenuNames] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname, setMounted, setActivePath]);

  React.useEffect(() => {
    const fetchConfig = async () => {
      const result = await getEnabledMenuNamesForRole("viewer");
      if (result.success && result.data) {
        setEnabledMenuNames(result.data as string[]);
      }
      setIsLoading(false);
    };
    fetchConfig();
  }, []);

  const isEnabled = React.useCallback(
    (item: ViewerMenuItem) =>
      item.menuName === "Home" || enabledMenuNames.includes(item.menuName),
    [enabledMenuNames]
  );

  const visibleTopItems = React.useMemo(() => topItems.filter(isEnabled), [isEnabled]);
  const visibleCatalogItems = React.useMemo(() => catalogItems.filter(isEnabled), [isEnabled]);
  const visibleAnalyticsItems = React.useMemo(() => analyticsItems.filter(isEnabled), [isEnabled]);
  const visibleNetworkItems = React.useMemo(() => networkItems.filter(isEnabled), [isEnabled]);
  const visibleReportItems = React.useMemo(() => reportItems.filter(isEnabled), [isEnabled]);
  const visibleProductionItems = React.useMemo(() => productionItems.filter(isEnabled), [isEnabled]);

  const activeUrl = React.useMemo(() => {
    if (!isMounted) return "";
    const allItems = [...topItems, ...catalogItems, ...analyticsItems, ...networkItems, ...reportItems, ...productionItems];
    const sortedItems = allItems.sort((a, b) => b.url.length - a.url.length);
    for (const item of sortedItems) {
      if (item.url === "/viewer_dashboard") {
        if (activePath === "/viewer_dashboard") return item.url;
        continue;
      }
      if (activePath === item.url || activePath.startsWith(item.url + "/")) return item.url;
    }
    return "";
  }, [isMounted, activePath]);

  const isCatalogActive = isMounted && visibleCatalogItems.some(i => activePath?.startsWith(i.url));
  const isAnalyticsActive = isMounted && visibleAnalyticsItems.some(i => activePath?.startsWith(i.url));
  const isNetworkActive = isMounted && visibleNetworkItems.some(i => activePath?.startsWith(i.url));
  const isReportsActive = isMounted && visibleReportItems.some(i => activePath?.startsWith(i.url));
  const isProductionActive = isMounted && visibleProductionItems.some(i => activePath?.startsWith(i.url));

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar>
        <SidebarHeader className="p-4 font-bold text-xl border-b relative">
          Data Viewer
          <button
            onClick={() => setOpenMobile(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-8 rounded-lg hover:bg-primarycolor/10 flex items-center justify-center text-muted-foreground hover:text-primarycolor transition-all md:hidden cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <span className="size-4 animate-spin rounded-full border-2 border-primarycolor/30 border-t-primarycolor" />
                  </div>
                ) : (
                <>
                <SimpleMenuItems items={visibleTopItems} activeUrl={activeUrl} setOpenMobile={setOpenMobile} />

                {visibleCatalogItems.length > 0 && (
                <CollapsibleGroup
                  label="Catalog"
                  icon={BookOpen}
                  items={visibleCatalogItems}
                  activeUrl={activeUrl}
                  setOpenMobile={setOpenMobile}
                  defaultOpen={isCatalogActive}
                />
                )}

                {visibleAnalyticsItems.length > 0 && (
                <CollapsibleGroup
                  label="Analytics"
                  icon={BarChart3}
                  items={visibleAnalyticsItems}
                  activeUrl={activeUrl}
                  setOpenMobile={setOpenMobile}
                  defaultOpen={isAnalyticsActive}
                />
                )}

                {visibleNetworkItems.length > 0 && (
                <CollapsibleGroup
                  label="Network"
                  icon={Store}
                  items={visibleNetworkItems}
                  activeUrl={activeUrl}
                  setOpenMobile={setOpenMobile}
                  defaultOpen={isNetworkActive}
                />
                )}

                {visibleReportItems.length > 0 && (
                <CollapsibleGroup
                  label="Reports"
                  icon={CheckCircle2}
                  items={visibleReportItems}
                  activeUrl={activeUrl}
                  setOpenMobile={setOpenMobile}
                  defaultOpen={isReportsActive}
                />
                )}

                {visibleProductionItems.length > 0 && (
                <CollapsibleGroup
                  label="Production"
                  icon={Languages}
                  items={visibleProductionItems}
                  activeUrl={activeUrl}
                  setOpenMobile={setOpenMobile}
                  defaultOpen={isProductionActive}
                />
                )}
                </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t-2 border-primarycolor/10 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <Link
          href="/viewer_dashboard"
          onClick={() => setOpenMobile(false)}
          className={cn("flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all", activePath === "/viewer_dashboard" ? "text-primarycolor" : "text-slate-400 hover:text-slate-600")}
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