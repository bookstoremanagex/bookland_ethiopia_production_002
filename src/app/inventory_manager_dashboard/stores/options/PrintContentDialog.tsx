"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Store, Printer, Loader2 } from 'lucide-react';
import { getStores } from '@/app/actions/get-stores';
import { getStoreInventoryWithDetails } from '@/app/actions/store-inventory-actions';
import { convertToEthiopian } from '@/lib/calendar-utils';

const ETHIOPIAN_MONTHS = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታሕሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ",
];

const ETHIOPIAN_WEEKDAYS = [
    "እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ",
];

interface PrintContentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FontSize = "extrasmall" | "small" | "medium" | "big";

const FONT_SIZE_OPTIONS: { key: FontSize; label: string }[] = [
    { key: "extrasmall", label: "Extra Small" },
    { key: "small", label: "Small" },
    { key: "medium", label: "Medium" },
    { key: "big", label: "Big" },
];

export default function PrintContentDialog({ open, onOpenChange }: PrintContentDialogProps) {
    const [stores, setStores] = useState<any[]>([]);
    const [storeLoading, setStoreLoading] = useState(false);
    const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);
    const [fontSize, setFontSize] = useState<FontSize>("medium");
    const [editionLimit, setEditionLimit] = useState(false);
    const [formalTable, setFormalTable] = useState(false);
    const [showBoth, setShowBoth] = useState(true);
    const [showExclusive, setShowExclusive] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedStoreIds([]);
            setFontSize("medium");
            setEditionLimit(false);
            setFormalTable(false);
            setShowBoth(true);
            setShowExclusive(true);
            setStoreLoading(true);
            getStores().then(res => {
                if (res.success) setStores(res.data as any[]);
                setStoreLoading(false);
            });
        }
    }, [open]);

    useEffect(() => {
        if (selectedStoreIds.length === 2) {
            setShowBoth(true);
            setShowExclusive(true);
        }
    }, [selectedStoreIds.length]);

    const toggleStore = (id: number) => {
        setSelectedStoreIds(prev => {
            if (prev.includes(id)) return prev.filter(sid => sid !== id);
            if (prev.length >= 2) return prev;
            return [...prev, id];
        });
    };

    const handleGeneratePrint = async () => {
        if (selectedStoreIds.length === 0) return;
        setGenerating(true);

        const inventories = await Promise.all(
            selectedStoreIds.map(async (id) => {
                const res = await getStoreInventoryWithDetails(id);
                const store = stores.find(s => s.id === id);
                return {
                    storeId: id,
                    storeName: store?.name || "Unknown Store",
                    items: res.success ? (res.data.bookeditionstores || []) : [],
                };
            })
        );

        setGenerating(false);

        const fontSizePx = fontSize === "extrasmall" ? "9" : fontSize === "small" ? "11" : fontSize === "medium" ? "13" : "16";
        const titleSizePx = fontSize === "extrasmall" ? "11" : fontSize === "small" ? "13" : fontSize === "medium" ? "15" : "18";
        const storeNameSizePx = fontSize === "extrasmall" ? "13" : fontSize === "small" ? "15" : fontSize === "medium" ? "18" : "22";

        const now = new Date();
        const gcDateStr = now.toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        });

        const eth = convertToEthiopian(now);
        const ethWeekday = ETHIOPIAN_WEEKDAYS[now.getDay()];
        const ethMonth = ETHIOPIAN_MONTHS[eth.month - 1] || "ጳጉሜ";
        const ethDateStr = `${ethWeekday}, ${ethMonth} ${eth.day}, ${eth.year}`;

        let bodyHtml = "";

        if (inventories.length === 1) {
            const inv = inventories[0];
            const groups: Record<string, any[]> = {};
            for (const item of inv.items) {
                const key = item.bookedition?.books?.title || "Unknown Book";
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
            }
            const bookEntries = Object.entries(groups)
                .map(([bookTitle, items]) => ({
                    bookTitle,
                    author: items[0]?.bookedition?.books?.author || "",
                    editions: items.filter((i: any) => (i.quantity ?? 0) > 0),
                }))
                .filter(entry => entry.editions.length > 0)
                .sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));

            if (bookEntries.length === 0) {
                bodyHtml = `<div style="color:#94a3b8;font-style:italic;padding:20px 0;text-align:center;">No inventory to display</div>`;
            } else {
                bodyHtml = `<div class="store-header">${escapeHtml(inv.storeName)}</div>
                    ${bookEntries.map(entry => {
                        if (editionLimit && entry.editions.length === 1) {
                            const ed = entry.editions[0];
                            const totalQty = ed.quantity ?? 0;
                            return `<div class="book-group">
                                <div class="book-title book-title-inline">${escapeHtml(entry.bookTitle)}${entry.author ? ` <span class="author">by ${escapeHtml(entry.author)}</span>` : ""} <span class="edition-tag">[${escapeHtml(ed.bookedition?.edition_name || "N/A")}]</span> <span class="edition-qty-inline">${totalQty}</span></div>
                            </div>`;
                        }
                        return `<div class="book-group">
                            <div class="book-title">${escapeHtml(entry.bookTitle)}${entry.author ? ` <span class="author">by ${escapeHtml(entry.author)}</span>` : ""}</div>
                            ${entry.editions.map((ed: any) => `
                                <div class="edition-row">
                                    <span class="edition-name">${escapeHtml(ed.bookedition?.edition_name || "N/A")}</span>
                                    <span class="edition-qty">${ed.quantity ?? 0}</span>
                                </div>
                            `).join("")}
                        </div>`;
                    }).join("")}`;
            }
        } else if (inventories.length === 2) {
            const [storeA, storeB] = inventories;

            const bookMapA: Record<string, { author: string; editions: any[] }> = {};
            const bookMapB: Record<string, { author: string; editions: any[] }> = {};

            for (const item of storeA.items) {
                if ((item.quantity ?? 0) <= 0) continue;
                const title = item.bookedition?.books?.title || "Unknown Book";
                if (!bookMapA[title]) bookMapA[title] = { author: item.bookedition?.books?.author || "", editions: [] };
                bookMapA[title].editions.push(item);
            }
            for (const item of storeB.items) {
                if ((item.quantity ?? 0) <= 0) continue;
                const title = item.bookedition?.books?.title || "Unknown Book";
                if (!bookMapB[title]) bookMapB[title] = { author: item.bookedition?.books?.author || "", editions: [] };
                bookMapB[title].editions.push(item);
            }

            const allTitles = [...new Set([...Object.keys(bookMapA), ...Object.keys(bookMapB)])].sort();
            const commonTitles = allTitles.filter(t => bookMapA[t] && bookMapB[t]);
            const exclusiveTitlesA = allTitles.filter(t => bookMapA[t] && !bookMapB[t]).sort();
            const exclusiveTitlesB = allTitles.filter(t => !bookMapA[t] && bookMapB[t]).sort();
            const exclusiveTitles = [...exclusiveTitlesA, ...exclusiveTitlesB];

            if (formalTable) {
                const fSize = Math.max(8, parseInt(fontSizePx) - 2);

                const formatEditionsCell = (editions: any[]) => {
                    const filtered = editions.filter((e: any) => (e.quantity ?? 0) > 0);
                    if (filtered.length === 0) return `<span style="color:#cbd5e1;">—</span>`;
                    return filtered.map((e: any) =>
                        `<div style="font-size:${fSize}px;color:#334155;padding:1px 0;border-bottom:1px dotted #e2e8f0;line-height:1.5;">
                            <span style="font-weight:600;">${escapeHtml(e.bookedition?.edition_name || "N/A")}</span>:
                            <span style="font-weight:700;color:#6366f1;">${e.quantity ?? 0}</span>
                        </div>`
                    ).join("");
                };

                if (showBoth) {
                    if (commonTitles.length > 0) {
                        bodyHtml += `<div style="font-size:${storeNameSizePx}px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#6366f1;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #6366f1;">Books in Both Stores</div>
                        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                            <thead>
                                <tr style="border-bottom:2px solid #cbd5e1;">
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">#</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Book</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(storeA.storeName)}</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(storeB.storeName)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${commonTitles.map((title, idx) => {
                                    const a = bookMapA[title];
                                    const b = bookMapB[title];
                                    const edA = a.editions.filter((e: any) => (e.quantity ?? 0) > 0);
                                    const edB = b.editions.filter((e: any) => (e.quantity ?? 0) > 0);
                                    return `<tr style="border-bottom:1px solid #f1f5f9;page-break-inside:avoid;">
                                        <td style="padding:4px 6px;color:#94a3b8;font-weight:600;vertical-align:top;white-space:nowrap;font-size:${fSize}px;">${idx + 1}</td>
                                        <td style="padding:4px 6px;vertical-align:top;">
                                            <div style="font-weight:700;color:#0f172a;font-size:${fSize}px;">${escapeHtml(title)}</div>
                                        </td>
                                        <td style="padding:4px 6px;vertical-align:top;width:28%;">${formatEditionsCell(edA)}</td>
                                        <td style="padding:4px 6px;vertical-align:top;width:28%;">${formatEditionsCell(edB)}</td>
                                    </tr>`;
                                }).join("")}
                            </tbody>
                        </table>`;
                    } else {
                        bodyHtml += `<div style="color:#94a3b8;font-style:italic;padding:12px 0;text-align:center;font-size:${fSize}px;margin-bottom:16px;">No books found in both stores</div>`;
                    }
                }

                if (showExclusive) {
                    if (exclusiveTitles.length > 0) {
                        bodyHtml += `<div style="font-size:${storeNameSizePx}px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#f59e0b;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #f59e0b;">Books in Only One Store</div>
                        <table style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="border-bottom:2px solid #cbd5e1;">
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">#</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Book</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Store</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Edition</th>
                                    <th style="text-align:left;padding:4px 6px;font-size:${fSize - 2}px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${exclusiveTitles.flatMap((title, idx) => {
                                    const inA = !!bookMapA[title];
                                    const book = inA ? bookMapA[title] : bookMapB[title];
                                    const storeName = inA ? storeA.storeName : storeB.storeName;
                                    const editions = book.editions.filter((e: any) => (e.quantity ?? 0) > 0);
                                    return editions.map((ed: any) =>
                                        `<tr style="border-bottom:1px solid #f1f5f9;page-break-inside:avoid;">
                                            <td style="padding:4px 6px;color:#94a3b8;font-weight:600;vertical-align:middle;white-space:nowrap;font-size:${fSize}px;">${idx + 1}</td>
                                            <td style="padding:4px 6px;vertical-align:middle;">
                                                <div style="font-weight:700;color:#0f172a;font-size:${fSize}px;">${escapeHtml(title)}</div>
                                            </td>
                                            <td style="padding:4px 6px;vertical-align:middle;font-size:${fSize}px;color:#6366f1;font-weight:700;">${escapeHtml(storeName)}</td>
                                            <td style="padding:4px 6px;vertical-align:middle;font-size:${fSize}px;color:#475569;">${escapeHtml(ed.bookedition?.edition_name || "N/A")}</td>
                                            <td style="padding:4px 6px;vertical-align:middle;font-size:${fSize}px;font-weight:700;color:#6366f1;">${ed.quantity ?? 0}</td>
                                        </tr>`
                                    );
                                }).join("")}
                            </tbody>
                        </table>`;
                    }
                }
            } else {
                const renderEditionsCell = (editions: any[]) => {
                    if (editionLimit && editions.length === 1) {
                        const ed = editions[0];
                        return `<span style="font-weight:600;color:#475569;">${escapeHtml(ed.bookedition?.edition_name || "N/A")}</span> <span style="font-weight:700;color:#6366f1;background:#eef2ff;padding:0 8px;border-radius:999px;font-size:${fontSizePx}px;line-height:1.8;display:inline-block;">${ed.quantity ?? 0}</span>`;
                    }
                    return editions.map((ed: any) =>
                        `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0 2px 8px;border-bottom:1px solid #f1f5f9;">
                            <span style="color:#475569;">${escapeHtml(ed.bookedition?.edition_name || "N/A")}</span>
                            <span style="font-weight:700;color:#6366f1;background:#eef2ff;padding:0 8px;border-radius:999px;font-size:${fontSizePx}px;line-height:1.8;">${ed.quantity ?? 0}</span>
                        </div>`
                    ).join("");
                };

                if (showBoth) {
                    if (commonTitles.length > 0) {
                        bodyHtml += `<div style="font-size:${storeNameSizePx}px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#6366f1;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #6366f1;">Books in Both Stores</div>
                        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
                            <thead>
                                <tr style="border-bottom:2px solid #e2e8f0;">
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">#</th>
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">Book</th>
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(storeA.storeName)}</th>
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(storeB.storeName)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${commonTitles.map((title, idx) => {
                                    const a = bookMapA[title];
                                    const b = bookMapB[title];
                                    const author = a.author || b.author;
                                    const allEdNames = [...new Set([
                                        ...a.editions.map((e: any) => e.bookedition?.edition_name || "N/A"),
                                        ...b.editions.map((e: any) => e.bookedition?.edition_name || "N/A"),
                                    ])].sort();
                                    const edA = a.editions.filter((e: any) => (e.quantity ?? 0) > 0);
                                    const edB = b.editions.filter((e: any) => (e.quantity ?? 0) > 0);
                                    return `<tr style="border-bottom:1px solid #f1f5f9;page-break-inside:avoid;">
                                        <td style="padding:8px 10px;color:#94a3b8;font-weight:600;vertical-align:top;white-space:nowrap;">${idx + 1}</td>
                                        <td style="padding:8px 10px;vertical-align:top;">
                                            <div style="font-weight:700;color:#0f172a;font-size:${titleSizePx}px;">${escapeHtml(title)}</div>
                                            ${author ? `<div style="font-weight:400;font-size:${fontSizePx}px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(author)}</div>` : ""}
                                        </td>
                                        <td style="padding:8px 10px;vertical-align:top;width:30%;">${renderEditionsCell(edA)}</td>
                                        <td style="padding:8px 10px;vertical-align:top;width:30%;">${renderEditionsCell(edB)}</td>
                                    </tr>`;
                                }).join("")}
                            </tbody>
                        </table>`;
                    } else {
                        bodyHtml += `<div style="color:#94a3b8;font-style:italic;padding:20px 0;text-align:center;margin-bottom:24px;">No books found in both stores</div>`;
                    }
                }

                if (showExclusive) {
                    if (exclusiveTitles.length > 0) {
                        bodyHtml += `<div style="font-size:${storeNameSizePx}px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#f59e0b;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #f59e0b;">Books in Only One Store</div>
                        <table style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="border-bottom:2px solid #e2e8f0;">
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">#</th>
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">Book</th>
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">Store</th>
                                    <th style="text-align:left;padding:6px 10px;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">Editions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${exclusiveTitles.map((title, idx) => {
                                    const inA = !!bookMapA[title];
                                    const book = inA ? bookMapA[title] : bookMapB[title];
                                    const storeName = inA ? storeA.storeName : storeB.storeName;
                                    const editions = book.editions.filter((e: any) => (e.quantity ?? 0) > 0);
                                    return `<tr style="border-bottom:1px solid #f1f5f9;page-break-inside:avoid;">
                                        <td style="padding:8px 10px;color:#94a3b8;font-weight:600;vertical-align:top;white-space:nowrap;">${idx + 1}</td>
                                        <td style="padding:8px 10px;vertical-align:top;">
                                            <div style="font-weight:700;color:#0f172a;font-size:${titleSizePx}px;">${escapeHtml(title)}</div>
                                            ${book.author ? `<div style="font-weight:400;font-size:${fontSizePx}px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(book.author)}</div>` : ""}
                                        </td>
                                        <td style="padding:8px 10px;vertical-align:top;">
                                            <span style="font-weight:700;color:#6366f1;font-size:${fontSizePx}px;">${escapeHtml(storeName)}</span>
                                        </td>
                                        <td style="padding:8px 10px;vertical-align:top;">${renderEditionsCell(editions)}</td>
                                    </tr>`;
                                }).join("")}
                            </tbody>
                        </table>`;
                    }
                }
            }
        }

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Store Inventory Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', 'Noto Sans Ethiopic', Roboto, sans-serif;
            font-size: ${fontSizePx}px;
            color: #1e293b;
            padding: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page-header {
            text-align: center;
            padding-bottom: 16px;
            margin-bottom: 20px;
            border-bottom: 3px solid #6366f1;
        }
        .page-header h1 {
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6366f1;
        }
        .page-header .date-row {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 6px;
        }
        .page-header .date-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            font-weight: 700;
            color: #6366f1;
            background: #eef2ff;
            padding: 4px 14px;
            border-radius: 999px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        .page-header .date-badge .label {
            color: #94a3b8;
            font-weight: 600;
            font-size: 8px;
        }
        .page-header .date-badge .amharic {
            font-family: 'Noto Sans Ethiopic', system-ui, sans-serif;
        }
        .store-header {
            font-size: ${storeNameSizePx}px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6366f1;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #6366f1;
        }
        .book-group {
            margin-bottom: 14px;
            page-break-inside: avoid;
        }
        .book-title {
            font-weight: 700;
            font-size: ${titleSizePx}px;
            margin-bottom: 3px;
            color: #0f172a;
        }
        .author {
            font-weight: 400;
            font-size: ${fontSizePx}px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        .edition-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px 0 2px 14px;
            border-bottom: 1px solid #f1f5f9;
        }
        .edition-name {
            color: #475569;
        }
        .edition-qty {
            font-weight: 700;
            color: #6366f1;
            background: #eef2ff;
            padding: 0 10px;
            border-radius: 999px;
            font-size: ${fontSizePx}px;
            line-height: 1.8;
        }
        .book-title-inline {
            display: inline;
        }
        .edition-tag {
            font-weight: 600;
            color: #6366f1;
        }
        .edition-qty-inline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 1.8em;
            padding: 0 8px;
            border-radius: 999px;
            background: #eef2ff;
            color: #6366f1;
            font-weight: 700;
            font-size: ${fontSizePx}px;
            line-height: 1.6;
            vertical-align: middle;
            margin-left: 4px;
        }
        @media print {
            @page { margin: 12mm; size: A4; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="page-header">
        <h1>Store Inventory Report</h1>
        <div class="date-row">
            <span class="date-badge"><span class="label">GC</span> ${escapeHtml(gcDateStr)}</span>
            <span class="date-badge"><span class="label">ወ/ር</span> <span class="amharic">${escapeHtml(ethDateStr)}</span></span>
        </div>
    </div>
    ${bodyHtml}
    <script>
        window.onload = function() { setTimeout(function() { window.print(); }, 500); };
    <\/script>
</body>
</html>`;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <Printer className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                                Print Content
                            </DialogTitle>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                Select up to 2 stores to compare
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-1">
                    <div>
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-1.5">
                            Stores (max 2)
                        </label>
                        {storeLoading ? (
                            <div className="flex items-center justify-center py-3">
                                <Loader2 className="size-4 animate-spin text-primarycolor/30" />
                            </div>
                        ) : (
                            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                                {stores.map(store => {
                                    const selected = selectedStoreIds.includes(store.id);
                                    const disabled = !selected && selectedStoreIds.length >= 2;
                                    return (
                                        <label
                                            key={store.id}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all",
                                                selected
                                                    ? "border-primarycolor bg-primarycolor/5"
                                                    : disabled
                                                        ? "border-slate-100 opacity-40 cursor-not-allowed"
                                                        : "border-slate-100 hover:border-primarycolor/30"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                disabled={disabled}
                                                onChange={() => toggleStore(store.id)}
                                                className="size-3.5 accent-primarycolor"
                                            />
                                            <Store className={cn("size-3.5 shrink-0", selected ? "text-primarycolor" : "text-slate-300")} />
                                            <span className={cn("font-bold text-xs", selected ? "text-primarycolor" : "text-foreground")}>
                                                {store.name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-1.5">
                            Font Size
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {FONT_SIZE_OPTIONS.map(({ key, label }) => (
                                <Button
                                    key={key}
                                    variant={fontSize === key ? "default" : "outline"}
                                    onClick={() => setFontSize(key)}
                                    className={cn(
                                        "h-7 text-[9px] font-black uppercase tracking-widest rounded-lg",
                                        fontSize === key
                                            ? "bg-primarycolor text-white"
                                            : "border border-slate-100 text-muted-foreground hover:border-primarycolor/30"
                                    )}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors">
                        <div>
                            <span className="font-black text-[10px] text-foreground">Edition Limit</span>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Single edition shown inline</p>
                        </div>
                        <div className={cn(
                            "relative w-9 h-5 rounded-full transition-colors",
                            editionLimit ? "bg-primarycolor" : "bg-slate-200"
                        )}>
                            <input
                                type="checkbox"
                                checked={editionLimit}
                                onChange={(e) => setEditionLimit(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={cn(
                                "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform",
                                editionLimit && "translate-x-4"
                            )} />
                        </div>
                    </label>

                    {selectedStoreIds.length === 2 && (
                        <>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={showBoth}
                                        onChange={(e) => setShowBoth(e.target.checked)}
                                        className="size-3.5 accent-primarycolor"
                                    />
                                    <span className="font-black text-[10px] text-foreground">Books in Both Stores</span>
                                </label>
                                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={showExclusive}
                                        onChange={(e) => setShowExclusive(e.target.checked)}
                                        className="size-3.5 accent-primarycolor"
                                    />
                                    <span className="font-black text-[10px] text-foreground">Books in Only One Store</span>
                                </label>
                            </div>

                            <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors">
                                <div>
                                    <span className="font-black text-[10px] text-foreground">Formal Table</span>
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Excel-style layout with smaller fonts</p>
                                </div>
                                <div className={cn(
                                    "relative w-9 h-5 rounded-full transition-colors",
                                    formalTable ? "bg-primarycolor" : "bg-slate-200"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={formalTable}
                                        onChange={(e) => setFormalTable(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform",
                                        formalTable && "translate-x-4"
                                    )} />
                                </div>
                            </label>
                        </>
                    )}

                    <Button
                        onClick={handleGeneratePrint}
                        disabled={selectedStoreIds.length === 0 || generating || (selectedStoreIds.length === 2 && !showBoth && !showExclusive)}
                        className="w-full h-10 font-black text-[10px] uppercase tracking-widest bg-primarycolor shadow shadow-primarycolor/20 rounded-lg gap-1.5"
                    >
                        {generating ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Printer className="size-3.5" />
                        )}
                        {generating ? "Preparing..." : "Generate & Print"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
