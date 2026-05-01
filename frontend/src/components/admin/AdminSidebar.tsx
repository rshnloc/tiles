'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, Shield, TrendingUp,
  CreditCard, Settings, ChevronRight, ChevronLeft, LogOut,
  Bell, Award, UserCheck, Newspaper, BarChart3, Sliders, Database,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navSections = [
  {
    title: 'Main',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'Customers', href: '/admin/users', icon: Users },
      { label: 'Agents', href: '/admin/agents', icon: UserCheck },
      { label: 'KYC Approvals', href: '/admin/kyc', icon: Shield },
    ],
  },
  {
    title: 'Insurance',
    items: [
      { label: 'Policies', href: '/admin/policies', icon: FileText },
      { label: 'Claims', href: '/admin/claims', icon: Award },
      { label: 'Insurers', href: '/admin/insurers', icon: Database },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
      { label: 'Commissions', href: '/admin/commissions', icon: TrendingUp },
    ],
  },
  {
    title: 'CMS',
    items: [
      { label: 'Blog & Content', href: '/admin/cms', icon: Newspaper },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Configuration', href: '/admin/settings', icon: Sliders },
      { label: 'Settings', href: '/admin/system', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Admin Panel</span>
              <span className="text-xs text-slate-400">SunischistInsurance</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Admin info */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{user?.name || 'Admin'}</p>
              <p className="text-slate-400 text-xs">Super Admin</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="px-4 pb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
