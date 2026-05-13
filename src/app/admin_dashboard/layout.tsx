import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminAppSidebar } from "@/components/sidebar_components/admin_sideboard"

/** Admin pages use Prisma; avoid connecting to MySQL during Vercel's build prerender pass. */
export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
