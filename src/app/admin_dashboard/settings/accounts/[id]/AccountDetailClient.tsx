"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Mail, Shield, Activity, X, Edit2, Lock, Key, RefreshCcw, ToggleLeft, ToggleRight, BookOpen, Store, FileText, Printer, Receipt, Truck, FileSignature, StickyNote, UserCog, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateAccountAction, deleteAccountAction, resetPasswordAction, toggleRoleAction } from './actions';
import DeleteAccountModal from '@/components/admin_dashboard_components/DeleteAccountModal';

interface RoleData {
  id: number;
  role_status: boolean;
  roletypeId: number;
}

interface RoleTypeData {
  id: number;
  rolename: string;
  role_detail: string | null;
}

interface AccountData {
  id: number;
  name: string;
  account_email: string;
  account_type: string;
  account_status: boolean;
  roles?: RoleData[];
}

const PERMISSION_GROUPS = [
  {
    group: "Books",
    icon: BookOpen,
    roles: [
      { id: "Viewing Books", label: "View Books" },
      { id: "Editing Books", label: "Edit Books" },
      { id: "Adding Books", label: "Add Books" },
      { id: "Deleting Books", label: "Delete Books" },
    ],
  },
  {
    group: "Stores",
    icon: Store,
    roles: [
      { id: "Adding Stores", label: "Add Stores" },
      { id: "Viewing Stores", label: "View Stores" },
      { id: "Editing Stores", label: "Edit Stores" },
      { id: "Deleting Stores", label: "Delete Stores" },
    ],
  },
  {
    group: "Damaged Books",
    icon: AlertTriangle,
    roles: [
      { id: "Add DamagedBooks", label: "Add Damaged Books" },
      { id: "Delete DamagedBooks", label: "Delete Damaged Books" },
      { id: "Edit DamagedBooks", label: "Edit Damaged Books" },
      { id: "View DamagedBooks", label: "View Damaged Books" },
    ],
  },
  {
    group: "Book Shops",
    icon: Store,
    roles: [
      { id: "Adding BookShop", label: "Add Book Shop" },
      { id: "Viewing BookShops", label: "View Book Shops" },
      { id: "Editing BookShops", label: "Edit Book Shops" },
      { id: "Deleting BookShops", label: "Delete Book Shops" },
    ],
  },
  {
    group: "Finance",
    icon: Receipt,
    roles: [
      { id: "Record Payment", label: "Record Payment" },
      { id: "Create Check", label: "Create Check" },
    ],
  },
  {
    group: "Printers",
    icon: Printer,
    roles: [
      { id: "Register Printer", label: "Register Printer" },
      { id: "Edit Printers", label: "Edit Printers" },
      { id: "Delete Printer", label: "Delete Printer" },
    ],
  },
  {
    group: "Contract Documents",
    icon: FileText,
    roles: [
      { id: "Viewing Contract Documents", label: "View Contract Documents" },
      { id: "Editing Contract Documents", label: "Edit Contract Documents" },
      { id: "Creating Contract Documents", label: "Create Contract Documents" },
      { id: "Deleting Contract Documents", label: "Delete Contract Documents" },
    ],
  },
  {
    group: "Print Agreements",
    icon: FileSignature,
    roles: [
      { id: "Viewing Print Agreements", label: "View Print Agreements" },
      { id: "Editing Print Agreements", label: "Edit Print Agreements" },
      { id: "Creating Print Agreements", label: "Create Print Agreements" },
      { id: "Deleting Print Agreements", label: "Delete Print Agreements" },
    ],
  },
  {
    group: "Delivery Notes",
    icon: Truck,
    roles: [
      { id: "Creating Delivery Notes", label: "Create Delivery Notes" },
      { id: "Editing Delivery Notes", label: "Edit Delivery Notes" },
      { id: "Viewing Delivery Notes", label: "View Delivery Notes" },
      { id: "Deleting Delivery Notes", label: "Delete Delivery Notes" },
    ],
  },
  {
    group: "Invoice Document",
    icon: FileText,
    roles: [
      { id: "Creating Invoice Document", label: "Create Invoice" },
      { id: "Viewing Invoice Document", label: "View Invoice" },
      { id: "Editing Invoice Document", label: "Edit Invoice" },
      { id: "Deleting Invoice Document", label: "Delete Invoice" },
    ],
  },
  {
    group: "Approval Document",
    icon: FileSignature,
    roles: [
      { id: "Creating Approval Document", label: "Create Approval" },
      { id: "Editing Approval Document", label: "Edit Approval" },
      { id: "Viewing Approval Document", label: "View Approval" },
      { id: "Deleting Approval Document", label: "Delete Approval" },
    ],
  },
  {
    group: "Notes",
    icon: StickyNote,
    roles: [
      { id: "Creating Notes", label: "Create Notes" },
      { id: "Viewing Notes", label: "View Notes" },
      { id: "Updating Notes", label: "Update Notes" },
      { id: "Deleting Notes", label: "Delete Notes" },
    ],
  },
  {
    group: "Account",
    icon: UserCog,
    roles: [
      { id: "Editing Profile", label: "Edit Profile" },
      { id: "Editing Password", label: "Edit Password" },
    ],
  },
];

