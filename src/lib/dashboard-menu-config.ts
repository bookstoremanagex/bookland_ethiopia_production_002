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
    BadgeDollarSign,
    FileText,
    PenTool,
    TableProperties,
    BookCopy,
    CheckCircle2,
    Clock,
    ClipboardList,
    Bell,
    History
} from "lucide-react"

export interface MenuItem {
    id: string;
    title: string;
    icon: any;
    path: string;
    subItems?: SubMenuItem[];
}

export interface SubMenuItem {
    title: string;
    icon: any;
    path: string;
}

export const ALL_DASHBOARD_MENUS: MenuItem[] = [
    { id: "home", title: "Home", icon: Home, path: "" },
    { id: "notifications", title: "Notifications", icon: Bell, path: "notifications" },
    { id: "profile", title: "Profile", icon: User, path: "profile" },
    { id: "books", title: "Books", icon: BookOpen, path: "books" },
    { id: "shelf", title: "Book Shelf", icon: Library, path: "books/shelf" },
    { id: "stores", title: "Stores", icon: Store, path: "stores" },
    { id: "damaged", title: "Damaged Books", icon: ShieldAlert, path: "books/damaged" },
    { id: "shop", title: "Book Shop", icon: ShoppingBag, path: "book_shops" },
    { id: "statistics", title: "Statistics", icon: BarChart3, path: "statistics" },
    { id: "activity_log", title: "Activity Log", icon: History, path: "activity_log" },
    { 
        id: "production", 
        title: "Production", 
        icon: Package, 
        path: "production",
        subItems: [
            { title: "Books", icon: BookOpen, path: "production/books" }
        ]
    },
    { 
        id: "translations", 
        title: "Translations", 
        icon: Languages, 
        path: "production/translations",
        subItems: [
            { title: "Translators", icon: Languages, path: "production/translators" },
            { title: "Translation Work", icon: PenTool, path: "production/translation_work" }
        ]
    },
    { 
        id: "printing", 
        title: "Printing", 
        icon: Printer, 
        path: "printing",
        subItems: [
            { title: "Printers", icon: Printer, path: "printing/printers" },
            { title: "Manage Printing", icon: ClipboardList, path: "printing/manage" }
        ]
    },
    { 
        id: "finance", 
        title: "Finance", 
        icon: BadgeDollarSign, 
        path: "finance",
        subItems: [
            { title: "Books", icon: BookOpen, path: "finance/books" },
            { title: "Shop Table", icon: TableProperties, path: "finance/shop_table" },
            { title: "Edition Table", icon: BookCopy, path: "finance/edition_table" }
        ]
    },
    { 
        id: "reports", 
        title: "Reports", 
        icon: FileText, 
        path: "reports",
        subItems: [
            { title: "Completed Deliveries", icon: CheckCircle2, path: "reports/completed_deliveries" },
            { title: "Pending Deliveries", icon: Clock, path: "reports/pending_deliveries" }
        ]
    }
]
