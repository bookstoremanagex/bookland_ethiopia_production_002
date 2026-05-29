import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { GenericAppSidebar } from "@/components/sidebar_components/generic_sideboard"
import { getCurrentSession } from "../actions/auth-actions";
import UserMenu from "@/components/admin_dashboard_components/UserMenu";

export default async function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  return (
    <SidebarProvider>
      <GenericAppSidebar title="Inventory Pro" rootPath="/inventory_manager_dashboard" role="inventory_manager" footerText="Stock Control Dept" />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <SidebarTrigger />
          <UserMenu name={session?.name} role={session?.role} basePath="/inventory_manager_dashboard" />
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
