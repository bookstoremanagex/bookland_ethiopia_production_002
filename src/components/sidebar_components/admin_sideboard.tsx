"use client";

import { usePathname } from "next/navigation";
import {
  Palette,
  Home,
  BookOpen,
  Library,
  Store,
  Package,
  Languages,
  BadgeDollarSign,
  BarChart3,
  Settings,
  UserCog,
  ChevronRight,
  PenTool,
  ShoppingBag,
  TableProperties,
  BookCopy,
  ShieldAlert,
  Printer,
    ClipboardList,
    List,
    FileText,
    Repeat,
  CheckCircle2,
  Clock,
  User,
  Bell,
  History,
  FolderOpen,
  FileSignature,
  Truck,
  Receipt,
  FileCheck,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider, // Added this as well for general sidebar context
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useSidebarStore } from "@/store/use-sidebar-store";
import React from "react";
import Link from "next/link";

const menuItems = [
  { title: "Home", icon: Home, url: "/admin_dashboard" },
  { title: "Notifications", icon: Bell, url: "/admin_dashboard/notifications" },
  { title: "Notes", icon: FileText, url: "/admin_dashboard/notes" },
  { title: "Profile", icon: User, url: "/admin_dashboard/profile" },
  { title: "Books", icon: BookOpen, url: "/admin_dashboard/books" },
  { title: "Book Shelf", icon: Library, url: "/admin_dashboard/books/shelf" },

  {
    title: "Damaged Books",
    icon: ShieldAlert,
    url: "/admin_dashboard/books/damaged",
  },
  { title: "Book Shop", icon: ShoppingBag, url: "/admin_dashboard/book_shops" },
  {
    title: "Manage Orders",
    icon: ClipboardList,
    url: "/admin_dashboard/manage_orders",
  },
  {
    title: "Manage Rounds",
    icon: Repeat,
    url: "/admin_dashboard/round-books",
  },
  {
    title: "Manage Payment",
    icon: BadgeDollarSign,
    url: "/admin_dashboard/manage_payment",
  },
  { title: "Statistics", icon: BarChart3, url: "/admin_dashboard/statistics" },
  {
    title: "Retail Management",
    icon: ShoppingBag,
    url: "/admin_dashboard/retail_management",
  },
  {
    title: "Activity Log",
    icon: History,
    url: "/admin_dashboard/activity_log",
  },
];

