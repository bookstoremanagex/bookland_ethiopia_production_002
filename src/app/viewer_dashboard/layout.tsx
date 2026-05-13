import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { GenericAppSidebar } from "@/components/sidebar_components/generic_sideboard"

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <GenericAppSidebar title="Data Viewer" rootPath="/viewer_dashboard" role="viewer" footerText="Public View" />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center px-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <SidebarTrigger />
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
