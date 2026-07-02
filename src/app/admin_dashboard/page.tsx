import prisma from "@/lib/prisma";
import DashboardContainer from "@/components/admin_dashboard_components/home_dashboard/DashboardContainer";
import { getServerCalendarPref } from "@/lib/server-calendar"
import { formatDate } from "@/lib/calendar-utils"

const LOW_STOCK_THRESHOLD = 50;

export interface DashboardData {
  stats: {
    totalBooks: number;
    totalShops: number;
    totalRevenue: number;
    totalDebt: number;
    pendingOrders: number;
    pendingPayments: number;
    lowStockCount: number;
    revenueGrowth: number;
  };
  financialData: { name: string; revenue: number; debt: number }[];
  recentActivities: {
    id: number;
    action: string;
    accountName: string;
    date: string;
  }[];
  productionData: { status: string; count: number; fill: string }[];
  notifications: {
    id: number;
    title: string;
    message: string;
    details: string | null;
    type: string;
    createdAt: string;
  }[];
  recentOrders: {
    id: number;
    shopName: string;
    totalAmount: number;
    status: string;
    date: string;
  }[];
  lowStockItems: {
    id: number;
    bookTitle: string;
    editionName: string;
    quantity: number;
  }[];
}

export default async function AdminHomePage() {
  const calendarPref = await getServerCalendarPref();

  const [
    totalBooks,
    totalShops,
    assignments,
    rawNotifications,
    rawOrders,
    rawLowStock,
    rawLogs,
    books,
    rawPendingPayments,
    rawPendingOrdersCount,
    prevAssignments,
  ] = await Promise.all([
    (prisma as any).books.count({ where: { is_deleted: false } }),
    (prisma as any).bookshopes.count({ where: { is_deleted: false } }),
    (prisma as any).bookshopeditions.findMany({ where: { is_deleted: false } }),
    (prisma as any).notification.findMany({
      where: { is_deleted: false, is_read: false, notification_to: "ADMIN" },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    (prisma as any).orders.findMany({
      where: { is_deleted: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { bookshopes: true },
    }),
    (prisma as any).bookeditionstores.findMany({
      where: { is_deleted: false, quantity: { lt: LOW_STOCK_THRESHOLD } },
      take: 5,
      orderBy: { quantity: 'asc' },
      include: {
        bookedition: { include: { books: true } },
      },
    }),
    (prisma as any).activityLogs.findMany({
      where: { is_deleted: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { account: true },
    }),
    (prisma as any).books.findMany({
      where: { is_deleted: false },
      select: { productionstatus: true },
    }),
    (prisma as any).payments.count({
      where: { status: "PENDING", is_deleted: false },
    }),
    (prisma as any).orders.count({
      where: { is_approved: false, is_deleted: false },
    }),
    (prisma as any).bookshopeditions.findMany({
      where: {
        is_deleted: false,
        createdAt: {
          gte: new Date(new Date().getFullYear(), 0, 1),
          lt: new Date(new Date().getFullYear(), 5, 1),
        },
      },
    }),
  ]);

  // Stats
  const totalRevenue = assignments.reduce((acc: any, a: any) => acc + (a.total_price || 0), 0);
  const totalPaid = assignments.reduce((acc: any, a: any) => acc + (a.already_paid || 0), 0);
  const totalDebt = totalRevenue - totalPaid;

  const ordersList = (rawOrders as any[]) || [];
  const pendingOrders = rawPendingOrdersCount || 0;
  const pendingPaymentsCount = rawPendingPayments || 0;

  const lowStockList = (rawLowStock as any[]) || [];
  const lowStockCount = lowStockList.length;

  const prevRevenue = prevAssignments.reduce((acc: any, a: any) => acc + (a.total_price || 0), 0);
  const revenueGrowth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;

  // Financial trend — group by month
  const monthMap: Record<string, { revenue: number; debt: number }> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (const month of monthNames) {
    monthMap[month] = { revenue: 0, debt: 0 };
  }
  for (const a of assignments) {
    const d = new Date(a.createdAt);
    const m = monthNames[d.getMonth()];
    if (m) {
      monthMap[m].revenue += a.total_price || 0;
      monthMap[m].debt += (a.total_price || 0) - (a.already_paid || 0);
    }
  }
  const financialData = monthNames
    .map(name => ({ name, ...monthMap[name] }))
    .filter(m => m.revenue > 0 || m.debt > 0);

  if (financialData.length === 0) {
    financialData.push(
      { name: "Jan", revenue: totalRevenue * 0.4, debt: totalDebt * 0.3 },
      { name: "Feb", revenue: totalRevenue * 0.6, debt: totalDebt * 0.5 },
      { name: "Mar", revenue: totalRevenue * 0.8, debt: totalDebt * 0.7 },
      { name: "Apr", revenue: totalRevenue, debt: totalDebt },
    );
  }

  // Notifications
  const notifications = (rawNotifications as any[]).map((n: any) => ({
    id: n.id,
    title: n.title || "",
    message: n.message || "",
    details: n.details || null,
    type: n.type || "INFO",
    createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
  }));

  // Recent orders
  const recentOrders = ordersList.map((o: any) => ({
    id: o.id,
    shopName: o.bookshopes?.name || "Unknown",
    totalAmount: o.total_amount || 0,
    status: o.status || "Pending",
    date: formatDate(new Date(o.createdAt), calendarPref, "MMM dd"),
  }));

  // Low stock items
  const lowStockItems = lowStockList.map((s: any) => ({
    id: s.id,
    bookTitle: s.bookedition?.books?.title || "Unknown",
    editionName: s.bookedition?.edition_name || "Unknown",
    quantity: s.quantity || 0,
  }));

  // Activity logs
  const recentActivities = (rawLogs as any[]).map((log: any) => ({
    id: log.id,
    action: log.action || "",
    accountName: log.account?.username || log.account?.email || "System",
    date: formatDate(new Date(log.createdAt), calendarPref, "MMM dd"),
  }));

  // Production data
  const productionMap: Record<string, { status: string; fill: string; count: number }> = {
    ON_PRODUCTION: { status: "In production", fill: "#408A71", count: 0 },
    FINISHED: { status: "Completed", fill: "#285A48", count: 0 },
    CANCELLED: { status: "Cancelled", fill: "#c2410c", count: 0 },
  };
  (books as any[]).forEach((b: any) => {
    const status = b.productionstatus || "ON_PRODUCTION";
    if (productionMap[status]) productionMap[status].count++;
  });

  const dashboardData: DashboardData = {
    stats: {
      totalBooks,
      totalShops,
      totalRevenue,
      totalDebt,
      pendingOrders,
      pendingPayments: pendingPaymentsCount,
      lowStockCount,
      revenueGrowth,
    },
    financialData,
    recentActivities,
    productionData: Object.values(productionMap),
    notifications,
    recentOrders,
    lowStockItems,
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <DashboardContainer data={dashboardData} />
      </div>
    </div>
  );
}
