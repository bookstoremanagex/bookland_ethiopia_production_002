import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrinterFullSidebar } from "@/components/printer_full_dashboard_components/PrinterFullSidebar";
import { getCurrentSession } from "../actions/auth-actions";
import UserMenu from "@/components/admin_dashboard_components/UserMenu";
import CalendarClientWrapper, { CalendarToggleButton } from "@/components/CalendarClientWrapper";

export const dynamic = "force-dynamic";

export default async function PrinterFullLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <CalendarClientWrapper>
      <SidebarProvider>
        <PrinterFullSidebar />
        <main className="flex-1 min-w-0 min-h-screen bg-transparent font-sans text-slate-800 antialiased pb-20 md:pb-0">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primarycolor/10 bg-white/80 px-3 py-2 backdrop-blur-md md:px-4">
            <SidebarTrigger className="text-primarycolor hover:bg-primarycolor/10" />
            <div className="flex items-center gap-2">
              <CalendarToggleButton />
              <UserMenu name={session?.name} role={session?.role} basePath="/printer_full" />
            </div>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </CalendarClientWrapper>
  );
}
