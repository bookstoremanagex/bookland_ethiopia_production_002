import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { FinanceOfficerSidebar } from "@/components/sidebar_components/finance_officer_sideboard"
import { getCurrentSession } from "../actions/auth-actions";
import UserMenu from "@/components/admin_dashboard_components/UserMenu";
import CalendarClientWrapper, { CalendarToggleButton } from "@/components/CalendarClientWrapper";

export const dynamic = "force-dynamic";

export default async function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  return (
    <CalendarClientWrapper>
      <SidebarProvider>
        <FinanceOfficerSidebar title="Finance Hub" footerText="Finance Department" />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 flex items-center justify-between px-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-30">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <CalendarToggleButton />
              <UserMenu name={session?.name} role={session?.role} basePath="/finance_officer_dashboard" />
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </CalendarClientWrapper>
  );
}