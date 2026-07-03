import React from "react";
import { notFound } from "next/navigation";
import { getPrinterForSessionFull } from "@/app/actions/printer-full-actions";
import PrinterFullHomeDashboard from "@/components/printer_full_dashboard_components/PrinterFullHomeDashboard";

export const dynamic = "force-dynamic";

export default async function PrinterFullHomePage() {
  const printer = await getPrinterForSessionFull();
  if (!printer) return notFound();

  return <PrinterFullHomeDashboard printer={printer} />;
}
