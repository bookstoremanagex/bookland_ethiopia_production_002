export const FINANCE_DASHBOARD_ROOT = "/finance_officer_dashboard";
export const ADMIN_DASHBOARD_ROOT = "/admin_dashboard";

export function getDashboardRoot(pathname: string | null | undefined): string {
  if (pathname && pathname.startsWith(FINANCE_DASHBOARD_ROOT)) {
    return FINANCE_DASHBOARD_ROOT;
  }
  return ADMIN_DASHBOARD_ROOT;
}

export function shopDetailHref(pathname: string | null | undefined, shopId: number): string {
  return getDashboardRoot(pathname) === FINANCE_DASHBOARD_ROOT
    ? `${FINANCE_DASHBOARD_ROOT}/book_shop`
    : `${ADMIN_DASHBOARD_ROOT}/book_shops/${shopId}`;
}

export function editionDetailHref(pathname: string | null | undefined, editionId: number): string {
  return getDashboardRoot(pathname) === FINANCE_DASHBOARD_ROOT
    ? `${FINANCE_DASHBOARD_ROOT}/edition_table`
    : `${ADMIN_DASHBOARD_ROOT}/books/editions/${editionId}`;
}

export function paymentDetailHref(pathname: string | null | undefined, shopId: number): string {
  return getDashboardRoot(pathname) === FINANCE_DASHBOARD_ROOT
    ? `${FINANCE_DASHBOARD_ROOT}/payments-due`
    : `${ADMIN_DASHBOARD_ROOT}/manage_payment/${shopId}/debts-payments`;
}