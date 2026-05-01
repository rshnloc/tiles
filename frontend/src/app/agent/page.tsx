'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, FileText, TrendingUp, Target, Clock, Plus,
  ArrowUp, ArrowDown, ChevronRight, Phone, Mail, Star,
  Circle, CheckCircle2, MoreHorizontal, Filter,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';
import type { Lead } from '@/types';

const earningsData = [
  { month: 'Jun', earnings: 12000, policies: 4 },
  { month: 'Jul', earnings: 18500, policies: 6 },
  { month: 'Aug', earnings: 15200, policies: 5 },
  { month: 'Sep', earnings: 22000, policies: 8 },
  { month: 'Oct', earnings: 19800, policies: 7 },
  { month: 'Nov', earnings: 28500, policies: 11 },
  { month: 'Dec', earnings: 31200, policies: 12 },
];

const mockLeads: Lead[] = [
  { id: 1, agent_id: 1, name: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@email.com', category: 'health', status: 'new', priority: 'high', created_at: '2024-11-20', updated_at: '2024-11-20' },
  { id: 2, agent_id: 1, name: 'Sunita Patel', phone: '9898989898', email: 'sunita@email.com', category: 'car', status: 'contacted', priority: 'medium', created_at: '2024-11-19', updated_at: '2024-11-20' },
  { id: 3, agent_id: 1, name: 'Vijay Singh', phone: '9012345678', email: 'vijay@email.com', category: 'life', status: 'quoted', priority: 'high', created_at: '2024-11-18', updated_at: '2024-11-21' },
  { id: 4, agent_id: 1, name: 'Priya Mehta', phone: '9111222333', email: 'priya@email.com', category: 'bike', status: 'converted', priority: 'low', created_at: '2024-11-15', updated_at: '2024-11-22' },
];

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  quoted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const priorityColors: Record<string, string> = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-green-500',
};

export default function AgentDashboard() {
  const [leadsFilter, setLeadsFilter] = useState<string>('all');

  const filteredLeads = leadsFilter === 'all'
    ? mockLeads
    : mockLeads.filter((l) => l.status === leadsFilter);

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
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Agent Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
        <motion.div variants={fadeUpVariants} className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>Add Lead</Button>
          <Link href="/agent/quotes/new">
            <Button variant="gradient" size="sm" icon={<FileText className="w-4 h-4" />}>Generate Quote</Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: 'Total Leads', value: 24, change: 12, icon: <Users className="w-5 h-5" />, color: 'blue' as const },
          { title: 'Converted', value: 8, change: 6, icon: <CheckCircle2 className="w-5 h-5" />, color: 'green' as const },
          { title: 'This Month Earnings', value: '₹31,200', change: 9.5, icon: <TrendingUp className="w-5 h-5" />, color: 'purple' as const },
          { title: 'Active Policies', value: 47, change: 4, icon: <FileText className="w-5 h-5" />, color: 'orange' as const },
        ].map((stat, i) => (
          <motion.div key={stat.title} variants={fadeUpVariants} custom={i}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Monthly Target */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">Monthly Target</h3>
          </div>
          <span className="text-sm font-semibold text-primary-600">78% achieved</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '78%' }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">₹31,200 / ₹40,000 target</span>
          <span className="text-gray-500">12 / 15 policies</span>
        </div>
      </motion.div>

      {/* Earnings Chart + Recent Leads */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chart */}
        <motion.div
          className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 dark:text-white">Earnings Overview</h3>
            <select className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={earningsData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Earnings']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2.5} fill="url(#earningsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Leads pipeline */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Lead Pipeline</h3>
            <Link href="/agent/leads">
              <Button variant="ghost" size="sm" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">View All</Button>
            </Link>
          </div>

          {/* Pipeline funnel */}
          <div className="space-y-3">
            {[
              { label: 'New Leads', count: 8, pct: 100, color: 'bg-blue-500' },
              { label: 'Contacted', count: 6, pct: 75, color: 'bg-yellow-500' },
              { label: 'Quoted', count: 4, pct: 50, color: 'bg-purple-500' },
              { label: 'Converted', count: 2, pct: 25, color: 'bg-green-500' },
            ].map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{stage.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{stage.count}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${stage.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Leads */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Leads</h3>
          <div className="flex gap-2">
            {['all', 'new', 'contacted', 'quoted', 'converted'].map((f) => (
              <button
                key={f}
                onClick={() => setLeadsFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  leadsFilter === f
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Lead', 'Category', 'Status', 'Priority', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="capitalize text-gray-700 dark:text-gray-300">{lead.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold capitalize ${priorityColors[lead.priority]}`}>
                      ● {lead.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Commission Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Earned (FY)', value: '₹1,82,400', sub: 'This financial year', color: 'from-blue-600 to-blue-800' },
          { label: 'Pending Commission', value: '₹12,800', sub: '3 policies pending', color: 'from-orange-500 to-orange-700' },
          { label: 'Next Payout', value: '₹28,600', sub: 'Due Dec 31, 2024', color: 'from-green-600 to-green-800' },
        ].map((item) => (
          <motion.div
            key={item.label}
            className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-white`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-white/70 text-sm mb-1">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-white/60 text-xs mt-1">{item.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
