import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import admin pages to avoid heavy initial bundle and circular dependencies
// Note: We use dynamic imports because these are Server Components being imported into other Server Components
// in a catch-all route.

export const MODULE_MAP: Record<string, any> = {
    "books": dynamic(() => import("@/app/admin_dashboard/books/page")),
    "books/shelf": dynamic(() => import("@/app/admin_dashboard/books/shelf/page")),
    "books/damaged": dynamic(() => import("@/app/admin_dashboard/books/damaged/page")),
    "stores": dynamic(() => import("@/app/admin_dashboard/stores/page")),
    "book_shops": dynamic(() => import("@/app/admin_dashboard/book_shops/page")),
    "statistics": dynamic(() => import("@/app/admin_dashboard/statistics/page")),
    "production/books": dynamic(() => import("@/app/admin_dashboard/production/books/page")),
    "production/translators": dynamic(() => import("@/app/admin_dashboard/production/translators/page")),
    "production/translation_work": dynamic(() => import("@/app/admin_dashboard/production/translation_work/page")),
    "printing/printers": dynamic(() => import("@/app/admin_dashboard/printing/printers/page")),
    "printing/manage": dynamic(() => import("@/app/admin_dashboard/printing/manage/page")),
    "document_management/contracts": dynamic(() => import("@/app/admin_dashboard/document_management/contracts/page")),
    "document_management/print_agreements": dynamic(() => import("@/app/admin_dashboard/document_management/print_agreements/page")),
    "document_management/delivery_notes": dynamic(() => import("@/app/admin_dashboard/document_management/delivery_notes/page")),
    "document_management/invoices": dynamic(() => import("@/app/admin_dashboard/document_management/invoices/page")),
    "document_management/approval_documents": dynamic(() => import("@/app/admin_dashboard/document_management/approval_documents/page")),
    "finance/books": dynamic(() => import("@/app/admin_dashboard/finance/books/page")),
    "finance/shop_table": dynamic(() => import("@/app/admin_dashboard/finance/shop_table/page")),
    "finance/edition_table": dynamic(() => import("@/app/admin_dashboard/finance/edition_table/page")),
    "reports/completed_deliveries": dynamic(() => import("@/app/admin_dashboard/reports/completed_deliveries/page")),
    "reports/pending_deliveries": dynamic(() => import("@/app/admin_dashboard/reports/pending_deliveries/page")),
    "profile": dynamic(() => import("@/app/admin_dashboard/profile/page")),
    
    // Detail Pages (Dynamic Routes)
    "books/detail": dynamic(() => import("@/app/admin_dashboard/books/[id]/page")),
    "books/editions/detail": dynamic(() => import("@/app/admin_dashboard/books/editions/[id]/page")),
    "production/books/detail": dynamic(() => import("@/app/admin_dashboard/books/[id]/page")),
    "finance/books/detail": dynamic(() => import("@/app/admin_dashboard/books/[id]/page")),
    "shop_assignments/detail": dynamic(() => import("@/app/admin_dashboard/shop_assignments/[id]/page")),
    "stores/detail": dynamic(() => import("@/app/admin_dashboard/stores/[id]/page")),
    "book_shops/detail": dynamic(() => import("@/app/admin_dashboard/book_shops/[id]/page")),
    "production/translators/detail": dynamic(() => import("@/app/admin_dashboard/production/translators/[id]/page")),
    "production/translation_work/detail": dynamic(() => import("@/app/admin_dashboard/production/translation_work/[id]/page")),
    "printing/printers/detail": dynamic(() => import("@/app/admin_dashboard/printing/printers/[id]/page")),
    "printing/manage/detail": dynamic(() => import("@/app/admin_dashboard/printing/manage/[id]/page")),
    "reports/pending_deliveries/detail": dynamic(() => import("@/app/admin_dashboard/reports/pending_deliveries/[id]/page")),
    "books/damaged/detail": dynamic(() => import("@/app/admin_dashboard/books/damaged/[id]/page")),
    "production/translators/add": dynamic(() => import("@/app/admin_dashboard/production/translators/add/page")),
    "production/translation_work/new": dynamic(() => import("@/app/admin_dashboard/production/translation_work/new/page")),
    "books/add_book": dynamic(() => import("@/app/admin_dashboard/books/add_book/page")),
}
