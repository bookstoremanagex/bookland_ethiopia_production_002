import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminAppSidebar } from "@/components/sidebar_components/admin_sideboard";

/** Admin pages use Prisma; avoid connecting to MySQL during Vercel's build prerender pass. */
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <main className="flex-1 min-w-0 min-h-screen bg-transparent font-sans text-slate-800 antialiased">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-primarycolor/10 bg-white/80 px-3 py-2 backdrop-blur-md md:px-4">
          <SidebarTrigger className="text-primarycolor hover:bg-primarycolor/10" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
