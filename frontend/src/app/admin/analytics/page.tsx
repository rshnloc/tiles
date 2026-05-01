'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, FileText, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const monthlyGrowth = [
  { month: 'Jan', users: 3200, policies: 120, revenue: 980000, agents: 85 },
  { month: 'Feb', users: 3800, policies: 145, revenue: 1120000, agents: 92 },
  { month: 'Mar', users: 4100, policies: 162, revenue: 1280000, agents: 98 },
  { month: 'Apr', users: 4600, policies: 140, revenue: 1090000, agents: 104 },
  { month: 'May', users: 5200, policies: 189, revenue: 1480000, agents: 112 },
  { month: 'Jun', users: 6100, policies: 210, revenue: 1650000, agents: 120 },
  { month: 'Jul', users: 6800, policies: 198, revenue: 1560000, agents: 128 },
  { month: 'Aug', users: 7600, policies: 235, revenue: 1840000, agents: 138 },
  { month: 'Sep', users: 8400, policies: 251, revenue: 1980000, agents: 145 },
  { month: 'Oct', users: 9200, policies: 278, revenue: 2190000, agents: 155 },
  { month: 'Nov', users: 10100, policies: 302, revenue: 2380000, agents: 165 },
  { month: 'Dec', users: 11200, policies: 340, revenue: 2680000, agents: 178 },
];

const categoryBreakdown = [
  { name: 'Car', policies: 4821, revenue: 12400000, claims: 245 },
  { name: 'Health', policies: 3640, revenue: 18200000, claims: 312 },
  { name: 'Life', policies: 2150, revenue: 24800000, claims: 89 },
  { name: 'Bike', policies: 1890, revenue: 4100000, claims: 178 },
];

const topStates = [
  { state: 'Maharashtra', policies: 2840 },
  { state: 'Karnataka', policies: 2210 },
  { state: 'Tamil Nadu', policies: 1980 },
  { state: 'Delhi NCR', policies: 1750 },
  { state: 'Telangana', policies: 1420 },
];

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316'];

export default function AdminAnalyticsPage() {
  const totalRevenue = monthlyGrowth.reduce((a, b) => a + b.revenue, 0);
  const totalPolicies = monthlyGrowth.reduce((a, b) => a + b.policies, 0);

  return (
    <div className="p-6 space-y-6">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUpVariants}>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Platform performance and growth metrics</p>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (YTD)', value: `₹${(totalRevenue / 10000000).toFixed(1)}Cr`, change: 19.3, up: true },
          { label: 'Total Policies (YTD)', value: totalPolicies.toLocaleString('en-IN'), change: 24.6, up: true },
          { label: 'Avg Policy Value', value: `₹${(totalRevenue / totalPolicies / 1000).toFixed(1)}K`, change: -2.1, up: false },
          { label: 'Claim Settlement', value: '92.4%', change: 3.8, up: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
              {kpi.up ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              {kpi.change}% vs last year
            </div>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Revenue & User Growth (2024)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2.5} />
            <Area yAxisId="right" type="monotone" dataKey="users" name="Users" stroke="#22c55e" fill="url(#userGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown + Top States */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryBreakdown} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="policies" name="Policies" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="claims" name="Claims" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top States */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">Top States by Policies</h3>
          <div className="space-y-3">
            {topStates.map((state, i) => {
              const maxVal = topStates[0].policies;
              const pct = (state.policies / maxVal) * 100;
              return (
                <div key={state.state}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{state.state}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{state.policies.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
