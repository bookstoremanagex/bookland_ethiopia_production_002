"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
    Shield, 
    Save, 
    CheckCircle2, 
    Circle,
    BookOpen,
    Library,
    Store,
    ShieldAlert,
    ShoppingBag,
    Package,
    Languages,
    Printer,
    BadgeDollarSign,
    FileText,
    User,
    Loader2,
    Bell,
    Home,
    Truck,
    FileSignature,
    Receipt,
    FileCheck,
    ClipboardList,
    BarChart3,
    History,
    PenTool,
    FolderOpen,
    StickyNote,
    UserCog,
    AlertTriangle,
    Settings,
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getAllMenusWithAssignments, saveMenuAssignments } from "@/app/actions/menu-actions"
import { cn } from "@/lib/utils"

const ACCOUNT_TYPES = [
  "Operations Manager",
  "Inventory Manager",
  "Finance Officer",
  "Sales Staff",
  "Viewer",
];

const ICON_MAP: Record<string, any> = {
  Home, Notifications: Bell, Notes: StickyNote, Profile: User,
  Books: BookOpen, "Book Shelf": Library, Stores: Store,
  "Damaged Books": ShieldAlert, "Book Shop": ShoppingBag,
  "Manage Orders": ClipboardList, "Manage Payments": BadgeDollarSign,
  "Manage Checks": FileCheck, "Retail Management": ShoppingBag,
  "Activity Log": History, "Production - Books": Package,
  Translations: Languages, "Translation List": Languages,
  "Translation Work": PenTool, Printing: Printer,
  Printers: Printer, "Manage Printing": ClipboardList,
  "Document Management": FolderOpen, Contracts: FileSignature,
  "Print Agreements": FileText, "Delivery Notes": Truck,
  Invoices: Receipt, "Approval Documents": FileCheck,
  Finance: BadgeDollarSign, "Finance - Book Shop": ShoppingBag,
  "Finance - Books": BookOpen, "Finance - Shop Table": BarChart3,
  "Finance - Edition Table": Library, "Finance - Costs": FileText,
  Reports: BarChart3, "Completed Deliveries": CheckCircle2,
  "Pending Deliveries": Clock, Settings: Settings,
  Accounts: User, "Menu Management": FolderOpen,
  "Theme Customization": Settings,
  "Delivery Sample": Truck,
};

function Clock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

interface MenuNode {
  id: number;
  name: string;
  parentId: number | null;
  order: number;
  children: MenuNode[];
}

interface MenuManagementProps {
  menus: any[];
  assignments: Record<string, string[]>;
}

export default function MenuManagementClient({ menus: initialMenus, assignments: initialAssignments }: MenuManagementProps) {
  const [selectedRole, setSelectedRole] = useState(ACCOUNT_TYPES[0]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>(initialAssignments);
  const [isSaving, setIsSaving] = useState(false);

  const menuTree = useMemo(() => {
    const childrenMap: Record<number, MenuNode[]> = {};
    const allNodes: MenuNode[] = initialMenus.map((m: any) => ({
      id: m.id,
      name: m.name,
      parentId: m.parentId,
      order: m.order,
      children: [],
    }));
    for (const node of allNodes) {
      if (!childrenMap[node.id]) childrenMap[node.id] = [];
      node.children = childrenMap[node.id];
    }
    const roots: MenuNode[] = [];
    for (const node of allNodes) {
      if (node.parentId === null) {
        roots.push(node);
      } else {
        if (!childrenMap[node.parentId]) childrenMap[node.parentId] = [];
        childrenMap[node.parentId].push(node);
      }
    }
    return roots.sort((a, b) => a.order - b.order);
  }, [initialMenus]);

  const currentIds = new Set(assignments[selectedRole] || []);

  const toggleMenu = async (menuId: number) => {
    const newIds = currentIds.has(String(menuId))
      ? [...(assignments[selectedRole] || [])].filter(id => id !== String(menuId))
      : [...(assignments[selectedRole] || []), String(menuId)];

    setAssignments({ ...assignments, [selectedRole]: newIds });

    const result = await saveMenuAssignments(selectedRole, newIds.map(Number));
    if (!result.success) {
      setAssignments({ ...assignments, [selectedRole]: [...currentIds] });
      toast.error("Failed to update menu");
    }
  };

  const enabledCount = (group: MenuNode) => {
    const all = [group, ...group.children];
    return all.filter(n => currentIds.has(String(n.id))).length;
  };

  const totalCount = (group: MenuNode) => 1 + group.children.length;

  const getIcon = (name: string) => ICON_MAP[name] || FolderOpen;

  if (!initialMenus.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primarycolor" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Role Selection */}
        <div className="lg:w-64 shrink-0 space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Account Types</h3>
          <div className="space-y-2">
            {ACCOUNT_TYPES.map((role) => {
              const enabled = (assignments[role] || []).length;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border-2",
                    selectedRole === role
                      ? "bg-primarycolor text-white border-primarycolor shadow-lg shadow-primarycolor/20"
                      : "bg-white text-primarycolor/60 border-primarycolor/5 hover:border-primarycolor/20 hover:bg-primarycolor/5"
                  )}
                >
                  <span className="text-xs font-black uppercase tracking-tight text-left">{role}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    selectedRole === role ? "bg-white/20 text-white" : "bg-primarycolor/10 text-primarycolor"
                  )}>
                    {enabled}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Toggles */}
        <div className="flex-1 min-w-0 space-y-6">
          <Card className="p-6 sm:p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-primarycolor">
                  <span className="text-secondarycolor">{selectedRole}</span>
                </h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Toggle menus to show in this dashboard
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {menuTree.map((parent) => (
                <div key={parent.id} className="bg-gray-50/50 rounded-2xl p-4 sm:p-5 border border-gray-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "size-8 rounded-xl flex items-center justify-center",
                        currentIds.has(String(parent.id)) ? "bg-primarycolor text-white" : "bg-gray-200 text-gray-400"
                      )}>
                        {React.createElement(getIcon(parent.name), { className: "size-4" })}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{parent.name}</h3>
                        <p className="text-[10px] text-gray-500 font-medium">{enabledCount(parent)} of {totalCount(parent)} enabled</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMenu(parent.id)}
                      className={cn(
                        "relative inline-flex h-6 w-10 items-center rounded-full transition-colors flex-shrink-0",
                        currentIds.has(String(parent.id)) ? "bg-primarycolor" : "bg-gray-200"
                      )}
                    >
                      <span className={cn(
                        "inline-block size-4 rounded-full bg-white shadow-md border transition-transform",
                        currentIds.has(String(parent.id)) ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>

                  {parent.children.length > 0 && (
                    <div className="space-y-1.5 pl-3 border-l-2 border-gray-200 ml-3.5">
                      {parent.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "size-6 rounded-lg flex items-center justify-center",
                              currentIds.has(String(child.id)) ? "bg-primarycolor/10 text-primarycolor" : "bg-gray-100 text-gray-300"
                            )}>
                              {React.createElement(getIcon(child.name), { className: "size-3" })}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{child.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleMenu(child.id)}
                            className={cn(
                              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                              currentIds.has(String(child.id)) ? "bg-primarycolor" : "bg-gray-200"
                            )}
                          >
                            <span className={cn(
                              "inline-block size-3.5 rounded-full bg-white shadow-sm border transition-transform",
                              currentIds.has(String(child.id)) ? "translate-x-4.5" : "translate-x-0.5"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
