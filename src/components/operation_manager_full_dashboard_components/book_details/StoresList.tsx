"use client";

import React from "react";
import {
  Store,
  Building2,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

interface StoresListProps {
  book: any;
}

export default function StoresList({ book }: StoresListProps) {
  const router = useRouter();
  // Aggregate all store assignments from all editions
  const allAssignments =
    book.bookedition?.flatMap((edition: any) =>
      edition.bookeditionstores
        ?.filter((assignment: any) => assignment.stores) // Ensure stores exists
        .map((assignment: any) => ({
          ...assignment,
          editionName: edition.edition_name,
          editionId: edition.id,
        })),
    ) || [];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl space-y-6 md:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="size-14 md:size-20 rounded-2xl md:rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/5 shrink-0">
            <Store className="size-6 md:size-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-black text-primarycolor uppercase tracking-tight italic">
              Store{" "}
              <span className="text-secondarycolor not-italic">
                Distribution
              </span>
            </h2>
            <p className="text-muted-foreground font-bold tracking-tight text-xs md:text-base">
              Overview of where this book is currently stocked across all
              editions.
            </p>
          </div>
          <Button
            onClick={() => router.refresh()}
            variant="outline"
            className="h-12 w-12 p-0 rounded-xl border-2 border-primarycolor/10 hover:bg-primarycolor/5 text-primarycolor shrink-0 shadow-sm"
          >
            <RefreshCw className="size-5" />
          </Button>
        </div>

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-hidden rounded-3xl border-2 border-primarycolor/5 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primarycolor/5 border-b-2 border-primarycolor/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Retail Store
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Assigned Edition
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                  Current Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primarycolor/5">
              {allAssignments.length > 0 ? (
                allAssignments.map((assignment: any) => (
                  <tr
                    key={assignment.id}
                    className="group hover:bg-primarycolor/[0.02] transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border border-secondarycolor/20">
                          <Building2 className="size-6" />
                        </div>
                        <div>
                          <div className="font-black text-primarycolor uppercase tracking-tight">
                            {assignment.stores.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {assignment.stores.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-secondarycolor" />
                        <span className="font-bold text-primarycolor">
                          {assignment.editionName}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primarycolor/5 border border-primarycolor/10 font-black text-xs text-primarycolor">
                        <Package className="size-3" />
                        {assignment.quantity} Units
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primarycolor/5 border border-primarycolor/10 font-black text-xs text-primarycolor">
                        <Package className="size-3" />
                        {assignment.quantity} Units
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <div className="size-24 rounded-full border-4 border-dashed border-primarycolor/20 flex items-center justify-center">
                        <Store className="size-12 text-primarycolor" />
                      </div>
                      <div>
                        <p className="text-xl font-black uppercase tracking-[0.2em] text-primarycolor">
                          No Store Assignments
                        </p>
                        <p className="font-bold text-muted-foreground">
                          Navigate to an edition to assign it to retail stores.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Hidden on desktop) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {allAssignments.length > 0 ? (
            allAssignments.map((assignment: any) => (
              <div
                key={assignment.id}
                className="p-5 rounded-2xl border-2 border-primarycolor/5 bg-primarycolor/[0.01] space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border border-secondarycolor/20">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <div className="font-black text-primarycolor uppercase tracking-tight text-sm">
                        {assignment.stores.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {assignment.stores.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-primarycolor/5">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-secondarycolor" />
                    <span className="font-bold text-primarycolor text-[11px]">
                      {assignment.editionName}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primarycolor/5 border border-primarycolor/10 font-black text-[10px] text-primarycolor">
                    <Package className="size-3" />
                    {assignment.quantity} Units
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center opacity-30">
              <Store className="size-12 mx-auto text-primarycolor mb-4" />
              <p className="font-black uppercase tracking-widest text-xs text-primarycolor text-center px-6">
                No Store Assignments
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
