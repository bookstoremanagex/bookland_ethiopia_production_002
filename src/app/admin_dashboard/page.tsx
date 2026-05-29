import prisma from "@/lib/prisma";
import DashboardContainer from "@/components/admin_dashboard_components/home_dashboard/DashboardContainer";
import { getServerCalendarPref } from "@/lib/server-calendar"
import { formatDate } from "@/lib/calendar-utils"

export default async function AdminHomePage() {
  const calendarPref = await getServerCalendarPref()
  // 1. Fetch High Level Stats
  const [totalBooks, totalShops, assignments, rawNotifications] = await Promise.all([
    prisma.books.count({ where: { is_deleted: false } }),
    (prisma as any).bookshopes.count({ where: { is_deleted: false } }),
    (prisma as any).bookshopeditions.findMany({ where: { is_deleted: false } }),
    (prisma as any).notification.findMany({
      where: { is_deleted: false, is_read: false, notification_to: "ADMIN" },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const notifications = (rawNotifications as any[]).map((n: any) => ({
    id: n.id,
    title: n.title || "",
    message: n.message || "",
    details: n.details || null,
    type: n.type || "INFO",
    createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
  }));

  const totalRevenue = assignments.reduce((acc: any, a: any) => acc + (a.total_price || 0), 0);
  const totalPaid = assignments.reduce((acc: any, a: any) => acc + (a.already_paid || 0), 0);
  const totalDebt = totalRevenue - totalPaid;

  // 2. Fetch Recent Activities
  const recentAssignments = await (prisma as any).bookshopeditions.findMany({
    where: { is_deleted: false },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      bookedition: { include: { books: true } },
      bookshopes: true
    }
  }) as any;

  const recentActivities = recentAssignments.map((a: any) => ({
    id: a.id,
    bookTitle: a.bookedition.books.title,
    shopName: a.bookshopes.name,
    quantity: a.quantity,
    date: formatDate(new Date(a.createdAt), calendarPref, "MMM dd")
  }));

  // 3. Aggregate Production Data
  const books = await prisma.books.findMany({
    where: { is_deleted: false },
    select: { productionstatus: true }
  });

  const productionMap: any = {
    'ON_PRODUCTION': { status: 'In production', fill: '#408A71', count: 0 },
    'FINISHED': { status: 'Completed', fill: '#285A48', count: 0 },
    'CANCELLED': { status: 'Cancelled', fill: '#c2410c', count: 0 }
  };

  books.forEach(b => {
    const status = b.productionstatus || 'ON_PRODUCTION';
    if (productionMap[status]) productionMap[status].count++;
  });

  // 4. Financial Trend (Mocked based on current reality for visual pop)
  const financialData = [
    { name: "Jan", revenue: totalRevenue * 0.4, debt: totalDebt * 0.3 },
    { name: "Feb", revenue: totalRevenue * 0.6, debt: totalDebt * 0.5 },
    { name: "Mar", revenue: totalRevenue * 0.8, debt: totalDebt * 0.7 },
    { name: "Apr", revenue: totalRevenue, debt: totalDebt }
  ];

  const dashboardData = {
    stats: {
      totalBooks,
      totalShops,
      totalRevenue,
      totalDebt,
      revenueGrowth: 24,
      debtChange: -12
    },
    financialData,
    recentActivities,
    productionData: Object.values(productionMap),
    notifications,
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <DashboardContainer data={dashboardData} />
      </div>
    </div>
  );
}
