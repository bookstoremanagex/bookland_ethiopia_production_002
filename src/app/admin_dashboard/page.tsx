import prisma from "@/lib/prisma";
import DashboardContainer from "@/components/admin_dashboard_components/home_dashboard/DashboardContainer";

export default async function AdminHomePage() {
  // 1. Fetch High Level Stats
  const [totalBooks, totalShops, assignments] = await Promise.all([
    prisma.books.count({ where: { is_deleted: false } }),
    (prisma as any).bookshopes.count({ where: { is_deleted: false } }),
    (prisma as any).bookshopeditions.findMany({ where: { is_deleted: false } })
  ]);

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
    date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  // 3. Aggregate Production Data
  const books = await prisma.books.findMany({
    where: { is_deleted: false },
    select: { productionstatus: true }
  });

  const productionMap: any = {
    'ON_PRODUCTION': { status: 'In Production', fill: '#1e293b', count: 0 },
    'FINISHED': { status: 'Completed', fill: '#10b981', count: 0 },
    'CANCELLED': { status: 'Cancelled', fill: '#f43f5e', count: 0 }
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
      revenueGrowth: 24, // Static for demo
      debtChange: -12    // Static for demo
    },
    financialData,
    recentActivities,
    productionData: Object.values(productionMap)
  };

  return (
    <div className="p-6 md:p-10">
      <DashboardContainer data={dashboardData} />
    </div>
  );
}
