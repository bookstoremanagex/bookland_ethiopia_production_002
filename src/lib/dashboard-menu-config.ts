import {
    Home,
    User,
    BookOpen,
    Library,
    Store,
    ShieldAlert,
    ShoppingBag,
    BarChart3,
    Package,
    Languages,
    Printer,
    Banknote,
    BadgeDollarSign,
    FileText,
    PenTool,
    TableProperties,
    BookCopy,
    CheckCircle2,
    Clock,
    ClipboardList,
    Bell,
    History,
    FolderOpen,
    FileSignature,
    Truck,
    Receipt,
    FileCheck,
    Palette,
    Settings,
    List,
} from "lucide-react"

export interface MenuItem {
    id: string;
    title: string;
    icon: any;
    path: string;
    menuName?: string;
    subItems?: SubMenuItem[];
}

export interface SubMenuItem {
    title: string;
    icon: any;
    path: string;
    menuName?: string;
    url?: string;
}

export const ALL_DASHBOARD_MENUS: MenuItem[] = [
    { id: "home", title: "Home", icon: Home, path: "", menuName: "Home" },
    { id: "notifications", title: "Notifications", icon: Bell, path: "notifications", menuName: "Notifications" },
    { id: "notes", title: "Notes", icon: FileText, path: "notes", menuName: "Notes" },
    { id: "profile", title: "Profile", icon: User, path: "profile", menuName: "Profile" },
    { id: "books", title: "Books", icon: BookOpen, path: "books", menuName: "Books" },
    { id: "shelf", title: "Book Shelf", icon: Library, path: "books/shelf", menuName: "Book Shelf" },
    { 
        id: "stores", 
        title: "Stores", 
        icon: Store, 
        path: "stores",
        menuName: "Stores",
        subItems: [
            { title: "Manage Store", icon: Store, path: "stores", menuName: "Manage Store" },
            { title: "Store Options", icon: Settings, path: "stores/options", menuName: "Store Options" },
        ]
    },
    { id: "damaged", title: "Damaged Books", icon: ShieldAlert, path: "books/damaged", menuName: "Damaged Books" },
    { id: "shop", title: "Book Shop", icon: ShoppingBag, path: "book_shops", menuName: "Book Shop" },
    { id: "statistics", title: "Statistics", icon: BarChart3, path: "statistics", menuName: "Statistics",
        subItems: [
            { title: "General", icon: BarChart3, path: "statistics", menuName: "General" },
            { title: "Books", icon: BookOpen, path: "statistics/books", menuName: "Books" },
            { title: "Stores", icon: Store, path: "statistics/stores", menuName: "Stores" },
            { title: "Income", icon: Banknote, path: "statistics/income", menuName: "Income" },
        ]
    },
    { id: "checks", title: "Manage Checks", icon: FileCheck, path: "checks", menuName: "Checks" },
    { id: "manage_orders", title: "Manage Orders", icon: ClipboardList, path: "manage_orders", menuName: "Manage Orders" },
    { id: "manage_payment", title: "Manage Payment", icon: BadgeDollarSign, path: "manage_payment", menuName: "Manage Payments" },
    { id: "retail_management", title: "Selling to individual", icon: ShoppingBag, path: "retail_management", menuName: "Selling to individual" },
    { id: "retail_shop", title: "Retail Shop", icon: Store, path: "retail-shop", menuName: "Retail Shop" },
    { id: "activity_log", title: "Activity Log", icon: History, path: "activity_log", menuName: "Activity Log" },
    { 
        id: "production", 
        title: "Production", 
        icon: Package, 
        path: "production",
        menuName: "Production - Books",
        subItems: [
            { title: "Books", icon: BookOpen, path: "production/books", menuName: "Production - Books" }
        ]
    },
    { 
        id: "translations", 
        title: "Translations", 
        icon: Languages, 
        path: "production/translations",
        menuName: "Translations",
        subItems: [
            { title: "Translators", icon: Languages, path: "production/translators", menuName: "Translation List" },
            { title: "Translation Work", icon: PenTool, path: "production/translation_work", menuName: "Translation Work" },
            { title: "Books", icon: BookOpen, path: "production/translations/books", menuName: "Translation Books" }
        ]
    },
    { 
        id: "printing", 
        title: "Printing", 
        icon: Printer, 
        path: "printing",
        menuName: "Printing",
        subItems: [
            { title: "Printers", icon: Printer, path: "printing/printers", menuName: "Printers" },
            { title: "Manage Printing", icon: ClipboardList, path: "printing/manage", menuName: "Manage Printing" },
            { title: "Books List", icon: List, path: "printing/list", menuName: "Books List" },
            { title: "Delivery Records", icon: FileText, path: "printing/delivery-records", menuName: "Delivery Records" },
            { title: "Info", icon: BarChart3, path: "printing/info", menuName: "Printing Info" }
        ]
    },
    { 
        id: "document_management", 
        title: "Document Management", 
        icon: FolderOpen, 
        path: "document_management",
        menuName: "Document Management",
        subItems: [
            { title: "Contracts", icon: FileSignature, path: "document_management/contracts", menuName: "Contracts" },
            { title: "Print agreements", icon: FileText, path: "document_management/print_agreements", menuName: "Print Agreements" },
            { title: "Delivery notes", icon: Truck, path: "document_management/delivery_notes", menuName: "Delivery Notes" },
            { title: "Invoices", icon: Receipt, path: "document_management/invoices", menuName: "Invoices" },
            { title: "Approval documents", icon: FileCheck, path: "document_management/approval_documents", menuName: "Approval Documents" }
        ]
    },
    { 
        id: "finance", 
        title: "Finance", 
        icon: BadgeDollarSign, 
        path: "finance",
        menuName: "Finance",
        subItems: [
            { title: "Books", icon: BookOpen, path: "finance/books", menuName: "Finance - Books" },
            { title: "Shop Table", icon: TableProperties, path: "finance/shop_table", menuName: "Finance - Shop Table" },
            { title: "Edition Table", icon: BookCopy, path: "finance/edition_table", menuName: "Finance - Edition Table" },
            { title: "Costs", icon: FileText, path: "finance/costs", menuName: "Finance - Costs" },
            { title: "Printing", icon: Printer, path: "finance/printing", menuName: "Finance - Printing" },
            { title: "Round Info", icon: Repeat, path: "finance/round-info", menuName: "Finance - Round Info" }
        ]
    },
    { 
        id: "reports", 
        title: "Reports", 
        icon: FileText, 
        path: "reports",
        menuName: "Reports",
        subItems: [
            { title: "Completed Deliveries", icon: CheckCircle2, path: "reports/completed_deliveries", menuName: "Completed Deliveries" },
            { title: "Pending Deliveries", icon: Clock, path: "reports/pending_deliveries", menuName: "Pending Deliveries" }
        ]
    },
    { 
        id: "settings", 
        title: "Settings", 
        icon: FolderOpen, 
        path: "settings",
        menuName: "Settings",
        subItems: [
            { title: "Accounts", icon: User, path: "settings/accounts", menuName: "Accounts" },
            { title: "Retail Shop Accounts", icon: Store, path: "settings/retail-shop-accounts", menuName: "Retail Shop Accounts" },
            { title: "Menu Management", icon: ClipboardList, path: "settings/menus", menuName: "Menu Management" },
            { title: "Theme Customization", icon: Palette, path: "settings/theme", menuName: "Theme Customization" }
        ]
    },
    {
        id: "delivery_sample",
        title: "Delivery Sample",
        icon: Truck,
        path: "delivery_sample",
        menuName: "Delivery Sample",
    },
]