export function AdminAppSidebar({ accountId }: { accountId?: number }) {
  const pathname = usePathname();
  const { isMounted, setMounted, activePath, setActivePath } =
    useSidebarStore();
  const [pendingOrdersCount, setPendingOrdersCount] = React.useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = React.useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = React.useState(0);
  const accountRef = React.useRef(accountId);

  React.useEffect(() => {
    accountRef.current = accountId;
  }, [accountId]);

  React.useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname, setMounted, setActivePath]);

  // Fetch pending orders & unread notifications count
  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [{ getPendingOrdersCount }, { getUnreadCount }, { getPendingPaymentsCount }] =
          await Promise.all([
            import("@/app/actions/order-actions"),
            import("@/app/actions/notification-actions"),
            import("@/app/actions/payment-actions"),
          ]);
        const [ordersRes, notifRes, paymentsRes] = await Promise.all([
          getPendingOrdersCount(),
          getUnreadCount(accountRef.current),
          getPendingPaymentsCount(),
        ]);
        if (ordersRes.success) setPendingOrdersCount(ordersRes.count || 0);
        if (notifRes.success) setUnreadNotifCount(notifRes.count || 0);
        if (paymentsRes.success) setPendingPaymentsCount(paymentsRes.count || 0);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeUrl = React.useMemo(() => {
    if (!isMounted) return "";

    // Sort items by length descending to match most specific path first
    const sortedItems = [...menuItems].sort(
      (a, b) => b.url.length - a.url.length,
    );

    for (const item of sortedItems) {
      // Special handling for root path (Home)
      if (item.url === "/admin_dashboard") {
        if (activePath === "/admin_dashboard") return item.url;
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
        <SidebarHeader className="p-4 font-bold text-xl border-b">
          Admin Panel
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Non-Expandable Items */}
                {menuItems.map((item) => {
                  const active = activeUrl === item.url;
                  const showBadge =
                    (item.title === "Manage Orders" && pendingOrdersCount > 0) ||
                    (item.title === "Notifications" && unreadNotifCount > 0) ||
                    (item.title === "Manage Payment" && pendingPaymentsCount > 0);
                  const badgeCount =
                    item.title === "Manage Orders" ? pendingOrdersCount :
                    item.title === "Notifications" ? unreadNotifCount :
                    item.title === "Manage Payment" ? pendingPaymentsCount : 0;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          "transition-all duration-300 rounded-lg h-10 px-4 relative",
                          "hover:bg-primarycolor/10 hover:text-primarycolor",
                          "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-lg data-[active=true]:shadow-primarycolor/30",
                        )}
                      >
                        <Link
                          href={item.url}
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
                          {showBadge && (
                            <div className="ml-auto flex items-center gap-2 shrink-0">
                              <div className="size-6 rounded-full bg-badgecolor text-white text-[10px] font-black flex items-center justify-center">
                                {badgeCount}
                              </div>
                            </div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* Expandable Section: Manage Checks */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    (activePath?.includes("/admin_dashboard/checks"))
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Manage Checks"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/checks")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <FileCheck
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/admin_dashboard/checks")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Manage Checks</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/checks" ||
                                (activePath.startsWith(
                                  "/admin_dashboard/checks/",
                                ) && !activePath.startsWith(
                                  "/admin_dashboard/checks/follow-up",
                                )))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/checks">
                              <FileCheck
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/checks"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>List</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/checks/follow-up" ||
                                activePath.startsWith(
                                  "/admin_dashboard/checks/follow-up/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/checks/follow-up">
                              <FileCheck
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/checks/follow-up"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Follow Up</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Stores */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    activePath?.includes("/admin_dashboard/stores")
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Stores"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/stores")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Store
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/admin_dashboard/stores")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Stores</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/stores" ||
                                (activePath.startsWith(
                                  "/admin_dashboard/stores/",
                                ) && !activePath.startsWith(
                                  "/admin_dashboard/stores/options",
                                )))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/stores">
                              <Store
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/stores"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Manage Store</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/stores/options" ||
                                activePath.startsWith(
                                  "/admin_dashboard/stores/options/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/stores/options">
                              <Settings
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/stores/options"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Store Options</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Production */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    activePath?.includes("/admin_dashboard/production")
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Production"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/production")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Package
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes(
                                "/admin_dashboard/production",
                              )
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Production</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/production/books" ||
                                activePath.startsWith(
                                  "/admin_dashboard/production/books/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/production/books">
                              <BookOpen
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/production/books"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Books</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Translations */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    (activePath?.includes(
                      "/admin_dashboard/production/translators",
                    ) ||
                      activePath?.includes(
                        "/admin_dashboard/production/translation_work",
                      ))
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Translations"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            (activePath?.includes(
                              "/admin_dashboard/production/translators",
                            ) ||
                              activePath?.includes(
                                "/admin_dashboard/production/translation_work",
                              ))
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Languages
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              (activePath?.includes(
                                "/admin_dashboard/production/translators",
                              ) ||
                                activePath?.includes(
                                  "/admin_dashboard/production/translation_work",
                                ))
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Translations</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/production/translators" ||
                                activePath.startsWith(
                                  "/admin_dashboard/production/translators/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/production/translators">
                              <Languages
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/production/translators"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Translators</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/production/translation_work" ||
                                activePath.startsWith(
                                  "/admin_dashboard/production/translation_work/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/production/translation_work">
                              <PenTool
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/production/translation_work"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Translation Work</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Printing */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    activePath?.includes("/admin_dashboard/printing")
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Printing"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/printing")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Printer
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/admin_dashboard/printing")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Printing</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/printing/printers" ||
                                activePath.startsWith(
                                  "/admin_dashboard/printing/printers/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/printing/printers">
                              <Printer
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/printing/printers"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Printers</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/printing/manage" ||
                                activePath.startsWith(
                                  "/admin_dashboard/printing/manage/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/printing/manage">
                              <ClipboardList
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/printing/manage"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Manage Printing</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/printing/list" ||
                                activePath.startsWith(
                                  "/admin_dashboard/printing/list/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/printing/list">
                              <List
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/printing/list"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Books List</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Document Managment */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    activePath?.includes("/admin_dashboard/document_management")
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Document Managment"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes(
                              "/admin_dashboard/document_management",
                            )
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <FolderOpen
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes(
                                "/admin_dashboard/document_management",
                              )
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Document Managment</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/document_management/contracts" ||
                                activePath.startsWith(
                                  "/admin_dashboard/document_management/contracts/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/document_management/contracts">
                              <FileSignature
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/document_management/contracts"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Contracts</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/document_management/print_agreements" ||
                                activePath.startsWith(
                                  "/admin_dashboard/document_management/print_agreements/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/document_management/print_agreements">
                              <FileText
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/document_management/print_agreements"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Print agreements</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/document_management/delivery_notes" ||
                                activePath.startsWith(
                                  "/admin_dashboard/document_management/delivery_notes/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/document_management/delivery_notes">
                              <Truck
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/document_management/delivery_notes"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Delivery notes</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/document_management/invoices" ||
                                activePath.startsWith(
                                  "/admin_dashboard/document_management/invoices/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/document_management/invoices">
                              <Receipt
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/document_management/invoices"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Invoices</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/document_management/approval_documents" ||
                                activePath.startsWith(
                                  "/admin_dashboard/document_management/approval_documents/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/document_management/approval_documents">
                              <FileCheck
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/document_management/approval_documents"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Approval documents</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Finance */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    activePath?.includes("/admin_dashboard/finance")
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Finance"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/finance")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <BadgeDollarSign
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/admin_dashboard/finance")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Finance</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/finance/book_shop" ||
                                activePath.startsWith(
                                  "/admin_dashboard/finance/book_shop/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/finance/book_shop">
                              <ShoppingBag
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/finance/book_shop"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Book Shop</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/finance/books" ||
                                activePath.startsWith(
                                  "/admin_dashboard/finance/books/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/finance/books">
                              <BookOpen
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/finance/books"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Books</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem></SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/finance/shop_table" ||
                                activePath.startsWith(
                                  "/admin_dashboard/finance/shop_table/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/finance/shop_table">
                              <TableProperties
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/finance/shop_table"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Shop Table</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/finance/edition_table" ||
                                activePath.startsWith(
                                  "/admin_dashboard/finance/edition_table/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/finance/edition_table">
                              <BookCopy
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/finance/edition_table"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Edition Table</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/finance/costs" ||
                                activePath.startsWith(
                                  "/admin_dashboard/finance/costs/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/finance/costs">
                              <FileText
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/finance/costs"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Costs</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Reports */}
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={
                    isMounted &&
                    activePath?.includes("/admin_dashboard/reports")
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Reports"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/reports")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <FileText
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/admin_dashboard/reports")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Reports</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/reports/completed_deliveries" ||
                                activePath.startsWith(
                                  "/admin_dashboard/reports/completed_deliveries/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/reports/completed_deliveries">
                              <CheckCircle2
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/reports/completed_deliveries"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Completed Deliveries</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/reports/pending_deliveries" ||
                                activePath.startsWith(
                                  "/admin_dashboard/reports/pending_deliveries/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/reports/pending_deliveries">
                              <Clock
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/reports/pending_deliveries"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Pending Deliveries</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Expandable Section: Settings */}
                <Collapsible asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Settings"
                        className={cn(
                          "transition-all duration-300 h-10 px-4",
                          isMounted &&
                            activePath?.includes("/admin_dashboard/settings")
                            ? "bg-primarycolor/10 text-primarycolor font-black"
                            : "hover:bg-primarycolor/5 text-foreground",
                        )}
                      >
                        <Settings
                          className={cn(
                            "w-5 h-5",
                            isMounted &&
                              activePath?.includes("/admin_dashboard/settings")
                              ? "text-primarycolor"
                              : "text-primarycolor/70",
                          )}
                        />
                        <span>Settings</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                "/admin_dashboard/settings/accounts" ||
                                activePath.startsWith(
                                  "/admin_dashboard/settings/accounts/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/settings/accounts">
                              <UserCog
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/settings/accounts"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Accounts</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/settings/menus" ||
                                activePath.startsWith(
                                  "/admin_dashboard/settings/menus/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/settings/menus">
                              <TableProperties
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/settings/menus"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Menu Management</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isMounted &&
                              (activePath ===
                                "/admin_dashboard/settings/theme" ||
                                activePath.startsWith(
                                  "/admin_dashboard/settings/theme/",
                                ))
                            }
                            className={cn(
                              "transition-all duration-300 rounded-lg h-9 px-4",
                              "data-[active=true]:bg-primarycolor data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-md data-[active=true]:shadow-primarycolor/20",
                              "hover:bg-primarycolor/10 hover:text-primarycolor",
                            )}
                          >
                            <Link href="/admin_dashboard/settings/theme">
                              <Palette
                                className={cn(
                                  "w-4 h-4",
                                  isMounted &&
                                    activePath ===
                                      "/admin_dashboard/settings/theme"
                                    ? "text-white"
                                    : "text-primarycolor/70",
                                )}
                              />
                              <span>Theme Customization</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-primarycolor/5">
          © 2026 Admin Dashboard
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
