'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, Download, Filter, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const monthlyData = [
  { month: 'Jun', earned: 14200, pending: 3200 },
  { month: 'Jul', earned: 18500, pending: 4100 },
  { month: 'Aug', earned: 16800, pending: 2800 },
  { month: 'Sep', earned: 22400, pending: 5200 },
  { month: 'Oct', earned: 19600, pending: 3800 },
  { month: 'Nov', earned: 28500, pending: 6400 },
];

const transactions = [
  { id: 'COM-001', policy: 'POL-2024-4521', customer: 'Rohit M', type: 'Car', premium: 12400, commission: 1860, rate: 15, status: 'paid', date: '2024-11-20' },
  { id: 'COM-002', policy: 'POL-2024-4498', customer: 'Pooja S', type: 'Health', premium: 24000, commission: 3600, rate: 15, status: 'paid', date: '2024-11-18' },
  { id: 'COM-003', policy: 'POL-2024-4480', customer: 'Arjun N', type: 'Life', premium: 60000, commission: 12000, rate: 20, status: 'pending', date: '2024-11-15' },
  { id: 'COM-004', policy: 'POL-2024-4455', customer: 'Sneha P', type: 'Bike', premium: 5400, commission: 540, rate: 10, status: 'paid', date: '2024-11-10' },
  { id: 'COM-005', policy: 'POL-2024-4430', customer: 'Vikram S', type: 'Car', premium: 18200, commission: 2730, rate: 15, status: 'processing', date: '2024-11-05' },
];

export default function AgentCommissionsPage() {
  const [period, setPeriod] = useState('this_month');

  return (
    <div className="p-6 space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={staggerContainer} initial="hidden" animate="visible"
      >
        <motion.div variants={fadeUpVariants}>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Commissions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Track your earnings and payouts</p>
        </motion.div>
        <motion.div variants={fadeUpVariants} className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </select>
          <Button variant="ghost" icon={<Download className="w-4 h-4" />}>Export</Button>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Total Earned', value: '₹1,20,000', change: 22.4, icon: <DollarSign className="w-5 h-5" />, color: 'green' as const },
          { title: 'This Month', value: '₹28,500', change: 45.4, icon: <TrendingUp className="w-5 h-5" />, color: 'blue' as const },
          { title: 'Pending', value: '₹6,400', change: -8.1, icon: <Clock className="w-5 h-5" />, color: 'orange' as const },
          { title: 'Avg per Policy', value: '₹2,400', change: 12.0, icon: <DollarSign className="w-5 h-5" />, color: 'purple' as const },
        ].map((stat, i) => (
          <motion.div key={stat.title} variants={fadeUpVariants} custom={i}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Next Payout Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-primary-100 text-sm">Next Payout</p>
          <p className="text-white font-bold text-2xl mt-1">₹6,400</p>
          <p className="text-primary-100 text-xs mt-1">Expected by 30 Nov 2024</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-primary-100 text-sm">
            <Calendar className="w-4 h-4" />
            3 pending transactions
          </div>
          <Button variant="ghost" size="sm" className="mt-2 text-white border-white/30 hover:bg-white/10">
            View Details
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Monthly Earnings</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
            <Legend />
            <Bar dataKey="earned" name="Earned" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['ID', 'Policy', 'Customer', 'Type', 'Premium', 'Rate', 'Commission', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{t.id}</td>
                  <td className="px-5 py-4 text-xs font-mono text-primary-600 dark:text-primary-400">{t.policy}</td>
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{t.customer}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{t.type}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">₹{t.premium.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.rate}%</td>
                  <td className="px-5 py-4 font-semibold text-green-600 dark:text-green-400">₹{t.commission.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${t.status === 'paid' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
