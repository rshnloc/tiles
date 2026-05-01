'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText, Shield, Bell, Clock, TrendingUp, Download, Eye,
  Plus, AlertTriangle, CheckCircle2, XCircle, ChevronRight,
  Car, Bike, Heart, Activity, RefreshCw, MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';
import type { Policy, Claim } from '@/types';

// Mock data
const mockPolicies: Policy[] = [
  {
    id: 1, policy_number: 'TIL-CAR-2024-001234', user_id: 1,
    plan: { id: 1, insurer: { id: 1, name: 'HDFC Ergo', logo: '🏦', claim_ratio: 98.4, rating: 4.5, description: '' }, category: 'car', name: 'Smart Protect', premium: 8499, sum_insured: 500000, coverage: [], exclusions: [], add_ons: [], claim_ratio: 98.4, features: [], is_popular: true },
    category: 'car', status: 'active', premium: 8499, sum_insured: 500000,
    start_date: '2024-01-15', end_date: '2025-01-14', vehicle_number: 'MH02AB1234',
    created_at: '2024-01-15',
  },
  {
    id: 2, policy_number: 'TIL-HLT-2024-005678', user_id: 1,
    plan: { id: 2, insurer: { id: 2, name: 'Star Health', logo: '⭐', claim_ratio: 97, rating: 4.3, description: '' }, category: 'health', name: 'Family Floater', premium: 18999, sum_insured: 1000000, coverage: [], exclusions: [], add_ons: [], claim_ratio: 97, features: [], is_popular: false },
    category: 'health', status: 'active', premium: 18999, sum_insured: 1000000,
    start_date: '2024-03-01', end_date: '2025-02-28',
    created_at: '2024-03-01',
  },
];

const mockClaims: Claim[] = [
  {
    id: 1, claim_number: 'CLM-2024-001', policy_id: 1, user_id: 1,
    type: 'Own Damage', status: 'under_review',
    amount_claimed: 45000, description: 'Rear bumper damage in parking', documents: [], timeline: [],
    created_at: '2024-11-20', updated_at: '2024-11-22',
  },
];

