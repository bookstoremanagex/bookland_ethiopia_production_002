import prisma from "@/lib/prisma";
import DashboardContainer from "@/components/admin_dashboard_components/home_dashboard/DashboardContainer";
import { getServerCalendarPref } from "@/lib/server-calendar"
import { formatDate, convertToEthiopian, ETHIOPIAN_MONTHS } from "@/lib/calendar-utils"
import { getTopSellers } from "@/app/actions/top-sellers-actions";
import { getLastBackupTime } from "@/app/actions/backup-actions";

const LOW_STOCK_THRESHOLD = 500;

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
  orderMonthsData: { name: string; orders: number }[];
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
    author: string;
    bookImage: string | null;
    totalQuantity: number;
    editionCount: number;
    uniqueCode: string;
    readyToTransfer: number;
  }[];
  topBooks: {
    id: number;
    uniqueCode: string;
    title: string;
    author: string;
    bookImage: string | null;
    totalQty: number;
  }[];
  lastBackupAt: string | null;
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
    rawCentralEditions,
    rawLogs,
    rawStores,
    rawPendingPayments,
    rawPendingOrdersCount,
    prevAssignments,
    rawTopSellers,
    backupTimeRes,
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
      where: {
        is_deleted: false,
        is_approved: true,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
      include: { bookshopes: true, order_items: true },
    }),
    (prisma as any).bookeditionstores.findMany({
      where: { is_deleted: false },
      include: {
        bookedition: { include: { books: true } },
      },
    }),
    (prisma as any).bookedition.findMany({
      where: { is_deleted: false, count_remening_for_transfer: { gt: 0 } },
      include: { books: true },
    }),
    (prisma as any).activityLogs.findMany({
      where: { is_deleted: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { account: true },
    }),
    (prisma as any).stores.findMany({
      where: { is_deleted: false },
      include: {
        bookeditionstores: {
          where: { is_deleted: false },
        },
      },
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
    getTopSellers("all_time"),
    getLastBackupTime(),
  ]);

  // Stats
  const totalRevenue = assignments.reduce((acc: any, a: any) => acc + (a.total_price || 0), 0);
  const totalPaid = assignments.reduce((acc: any, a: any) => acc + (a.already_paid || 0), 0);
  const totalDebt = totalRevenue - totalPaid;

  const ordersList = (rawOrders as any[]) || [];
  const pendingOrders = rawPendingOrdersCount || 0;
  const pendingPaymentsCount = rawPendingPayments || 0;

  const lowStockList = (rawLowStock as any[]) || [];
  const centralEditionsList = (rawCentralEditions as any[]) || [];

  // Aggregate all edition/store inventory per book, then keep books whose total is below the threshold
  const bookStockMap = new Map<number, { book: any; total: number; editionCount: number }>();
  for (const entry of lowStockList) {
    const book = entry.bookedition?.books;
    const bookId = book?.id;
    if (!bookId) continue;
    const existing = bookStockMap.get(bookId);
    if (existing) {
      existing.total += entry.quantity || 0;
      existing.editionCount += 1;
    } else {
      bookStockMap.set(bookId, { book, total: entry.quantity || 0, editionCount: 1 });
    }
  }

  // Aggregate copies available to transfer (printed but not yet in stores) per book
  const centralStockMap = new Map<number, number>();
  for (const edition of centralEditionsList) {
    const bookId = edition?.books?.id;
    if (!bookId) continue;
    centralStockMap.set(
      bookId,
      (centralStockMap.get(bookId) || 0) + Number(edition.count_remening_for_transfer || 0)
    );
  }

  const lowStockBooks = Array.from(bookStockMap.values()).filter(
    (bs) => bs.total >= 1 && bs.total < LOW_STOCK_THRESHOLD
  );
  lowStockBooks.sort((a, b) => a.total - b.total);
  const lowStockCount = lowStockBooks.length;
  const lowStockItems = lowStockBooks.slice(0, 5).map((bs) => ({
    id: bs.book.id,
    bookTitle: bs.book.title || "Unknown",
    author: bs.book.author || "",
    bookImage: bs.book.book_image_url || null,
    totalQuantity: bs.total,
    editionCount: bs.editionCount,
    uniqueCode: bs.book.unique_identification_code || "",
    readyToTransfer: centralStockMap.get(bs.book.id) || 0,
  }));

  const prevRevenue = prevAssignments.reduce((acc: any, a: any) => acc + (a.total_price || 0), 0);
  const revenueGrowth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;

  // Orders by date (last 30 days, approved only) — respects calendar preference
  const GREG_MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayMap = new Map<string, { name: string; orders: number; dateKey: string }>();
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    let label: string;
    let key: string;
    if (calendarPref === "gregorian") {
      label = `${GREG_MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    } else {
      const eth = convertToEthiopian(d);
      label = `${ETHIOPIAN_MONTHS[eth.month - 1].slice(0, 3)} ${eth.day}`;
      key = `${eth.year}-${String(eth.month).padStart(2, "0")}-${String(eth.day).padStart(2, "0")}`;
    }
    dayMap.set(key, { name: label, orders: 0, dateKey: key });
  }
  for (const o of ordersList) {
    const d = new Date(o.createdAt);
    let key: string;
    if (calendarPref === "gregorian") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    } else {
      const eth = convertToEthiopian(d);
      key = `${eth.year}-${String(eth.month).padStart(2, "0")}-${String(eth.day).padStart(2, "0")}`;
    }
    if (dayMap.has(key)) {
      const dayQty = (o.order_items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      dayMap.get(key)!.orders += dayQty;
    }
  }
  const orderMonthsData = Array.from(dayMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  // Notifications
  const notifications = (rawNotifications as any[]).map((n: any) => ({
    id: n.id,
    title: n.title || "",
    message: n.message || "",
    details: n.details || null,
    type: n.type || "INFO",
    createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
  }));

  // Recent orders (latest 10)
  const recentOrders = ordersList.slice(0, 5).map((o: any) => ({
    id: o.id,
    shopName: o.bookshopes?.name || "Unknown",
    totalAmount: o.total_amount || 0,
    status: o.status || "Pending",
    date: formatDate(new Date(o.createdAt), calendarPref, "MMM dd"),
  }));

  const recentActivities = (rawLogs as any[]).map((log: any) => ({
    id: log.id,
    action: log.action || "",
    accountName: log.account?.username || log.account?.email || "System",
    date: formatDate(new Date(log.createdAt), calendarPref, "MMM dd"),
  }));

  // Production data — stock in stores
  const STORE_COLORS = ["#408A71", "#285A48", "#B0E4CC", "#059669", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"];
  const productionData = (rawStores as any[]).map((store: any, idx: number) => {
    const totalQty = (store.bookeditionstores || []).reduce(
      (sum: number, bes: any) => sum + (bes.quantity || 0),
      0
    );
    return {
      status: store.name,
      count: totalQty,
      fill: STORE_COLORS[idx % STORE_COLORS.length],
    };
  });

  // Shop orders data

  const topBooks = (rawTopSellers?.books || [])
    .filter((b: any) => b.book_image_url)
    .map((b: any) => ({
      id: b.bookId,
      uniqueCode: b.unique_identification_code || "",
      title: b.title || "Unknown",
      author: b.author || "",
      bookImage: b.book_image_url || null,
      totalQty: b.totalQty || 0,
    }));

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
    orderMonthsData,
    recentActivities,
    productionData,
    notifications,
    recentOrders,
    lowStockItems,
    topBooks,
    lastBackupAt: backupTimeRes?.success ? backupTimeRes.data : null,
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <DashboardContainer data={dashboardData} />
      </div>
    </div>
  );
}
