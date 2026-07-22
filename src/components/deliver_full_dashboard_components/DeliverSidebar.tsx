"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  ClipboardList,
  BadgeDollarSign,
  Bell,
  FileCheck,
  User,
  FileText,
  BookOpen,
  Truck,
  BarChart3,
  Store,
  Banknote,
  X,
  ChevronRight,
  PlusCircle,
  ListOrdered,
  PackageOpen,
  Menu,
  RefreshCw,
  Info,
  CalendarDays,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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

const menuItemsBefore = [
  { title: "Home", icon: Home, url: "/delivery_dashboard_full" },
  { title: "Notifications", icon: Bell, url: "/delivery_dashboard_full/notifications" },
  { title: "Payments", icon: Banknote, url: "/delivery_dashboard_full/payments" },
];

const menuItemsAfter = [
  { title: "Notes", icon: FileText, url: "/delivery_dashboard_full/notes" },
  { title: "Books", icon: BookOpen, url: "/delivery_dashboard_full/books" },
  { title: "Profile", icon: User, url: "/delivery_dashboard_full/profile" },
];

export function DeliverSidebar() {
  const pathname = usePathname();
  const { isMounted, setMounted, activePath, setActivePath } = useSidebarStore();
  const { setOpenMobile } = useSidebar();

  React.useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname, setMounted, setActivePath]);

  const activeUrl = React.useMemo(() => {
    if (!isMounted) return "";

    const allItems = [...menuItemsBefore, ...menuItemsAfter];
    const sortedItems = allItems.sort(
      (a, b) => b.url.length - a.url.length,
    );

    for (const item of sortedItems) {
      if (item.url === "/delivery_dashboard_full") {
        if (activePath === "/delivery_dashboard_full") return item.url;
        continue;
      }

      if (activePath === item.url || activePath.startsWith(item.url + "/")) {
        return item.url;
      }
    }

    return "";
  }, [isMounted, activePath]);

  const isManageOrdersActive = isMounted && (
    activePath?.includes("/delivery_dashboard_full/manage_orders") ||
    activePath === "/delivery_dashboard_full/orders" ||
    activePath.startsWith("/delivery_dashboard_full/orders/") ||
    activePath === "/delivery_dashboard_full/create-orders" ||
    activePath === "/delivery_dashboard_full/sample-order" ||
    activePath === "/delivery_dashboard_full/walk-in-customer" ||
    activePath.startsWith("/delivery_dashboard_full/walk-in-customer/")
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar>
        <SidebarHeader className="p-4 font-bold text-xl border-b relative">
          Delivery Panel
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
                {menuItemsBefore.map((item) => {
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

                {/* Collapsible: Manage Orders */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={isManageOrdersActive}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Manage Orders"
                        className={cn(
                          "transition-all duration-300 h-12 px-4 my-1",
                          isManageOrdersActive
                            ? "bg-primarycolor text-white font-black shadow-lg shadow-primarycolor/30"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <ClipboardList
                          className={cn(
                            "w-5 h-5",
                            isManageOrdersActive
                              ? "text-white"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Manage Orders</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isMounted && (activePath === "/delivery_dashboard_full/orders" || activePath.startsWith("/delivery_dashboard_full/orders/"))}
                            className={cn(
                              "transition-all duration-300 rounded-lg h-11 px-4 my-0.5",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/delivery_dashboard_full/orders" onClick={() => setOpenMobile(false)}>
                              <ListOrdered className={cn("w-4 h-4", isMounted && activePath === "/delivery_dashboard_full/orders" ? "text-white" : "text-primarycolor/70")} />
                              <span>Orders</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isMounted && activePath === "/delivery_dashboard_full/create-orders"}
                            className={cn(
                              "transition-all duration-300 rounded-lg h-11 px-4 my-0.5",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/delivery_dashboard_full/create-orders" onClick={() => setOpenMobile(false)}>
                              <PlusCircle className={cn("w-4 h-4", isMounted && activePath === "/delivery_dashboard_full/create-orders" ? "text-white" : "text-primarycolor/70")} />
                              <span>Create Orders To Shop</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isMounted && (activePath === "/delivery_dashboard_full/walk-in-customer" || activePath.startsWith("/delivery_dashboard_full/walk-in-customer/"))}
                            className={cn(
                              "transition-all duration-300 rounded-lg h-11 px-4 my-0.5",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/delivery_dashboard_full/walk-in-customer" onClick={() => setOpenMobile(false)}>
                              <User className={cn("w-4 h-4", isMounted && activePath === "/delivery_dashboard_full/walk-in-customer" ? "text-white" : "text-primarycolor/70")} />
                              <span>Walk in Customer</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isMounted && activePath === "/delivery_dashboard_full/sample-order"}
                            className={cn(
                              "transition-all duration-300 rounded-lg h-11 px-4 my-0.5",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/delivery_dashboard_full/sample-order" onClick={() => setOpenMobile(false)}>
                              <FileText className={cn("w-4 h-4", isMounted && activePath === "/delivery_dashboard_full/sample-order" ? "text-white" : "text-primarycolor/70")} />
                              <span>Sample Order</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Round Books */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Round Books"
                    isActive={isMounted && (activePath === "/delivery_dashboard_full/round-books" || activePath.startsWith("/delivery_dashboard_full/round-books/"))}
                    className={cn(
                      "transition-all duration-300 rounded-lg h-12 px-4 relative my-1",
                      "hover:bg-primarycolor/10 hover:text-primarycolor",
                      "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-lg data-[active=true]:shadow-primarycolor/30",
                    )}
                  >
                    <Link
                      href="/delivery_dashboard_full/round-books"
                      onClick={() => setOpenMobile(false)}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-3">
                        <RefreshCw
                          className={cn(
                            "w-5 h-5",
                            isMounted && (activePath === "/delivery_dashboard_full/round-books" || activePath.startsWith("/delivery_dashboard_full/round-books/")) ? "text-white" : "text-primarycolor",
                          )}
                        />
                        <span
                          className={cn(
                            isMounted && (activePath === "/delivery_dashboard_full/round-books" || activePath.startsWith("/delivery_dashboard_full/round-books/")) ? "text-white" : "text-foreground",
                          )}
                        >
                          Round Books
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Info */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    (activePath?.includes("/delivery_dashboard_full/daily-report") ||
                     activePath?.includes("/delivery_dashboard_full/payments-due"))
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Info"
                        className={cn(
                          "transition-all duration-300 rounded-lg h-12 px-4 relative my-1",
                          "hover:bg-primarycolor/10 hover:text-primarycolor",
                          isMounted &&
                            (activePath?.includes("/delivery_dashboard_full/daily-report") ||
                             activePath?.includes("/delivery_dashboard_full/payments-due"))
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "text-foreground",
                        )}
                      >
                        <Info
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/delivery_dashboard_full/daily-report") ||
                              activePath?.includes("/delivery_dashboard_full/payments-due")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Info</span>
                        <ChevronRight
                          className={cn(
                            "ml-auto transition-transform duration-200",
                            "group-data-[state=open]/collapsible:rotate-90",
                          )}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/delivery_dashboard_full/daily-report" ||
                                activePath.startsWith(
                                  "/delivery_dashboard_full/daily-report/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/delivery_dashboard_full/daily-report">
                              <CalendarDays
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/delivery_dashboard_full/daily-report"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Daily Report</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/delivery_dashboard_full/payments-due" ||
                                activePath.startsWith(
                                  "/delivery_dashboard_full/payments-due/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/delivery_dashboard_full/payments-due">
                              <BadgeDollarSign
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/delivery_dashboard_full/payments-due"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Payments Due</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {menuItemsAfter.map((item) => {
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
          href="/delivery_dashboard_full/orders"
          onClick={() => setOpenMobile(false)}
          className={cn(
            "flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all",
            activePath === "/delivery_dashboard_full/orders" || activePath.startsWith("/delivery_dashboard_full/orders/")
              ? "text-primarycolor"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          <PackageOpen className="size-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Orders</span>
        </Link>

        <Link
          href="/delivery_dashboard_full"
          onClick={() => setOpenMobile(false)}
          className={cn(
            "flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-all",
            activePath === "/delivery_dashboard_full"
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
