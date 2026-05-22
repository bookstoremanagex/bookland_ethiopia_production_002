"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Mail, Shield, Activity, X, Edit2, Lock, Key, RefreshCcw, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateAccountAction, deleteAccountAction, resetPasswordAction, toggleRoleAction } from './actions';
import DeleteAccountModal from '@/components/admin_dashboard_components/DeleteAccountModal';

interface RoleData {
  id: number;
  role_name: string;
  role_status: boolean;
}

interface AccountData {
  id: number;
  name: string;
  account_email: string;
  account_type: string;
  account_status: boolean;
  roles?: RoleData[];
}

const AVAILABLE_ROLES = [
  { id: "adding_book_store", label: "Adding Book Store" },
  { id: "adding_edition", label: "Adding Edition to Book Shop" },
  { id: "adding_stores", label: "Adding Stock to Stores" },
  { id: "adding_damaged_books", label: "Adding Damaged Books" },
  { id: "adding_checks", label: "Adding Checks" },
];

export default function AccountDetailClient({ account }: { account: AccountData }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [roles, setRoles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const r of AVAILABLE_ROLES) {
      const existing = account.roles?.find((role) => role.role_name === r.id);
      initial[r.id] = existing?.role_status ?? false;
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
      toast.success(`${AVAILABLE_ROLES.find((r) => r.id === roleId)?.label} ${newValue ? "enabled" : "disabled"}`);
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
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
        <div className="p-6 sm:p-12 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <Shield className="size-6 text-primarycolor" />
              Roles &amp; Permissions
            </h2>
            <p className="text-sm text-gray-500 font-medium">Manage granular permissions for this account.</p>
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-4">
            {AVAILABLE_ROLES.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 sm:p-6 rounded-2xl border-2 border-gray-100 hover:border-primarycolor/20 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-800">{role.label}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {roles[role.id] ? "Permission granted" : "Permission denied"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleRole(role.id)}
                  disabled={togglingRole === role.id}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primarycolor/20 ${
                    roles[role.id] ? "bg-primarycolor" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block size-5 rounded-full bg-white shadow-md border transition-transform ${
                      roles[role.id] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
