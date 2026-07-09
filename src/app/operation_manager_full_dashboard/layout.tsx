import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OperationManagerFullSidebar } from "@/components/operation_manager_full_dashboard_components/OperationManagerFullSidebar";
import { getCurrentSession } from "../actions/auth-actions";
import UserMenu from "@/components/admin_dashboard_components/UserMenu";
import CalendarClientWrapper, { CalendarToggleButton } from "@/components/CalendarClientWrapper";

export const dynamic = "force-dynamic";

export default async function OperationManagerFullLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <CalendarClientWrapper>
      <SidebarProvider>
        <OperationManagerFullSidebar />
        <main className="flex-1 min-w-0 min-h-screen bg-transparent font-sans text-slate-800 antialiased pb-20 md:pb-0">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primarycolor/10 bg-white/80 px-3 py-2 backdrop-blur-md md:px-4">
            <SidebarTrigger className="text-primarycolor hover:bg-primarycolor/10" />
            <div className="flex items-center gap-2">
              <CalendarToggleButton />
              <UserMenu name={session?.name} role={session?.role} basePath="/operation_manager_full_dashboard" />
            </div>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </CalendarClientWrapper>
  );
}