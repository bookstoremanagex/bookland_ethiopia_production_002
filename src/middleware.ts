import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  DASHBOARD_MENU_REGISTRY,
  getMenuNameForPath,
  type DashboardDef,
} from '@/lib/dashboard-menu-registry';

export const runtime = 'nodejs';

// Cache enabled menu lookups to avoid a DB round-trip on every request.
const menuCache = new Map<string, { enabled: Set<string>; fetchedAt: number }>();
const CACHE_TTL_MS = 10_000;

async function getEnabledMenuNames(accountType: string): Promise<Set<string>> {
  const cached = menuCache.get(accountType);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.enabled;
  }

  const management = await (prisma as any).menu_management.findMany({
    where: { account_type: accountType, is_deleted: false },
    include: { menus: true },
  });

  const enabled = new Set<string>(
    management.map((m: any) => m.menus?.name).filter(Boolean)
  );
  menuCache.set(accountType, { enabled, fetchedAt: Date.now() });
  return enabled;
}

function getDashboardByRootPath(rootPath: string): DashboardDef | undefined {
  return DASHBOARD_MENU_REGISTRY.find((d) => d.rootPath === rootPath);
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const isPublicPath = pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.');

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based protection for dashboard routes
  if (session && !isPublicPath) {
    try {
      const sessionData = JSON.parse(session.value);
      const role = sessionData.role;

      const rolePathMap: Record<string, string> = {
        'ADMIN': '/admin_dashboard',
        'Operations Manager': '/operation_manager_full_dashboard',
        'Inventory Manager': '/inventory_manager_dashboard',
        'Finance Officer': '/finance_officer_dashboard',
        'Viewer': '/viewer_dashboard',
        'Delivery Account': '/delivery_dashboard_full'
      };

      const allowedPath = rolePathMap[role] || '/admin_dashboard';

      // If the user is trying to access a dashboard path that doesn't belong to their role
      const dashboardPaths = Object.values(rolePathMap);
      const isTryingToAccessOtherDashboard = dashboardPaths.some(path =>
        pathname.startsWith(path) && path !== allowedPath
      );

      if (isTryingToAccessOtherDashboard) {
        // Try to redirect to the equivalent path in their own dashboard
        // e.g., /admin_dashboard/books -> /finance_officer_dashboard/books
        let newPathname = pathname;
        for (const path of dashboardPaths) {
          if (pathname.startsWith(path)) {
            newPathname = pathname.replace(path, allowedPath);
            break;
          }
        }
        return NextResponse.redirect(new URL(newPathname, request.url));
      }

      // Menu on/off enforcement for the four managed dashboards.
      const dashboard = getDashboardByRootPath(allowedPath);
      if (dashboard && pathname.startsWith(dashboard.rootPath)) {
        const menuName = getMenuNameForPath(dashboard, pathname);

        if (menuName) {
          const menuDef = dashboard.menus.find((m) => m.name === menuName);
          const isAlwaysOn = !!menuDef?.alwaysOn;

          if (!isAlwaysOn) {
            const enabledNames = await getEnabledMenuNames(dashboard.accountType);
            if (!enabledNames.has(menuName)) {
              return new NextResponse('Not Found', { status: 404 });
            }
          }
        }
      }
    } catch (e) {
      // If parsing fails, redirect to login
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If logged in and trying to access the login page (root), redirect to dashboard
  if (session && pathname === '/') {
    try {
      const sessionData = JSON.parse(session.value);
      const role = sessionData.role;

      const rolePathMap: Record<string, string> = {
        'ADMIN': '/admin_dashboard',
        'Operations Manager': '/operation_manager_full_dashboard',
        'Inventory Manager': '/inventory_manager_dashboard',
        'Finance Officer': '/finance_officer_dashboard',
        'Viewer': '/viewer_dashboard',
        'Delivery Account': '/delivery_dashboard_full'
      };

      const redirectPath = rolePathMap[role] || '/admin_dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch (e) {
      // If parsing fails, just let them stay at /
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};