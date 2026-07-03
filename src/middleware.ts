import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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
        'Operations Manager': '/operation_manager_dashboard',
        'Inventory Manager': '/inventory_manager_dashboard',
        'Finance Officer': '/finance_officer_dashboard',
        'Sales Staff': '/sales_staff_dashboard',
        'Retail Manager': '/retail_manager_dashboard',
        'Delivery and Sales Management': '/delivery_and_sales_dashboard',
        'Delivery Sample': '/delivery_sample_dashboard',
        'Printer': '/printer_full',
        'Viewer': '/viewer_dashboard',
        'Delivery Account': '/delivery_dashboard_full',
        'Retail Shop': '/retail_shop_dashboard'
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
        'Operations Manager': '/operation_manager_dashboard',
        'Inventory Manager': '/inventory_manager_dashboard',
        'Finance Officer': '/finance_officer_dashboard',
        'Sales Staff': '/sales_staff_dashboard',
        'Retail Manager': '/retail_manager_dashboard',
        'Delivery and Sales Management': '/delivery_and_sales_dashboard',
        'Delivery Sample': '/delivery_sample_dashboard',
        'Printer': '/printer_full',
        'Viewer': '/viewer_dashboard',
        'Delivery Account': '/delivery_dashboard_full',
        'Retail Shop': '/retail_shop_dashboard'
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
