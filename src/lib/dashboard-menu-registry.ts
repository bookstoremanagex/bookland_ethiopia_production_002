/**
 * Single source of truth for the menu on/off system.
 *
 * Each dashboard (except admin and delivery_dashboard_full) has its menu list
 * recorded in the DB via the idempotent seed action (see menu-seed-actions).
 * The admin toggles each menu per dashboard from Settings -> Menu Management.
 * When a menu is turned OFF it is hidden from that dashboard's sidebar AND its
 * pages return 404 (enforced in src/middleware.ts).
 *
 * `menus.name` is unique in the DB, so shared names (e.g. "Books") reuse the
 * same row; enabling/disabling is per dashboard via menu_management.
 */

export interface DashboardMenuDef {
  /** Canonical menu name stored in the `menus` table. */
  name: string;
  /** URL paths (relative to the dashboard root) covered by this menu. */
  paths: string[];
  /** Home is always on and can never be disabled. */
  alwaysOn?: boolean;
}

export interface DashboardDef {
  /** Value used in menu_management.account_type. */
  accountType: string;
  /** Role key passed to getEnabledMenuNamesForRole. */
  roleKey: string;
  /** Dashboard root path (also the Home path). */
  rootPath: string;
  menus: DashboardMenuDef[];
}

export const DASHBOARD_MENU_REGISTRY: DashboardDef[] = [
  {
    accountType: "Operations Manager",
    roleKey: "operation_manager",
    rootPath: "/operation_manager_full_dashboard",
    menus: [
      { name: "Home", paths: [""], alwaysOn: true },
      { name: "Notifications", paths: ["/notifications"] },
      { name: "Notes", paths: ["/notes"] },
      { name: "Profile", paths: ["/profile"] },
      { name: "Delivery Sample", paths: ["/delivery-sample"] },
      { name: "Manage Orders", paths: ["/manage-orders"] },
      { name: "Books", paths: ["/production/books"] },
      { name: "Translators", paths: ["/production/translators"] },
      { name: "Translation Work", paths: ["/production/translation-work"] },
      { name: "Translation Books", paths: ["/production/translation-books"] },
      { name: "Printers", paths: ["/printing/printers"] },
      { name: "Manage Printing", paths: ["/printing/manage"] },
      { name: "Books List", paths: ["/printing/list"] },
      { name: "Delivery Records", paths: ["/printing/delivery-records"] },
      { name: "Printing Info", paths: ["/printing/info"] },
      { name: "Completed Deliveries", paths: ["/reports/completed-deliveries"] },
      { name: "Pending Deliveries", paths: ["/reports/pending-deliveries"] },
    ],
  },
  {
    accountType: "Finance Officer",
    roleKey: "finance_officer",
    rootPath: "/finance_officer_dashboard",
    menus: [
      { name: "Home", paths: [""], alwaysOn: true },
      { name: "Profile", paths: ["/profile"] },
      { name: "Book Shop", paths: ["/book_shop"] },
      { name: "Books", paths: ["/books"] },
      { name: "Shop Table", paths: ["/shop_table"] },
      { name: "Edition Table", paths: ["/edition_table"] },
      { name: "Costs", paths: ["/costs"] },
      { name: "Printing", paths: ["/printing"] },
      { name: "Round Info", paths: ["/round-info"] },
      { name: "Payments Due", paths: ["/payments-due"] },
      { name: "Daily Report", paths: ["/daily-report"] },
      { name: "Period Report", paths: ["/period-report"] },
    ],
  },
  {
    accountType: "Inventory Manager",
    roleKey: "inventory_manager",
    rootPath: "/inventory_manager_dashboard",
    menus: [
      { name: "Home", paths: [""], alwaysOn: true },
      { name: "Profile", paths: ["/profile"] },
      { name: "Books", paths: ["/books", "/statistics/books"] },
      { name: "Book Shelf", paths: ["/books/shelf"] },
      { name: "Damaged Books", paths: ["/books/damaged"] },
      { name: "Production - Books", paths: ["/production/books"] },
      { name: "Low Stock", paths: ["/production/low-stock"] },
      { name: "Manage Store", paths: ["/stores"] },
      { name: "Store Options", paths: ["/stores/options"] },
      { name: "Stores", paths: ["/statistics/stores"] },
    ],
  },
  {
    accountType: "Viewer",
    roleKey: "viewer",
    rootPath: "/viewer_dashboard",
    menus: [
      { name: "Home", paths: [""], alwaysOn: true },
      { name: "Profile", paths: ["/profile"] },
      { name: "Books", paths: ["/books"] },
      { name: "Book Shelf", paths: ["/books/shelf"] },
      { name: "Statistics", paths: ["/statistics", "/statistics/books", "/statistics/stores", "/statistics/income"] },
      { name: "Stores", paths: ["/stores"] },
      { name: "Book Shops", paths: ["/book_shops"] },
      { name: "Completed Deliveries", paths: ["/reports/completed-deliveries"] },
      { name: "Pending Deliveries", paths: ["/reports/pending-deliveries"] },
      { name: "Translators", paths: ["/production/translators"] },
      { name: "Translation Work", paths: ["/production/translation-work"] },
      { name: "Printing Info", paths: ["/printing/info"] },
    ],
  },
];

/**
 * Map a pathname to the menu name that covers it for a given dashboard.
 * Longest path prefix wins (e.g. /books/shelf -> Book Shelf, not Books).
 */
export function getMenuNameForPath(dashboard: DashboardDef, pathname: string): string | null {
  let best: DashboardMenuDef | null = null;
  for (const menu of dashboard.menus) {
    for (const p of menu.paths) {
      const prefix = dashboard.rootPath + p;
      const matches = p === ""
        ? pathname === dashboard.rootPath
        : pathname === prefix || pathname.startsWith(prefix + "/");
      if (matches && (!best || p.length > (best.paths[0]?.length ?? 0))) {
        best = menu;
      }
    }
  }
  return best?.name ?? null;
}