const categoryIcon: Record<string, typeof Car> = {
  car: Car, bike: Bike, health: Heart, life: Activity,
};

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  active: { color: 'badge-success', icon: CheckCircle2, label: 'Active' },
  expired: { color: 'badge-danger', icon: XCircle, label: 'Expired' },
  pending: { color: 'badge-warning', icon: Clock, label: 'Pending' },
  cancelled: { color: 'badge-danger', icon: XCircle, label: 'Cancelled' },
  submitted: { color: 'badge-info', icon: FileText, label: 'Submitted' },
  under_review: { color: 'badge-warning', icon: Clock, label: 'Under Review' },
  approved: { color: 'badge-success', icon: CheckCircle2, label: 'Approved' },
  rejected: { color: 'badge-danger', icon: XCircle, label: 'Rejected' },
  paid: { color: 'badge-success', icon: CheckCircle2, label: 'Paid' },
};

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'claims' | 'renewals'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'policies', label: 'My Policies', icon: FileText },
    { id: 'claims', label: 'Claims', icon: Shield },
    { id: 'renewals', label: 'Renewals', icon: RefreshCw },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white">
                Good morning, {user?.name?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your insurance portfolio from one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/insurance">
                <Button variant="gradient" size="md" icon={<Plus className="w-4 h-4" />}>
                  Buy Insurance
                </Button>
              </Link>
              <Link href="/claims/new">
                <Button variant="outline" size="md" icon={<Shield className="w-4 h-4" />}>
                  File Claim
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { title: 'Active Policies', value: 2, icon: <FileText className="w-5 h-5" />, color: 'blue' as const },
            { title: 'Total Claims', value: 1, icon: <Shield className="w-5 h-5" />, color: 'purple' as const },
            { title: 'Upcoming Renewals', value: 1, icon: <Clock className="w-5 h-5" />, color: 'orange' as const },
            { title: 'Premium Paid (FY)', value: '₹27.5K', icon: <TrendingUp className="w-5 h-5" />, color: 'green' as const },
          ].map((stat, i) => (
            <motion.div key={stat.title} variants={fadeUpVariants} custom={i}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 rounded-2xl p-1.5 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Policy Cards */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-bold text-gray-900 dark:text-white">Your Policies</h2>
                {mockPolicies.map((policy) => {
                  const Icon = categoryIcon[policy.category] || Car;
                  const statusCfg = statusConfig[policy.status];
                  const daysLeft = Math.ceil((new Date(policy.end_date).getTime() - Date.now()) / (1000 * 86400));

                  return (
                    <motion.div
                      key={policy.id}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-card-hover transition-all duration-300"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white">{policy.plan.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{policy.plan.insurer.name} · {policy.policy_number}</p>
                            </div>
                            <span className={`badge ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-4">
                            <div>
                              <p className="text-xs text-gray-400">Premium</p>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">₹{policy.premium.toLocaleString('en-IN')}/yr</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Sum Insured</p>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                ₹{(policy.sum_insured / 100000).toFixed(1)}L
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Expires In</p>
                              <p className={`font-semibold text-sm ${daysLeft < 30 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                {daysLeft} days
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Download</Button>
                            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>View</Button>
                            {daysLeft < 60 && (
                              <Button variant="primary" size="sm" icon={<RefreshCw className="w-4 h-4" />}>Renew</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right sidebar */}
              <div className="space-y-5">
                {/* Upcoming Renewals */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" /> Upcoming Renewals
                  </h3>
                  <div className="space-y-3">
                    {mockPolicies.map((p) => (
                      <div key={p.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{p.category.toUpperCase()} Insurance</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.end_date).toLocaleDateString('en-IN')}</p>
                        </div>
                        <Button variant="primary" size="sm">Renew</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'File a Claim', icon: Shield, href: '/claims/new', color: 'text-red-500' },
                      { label: 'Book Advisor Call', icon: MessageCircle, href: '/advisors/book', color: 'text-blue-500' },
                      { label: 'Download All Policies', icon: Download, href: '/policies/download', color: 'text-green-500' },
                      { label: 'Update Family Members', icon: Heart, href: '/profile/family', color: 'text-pink-500' },
                    ].map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {action.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              {mockPolicies.map((policy) => {
                const Icon = categoryIcon[policy.category] || Car;
                const statusCfg = statusConfig[policy.status];
                return (
                  <div key={policy.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 dark:text-white">{policy.plan.insurer.name} — {policy.plan.name}</h3>
                          <span className={`badge ${statusCfg.color}`}>{statusCfg.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{policy.policy_number}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>PDF</Button>
                        <Button variant="primary" size="sm" icon={<Eye className="w-4 h-4" />}>Details</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Start Date</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{new Date(policy.start_date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">End Date</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{new Date(policy.end_date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Annual Premium</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">₹{policy.premium.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Sum Insured</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">₹{(policy.sum_insured / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 dark:text-white">My Claims</h2>
                <Link href="/claims/new">
                  <Button variant="gradient" size="sm" icon={<Plus className="w-4 h-4" />}>Raise New Claim</Button>
                </Link>
              </div>

              {mockClaims.map((claim) => {
                const statusCfg = statusConfig[claim.status];
                return (
                  <div key={claim.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 dark:text-white">Claim #{claim.claim_number}</h3>
                          <span className={`badge ${statusCfg.color}`}>{statusCfg.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{claim.type} · Claimed ₹{claim.amount_claimed.toLocaleString('en-IN')}</p>
                      </div>
                      <Button variant="primary" size="sm" icon={<Eye className="w-4 h-4" />}>Track Claim</Button>
                    </div>

                    {/* Timeline */}
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                        {['Submitted', 'Under Review', 'Approved', 'Paid'].map((stage, i) => (
                          <div key={stage} className="flex items-center gap-3 shrink-0">
                            <div className={`flex flex-col items-center ${i <= 1 ? 'opacity-100' : 'opacity-40'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                {i < 1 ? '✓' : i + 1}
                              </div>
                              <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">{stage}</span>
                            </div>
                            {i < 3 && <div className={`h-0.5 w-8 sm:w-16 ${i < 1 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'} mb-4`} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Renewals Tab */}
          {activeTab === 'renewals' && (
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-800 dark:text-orange-300 text-sm">Renewals Due Soon</p>
                  <p className="text-orange-700 dark:text-orange-400 text-xs mt-1">
                    You have 2 policies expiring in the next 60 days. Renew now to avoid coverage gaps.
                  </p>
                </div>
              </div>
              {mockPolicies.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{p.category.toUpperCase()} Insurance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {p.plan.insurer.name} · Expires {new Date(p.end_date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">₹{p.premium.toLocaleString('en-IN')}/yr</p>
                    <Button variant="gradient" size="sm" className="mt-2" icon={<RefreshCw className="w-4 h-4" />}>Renew Now</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
