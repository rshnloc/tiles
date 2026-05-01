'use client';

import { motion } from 'framer-motion';
import {
  Users, FileText, Shield, TrendingUp, CheckCircle2,
  Clock, XCircle, ArrowUp, DollarSign, Activity,
  MoreHorizontal, Eye, UserCheck, AlertTriangle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const lineData = [
  { month: 'Jan', policies: 120, claims: 18, revenue: 980000 },
  { month: 'Feb', policies: 145, claims: 22, revenue: 1120000 },
  { month: 'Mar', policies: 162, claims: 19, revenue: 1280000 },
  { month: 'Apr', policies: 140, claims: 25, revenue: 1090000 },
  { month: 'May', policies: 189, claims: 28, revenue: 1480000 },
  { month: 'Jun', policies: 210, claims: 31, revenue: 1650000 },
  { month: 'Jul', policies: 198, claims: 24, revenue: 1560000 },
  { month: 'Aug', policies: 235, claims: 35, revenue: 1840000 },
  { month: 'Sep', policies: 251, claims: 29, revenue: 1980000 },
  { month: 'Oct', policies: 278, claims: 38, revenue: 2190000 },
  { month: 'Nov', policies: 302, claims: 41, revenue: 2380000 },
  { month: 'Dec', policies: 340, claims: 45, revenue: 2680000 },
];

const categoryData = [
  { name: 'Car', value: 38, color: '#3b82f6' },
  { name: 'Health', value: 29, color: '#22c55e' },
  { name: 'Life', value: 21, color: '#a855f7' },
  { name: 'Bike', value: 12, color: '#f97316' },
];

const recentUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit@email.com', phone: '98765XXXXX', type: 'Customer', kyc: 'verified', joined: '2024-11-20' },
  { id: 2, name: 'Kavya Reddy', email: 'kavya@email.com', phone: '87654XXXXX', type: 'Agent', kyc: 'pending', joined: '2024-11-19' },
  { id: 3, name: 'Sanjay Gupta', email: 'sanjay@email.com', phone: '76543XXXXX', type: 'Customer', kyc: 'rejected', joined: '2024-11-18' },
  { id: 4, name: 'Meena Iyer', email: 'meena@email.com', phone: '65432XXXXX', type: 'Customer', kyc: 'verified', joined: '2024-11-17' },
  { id: 5, name: 'Ravi Teja', email: 'ravi@email.com', phone: '54321XXXXX', type: 'Agent', kyc: 'pending', joined: '2024-11-16' },
];

const recentClaims = [
  { id: 'CLM-001', user: 'Priya K', type: 'Car', amount: 45000, status: 'under_review', date: '2024-11-22' },
  { id: 'CLM-002', user: 'Rahul M', type: 'Health', amount: 120000, status: 'approved', date: '2024-11-21' },
  { id: 'CLM-003', user: 'Anita V', type: 'Life', amount: 500000, status: 'submitted', date: '2024-11-20' },
  { id: 'CLM-004', user: 'Kiran P', type: 'Bike', amount: 15000, status: 'rejected', date: '2024-11-19' },
];

const kycQueue = [
  { id: 1, name: 'Kavya Reddy', type: 'Agent', document: 'IRDAI License', submitted: '2024-11-20' },
  { id: 2, name: 'Ravi Teja', type: 'Agent', document: 'PAN + Aadhaar', submitted: '2024-11-19' },
  { id: 3, name: 'Deepak Nair', type: 'Customer', document: 'Aadhaar', submitted: '2024-11-18' },
];

const claimStatusColors: Record<string, string> = {
  submitted: 'badge-info',
  under_review: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
  paid: 'badge-success',
};

const kycStatusColors: Record<string, string> = {
  verified: 'badge-success',
  pending: 'badge-warning',
  rejected: 'badge-danger',
};

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUpVariants}>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Platform overview & management
          </p>
        </motion.div>
        <motion.div variants={fadeUpVariants} className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All Systems Operational
          </span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: 'Total Users', value: 45230, change: 12.4, icon: <Users className="w-5 h-5" />, color: 'blue' as const },
          { title: 'Active Agents', value: 1240, change: 8.2, icon: <UserCheck className="w-5 h-5" />, color: 'green' as const },
          { title: 'Policies Issued', value: 89420, change: 15.6, icon: <FileText className="w-5 h-5" />, color: 'purple' as const },
          { title: 'Monthly Revenue', value: '₹2.68Cr', change: 19.3, icon: <TrendingUp className="w-5 h-5" />, color: 'orange' as const },
        ].map((stat, i) => (
          <motion.div key={stat.title} variants={fadeUpVariants} custom={i}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending KYC', value: 23, icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Open Claims', value: 18, icon: AlertTriangle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
          { label: 'Settled Claims (MTD)', value: 142, icon: CheckCircle2, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
          { label: 'Renewals Due', value: 387, icon: Activity, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 dark:text-white">Policies & Revenue</h3>
            <select className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="policies" name="Policies" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="claims" name="Claims" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">Policy Mix</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KYC Queue + Claims + Users */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* KYC Queue */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" /> KYC Approval Queue
              <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold">
                {kycQueue.length}
              </span>
            </h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {kycQueue.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.type} · {item.document}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>Approve</Button>
                  <Button variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Claims */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" /> Recent Claims
            </h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentClaims.map((claim) => (
              <div key={claim.id} className="p-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{claim.id}</span>
                    <span className={`badge ${claimStatusColors[claim.status]}`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {claim.user} · {claim.type} · ₹{claim.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {claim.status === 'under_review' && (
                    <>
                      <Button variant="primary" size="sm" className="text-xs px-2.5 py-1">Approve</Button>
                      <Button variant="danger" size="sm" className="text-xs px-2.5 py-1">Reject</Button>
                    </>
                  )}
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">Recently Registered Users</h3>
          <Button variant="ghost" size="sm">View All Users</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['User', 'Type', 'Phone', 'KYC Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.type === 'Agent' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {u.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-xs">{u.phone}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${kycStatusColors[u.kyc]}`}>
                      {u.kyc.charAt(0).toUpperCase() + u.kyc.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(u.joined).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
