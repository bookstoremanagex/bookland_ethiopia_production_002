import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { GenericAppSidebar } from "@/components/sidebar_components/generic_sideboard"
import { getCurrentSession } from "../actions/auth-actions";
import UserMenu from "@/components/admin_dashboard_components/UserMenu";

export default async function DeliverySampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  return (
    <SidebarProvider>
      <GenericAppSidebar
        title="Delivery Sample"
        rootPath="/delivery_sample_dashboard"
        role="delivery_sample"
        footerText="Delivery Sample"
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <SidebarTrigger />
          <UserMenu name={session?.name} role={session?.role} basePath="/delivery_sample_dashboard" />
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