function getAllPermissionIds(): string[] {
  const ids: string[] = [];
  for (const g of PERMISSION_GROUPS) {
    for (const r of g.roles) {
      ids.push(r.id);
    }
  }
  return ids;
}

function findPermissionLabel(id: string): string {
  for (const g of PERMISSION_GROUPS) {
    const found = g.roles.find((r) => r.id === id);
    if (found) return found.label;
  }
  return id;
}

export default function AccountDetailClient({ account, roletypes }: { account: AccountData; roletypes: RoleTypeData[] }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const roletypeMap = new Map(roletypes.map((rt) => [rt.id, rt.rolename]));
  const accountRoleMap = new Map(
    (account.roles ?? []).map((r) => [r.roletypeId, r.role_status])
  );

  const [roles, setRoles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const [rtId, rolename] of roletypeMap) {
      initial[rolename] = accountRoleMap.get(rtId) ?? false;
    }
    return initial;
  });
  const [togglingRole, setTogglingRole] = useState<string | null>(null);

  const handleToggleRole = async (roleId: string) => {
    const newValue = !roles[roleId];
    setTogglingRole(roleId);
    setRoles((prev) => ({ ...prev, [roleId]: newValue }));
    const res = await toggleRoleAction(account.id, roleId, newValue);
    setTogglingRole(null);
    if (res.success) {
      toast.success(`${findPermissionLabel(roleId)} ${newValue ? "enabled" : "disabled"}`);
    } else {
      setRoles((prev) => ({ ...prev, [roleId]: !newValue }));
      toast.error(res.error || "Failed to update role");
    }
  };
  
  const [formData, setFormData] = useState({
    name: account.name,
    email: account.account_email,
    type: account.account_type,
    status: account.account_status,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateAccountAction(account.id, formData);
    setIsSaving(false);
    
    if (result.success) {
      toast.success("Account updated successfully!");
      setIsEditing(false);
      router.refresh(); // Refresh to reflect new data from server component
    } else {
      toast.error(result.error || "Failed to update account.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsResetting(true);
    const result = await resetPasswordAction(account.id, newPassword);
    setIsResetting(false);

    if (result.success) {
      toast.success("Password reset successfully!");
      setNewPassword("");
      setShowResetForm(false);
    } else {
      toast.error(result.error || "Failed to reset password.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="px-4 py-6 sm:p-8 mx-auto w-full min-w-0 max-w-5xl overflow-hidden sm:overflow-visible space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link 
            href="/admin_dashboard/settings/accounts" 
            className="inline-flex items-center text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors mb-2"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Accounts
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight">Account Details</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">View or edit account information.</p>
        </div>
        
        {!isEditing && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto gap-2 bg-primarycolor hover:bg-primarycolor/90 text-white rounded-xl font-bold shadow-lg shadow-primarycolor/20 h-10"
            >
              <Edit2 className="size-4" />
              Edit Account
            </Button>
            <DeleteAccountModal 
              accountId={account.id} 
              accountName={account.name}
              onDelete={async (id) => {
                const res = await deleteAccountAction(id);
                if (res.success) {
                  toast.success("Account deleted!");
                  router.push("/admin_dashboard/settings/accounts");
                  return true;
                }
                toast.error(res.error || "Error deleting.");
                return false;
              }}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
        {isEditing ? (
          <form onSubmit={handleSave} className="p-6 sm:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                  />
                </div>
              </div>

              {/* Account Type Field */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">Account Role</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors z-10 pointer-events-none" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-gray-800 font-medium appearance-none outline-none focus:ring-2 focus:ring-primarycolor/20 text-base"
                  >
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Finance Officer">Finance Officer</option>
                    <option value="Sales Staff">Sales Staff</option>
                    <option value="Retail Manager">Retail Manager</option>
                    <option value="Delivery and Sales Management">Delivery and Sales Management</option>
                    <option value="Delivery Sample">Delivery Sample</option>
                    <option value="Printer">Printer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              {/* Status Field */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">Account Status</label>
                <div className="relative flex items-center h-14 px-4 bg-gray-50 rounded-2xl border-transparent focus-within:border-primarycolor focus-within:bg-white transition-all shadow-sm">
                  <Activity className="size-5 text-gray-400 mr-3" />
                  <label className="flex items-center gap-3 cursor-pointer text-gray-800 font-medium w-full h-full">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                      className="w-5 h-5 text-primarycolor rounded focus:ring-primarycolor/20 cursor-pointer"
                    />
                    {formData.status ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFormData({
                    name: account.name,
                    email: account.account_email,
                    type: account.account_type,
                    status: account.account_status,
                  });
                  setIsEditing(false);
                }}
                className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-black bg-primarycolor hover:bg-primarycolor/90 text-white shadow-lg shadow-primarycolor/30 transition-all gap-2"
              >
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 sm:p-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <User className="size-4" /> Name
                </div>
                <div className="text-xl font-black text-gray-900">{account.name}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <Mail className="size-4" /> Email Address
                </div>
                <div className="text-xl font-black text-gray-900">{account.account_email}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <Shield className="size-4" /> Account Role
                </div>
                <div className="text-lg font-bold text-primarycolor inline-flex items-center px-4 py-1.5 rounded-xl bg-primarycolor/10 border border-primarycolor/20 mt-1">
                  {account.account_type}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <Activity className="size-4" /> Status
                </div>
                <div className="mt-1">
                  {account.account_status ? (
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-black tracking-widest uppercase bg-green-100 text-green-700 border border-green-200">
                      <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-black tracking-widest uppercase bg-red-100 text-red-700 border border-red-200">
                      <span className="size-2 rounded-full bg-red-500"></span>
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Roles & Permissions Section */}
      {account.account_type !== "ADMIN" && account.account_type !== "Printer" && account.account_type !== "Delivery Account" && (
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
        <div className="p-6 sm:p-12 space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <Shield className="size-6 text-primarycolor" />
              Roles &amp; Permissions
            </h2>
            <p className="text-sm text-gray-500 font-medium">Manage granular permissions for this account.</p>
          </div>
          <div className="space-y-8">
            {PERMISSION_GROUPS.map((group) => {
              const GroupIcon = group.icon;
              const enabledCount = group.roles.filter((r) => roles[r.id]).length;
              return (
                <div key={group.group} className="bg-gray-50/50 rounded-2xl p-5 sm:p-6 border border-gray-200/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                        <GroupIcon className="size-5 text-primarycolor" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-800 text-lg">{group.group}</h3>
                        <p className="text-xs text-gray-500 font-medium">{enabledCount} of {group.roles.length} enabled</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {group.roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-100 hover:border-primarycolor/20 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm text-gray-800">{role.label}</p>
                          <p className="text-xs text-gray-400 font-medium">
                            {roles[role.id] ? "Permission granted" : "Permission denied"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleRole(role.id)}
                          disabled={togglingRole === role.id}
                          className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primarycolor/20 flex-shrink-0 ${
                            roles[role.id] ? "bg-primarycolor" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block size-4 rounded-full bg-white shadow-md border transition-transform ${
                              roles[role.id] ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Security Section */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
        <div className="p-6 sm:p-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <Lock className="size-6 text-primarycolor" />
                Security Settings
              </h2>
              <p className="text-sm text-gray-500 font-medium">Manage password and account security.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            {!showResetForm ? (
              <Button 
                onClick={() => setShowResetForm(true)}
                variant="outline"
                className="gap-2 rounded-xl font-bold border-primarycolor/20 text-primarycolor hover:bg-primarycolor/5"
              >
                <Key className="size-4" />
                Reset Account Password
              </Button>
            ) : (
              <div className="space-y-4 max-w-md animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input 
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="gap-2 bg-primarycolor hover:bg-primarycolor/90 text-white rounded-xl font-bold h-12 px-6 shadow-lg shadow-primarycolor/20"
                  >
                    {isResetting ? (
                      <RefreshCcw className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Update Password
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowResetForm(false);
                      setNewPassword("");
                    }}
                    variant="ghost"
                    className="rounded-xl font-bold h-12 px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
