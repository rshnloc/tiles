'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, TrendingUp, Award,
  MessageSquare, BookOpen, Settings, Shield, ChevronRight,
  Menu, X, Bell, LogOut, Star, Target,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Dashboard', href: '/agent', icon: LayoutDashboard },
  { label: 'Leads', href: '/agent/leads', icon: Users },
  { label: 'Clients', href: '/agent/clients', icon: Shield },
  { label: 'Quotes', href: '/agent/quotes', icon: FileText },
  { label: 'Commissions', href: '/agent/commissions', icon: TrendingUp },
  { label: 'Renewals', href: '/agent/renewals', icon: Target },
  { label: 'Marketing Tools', href: '/agent/marketing', icon: Award },
  { label: 'Training', href: '/agent/training', icon: BookOpen },
  { label: 'Messages', href: '/agent/messages', icon: MessageSquare },
  { label: 'Settings', href: '/agent/settings', icon: Settings },
];

export function AgentSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`h-screen bg-gray-950 border-r border-gray-800 flex flex-col sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <Link href="/agent" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              Sunischist<span className="text-primary-400">Insurance</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Agent Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{user?.name || 'Agent'}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-400">Expert Advisor</span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!collapsed && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
