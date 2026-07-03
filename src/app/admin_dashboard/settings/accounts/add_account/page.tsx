"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Mail, Shield, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { addAccountAction } from './actions';

export default function AddAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'Operations Manager',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await addAccountAction(formData);
      
      if (result.success) {
        toast.success("Account added successfully!");
        router.push('/admin_dashboard/settings/accounts');
      } else {
        toast.error(result.error || "Failed to create account.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Add New Account</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">Create a new system user and assign their role.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-12 space-y-8">
          
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
                  placeholder="e.g. John Doe"
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
                  placeholder="e.g. john@example.com"
                  className="pl-12 h-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-2xl transition-all shadow-sm text-base"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-2">Initial Password</label>
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
                  <option value="Printer">Printer</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Delivery Account">Delivery Account</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/admin_dashboard/settings/accounts')}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black bg-primarycolor hover:bg-primarycolor/90 text-white shadow-xl shadow-primarycolor/30 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Save className="size-5" />
                  Save Account
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
