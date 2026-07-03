"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  User,
  Mail,
  Lock,
  Plus,
  Trash2,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRetailUser, deleteRetailUser } from "@/app/actions/retail-user-actions";
import { toast } from "sonner";
import Link from "next/link";

interface RetailUser {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
}

export function RetailShopAccountsClient({
  initialUsers,
}: {
  initialUsers: RetailUser[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState<RetailUser[]>(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await createRetailUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (res.success) {
        toast.success("Retail user created successfully");
        setUsers((prev) => [
          {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            created_at: res.data.created_at,
          },
          ...prev,
        ]);
        setFormData({ name: "", email: "", password: "" });
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to create user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this retail user?")) return;
    try {
      const res = await deleteRetailUser(userId);
      if (res.success) {
        toast.success("Retail user deleted");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="px-4 py-6 sm:p-8 mx-auto w-full min-w-0 max-w-5xl overflow-hidden sm:overflow-visible space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin_dashboard/settings/accounts"
            className="inline-flex items-center text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors mb-2"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Accounts
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Retail Shop Accounts
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Manage users who log into the retail shop database
          </p>
        </div>
      </div>

      {/* Add User Button */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="h-12 px-6 rounded-2xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/20"
        >
          <Plus className="size-4 mr-2" />
          Add Retail User
        </Button>
      )}

      {/* Add User Form */}
      {showForm && (
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                <Store className="size-5 text-primarycolor" />
              </div>
              <div>
                <h2 className="font-black text-lg text-slate-800 uppercase tracking-tight">
                  New Retail User
                </h2>
                <p className="text-xs font-semibold text-slate-400">
                  This user will log into the retail shop dashboard
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Retail Staff"
                    className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                  />
                </div>
              </div>

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
                    placeholder="e.g. retail@example.com"
                    className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 ml-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password"
                    className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="w-full sm:w-auto h-14 px-8 rounded-2xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      {users.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <Store className="size-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">No retail users yet</p>
          <p className="text-xs font-semibold text-slate-300 mt-1">
            Add a user to get started
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Created
                  </th>
                  <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primarycolor/10 flex items-center justify-center">
                          <User className="size-4 text-primarycolor" />
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {user.name ?? "Unnamed"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-500">
                      {user.email ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-primarycolor/10 text-primarycolor">
                        {user.role ?? "Retail Shop"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-400">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="size-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all inline-flex items-center justify-center"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
