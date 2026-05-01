'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Phone, Mail, MessageSquare,
  ChevronDown, ChevronRight, MoreHorizontal, User,
  Clock, CheckCircle2, XCircle, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const leads = [
  { id: 1, name: 'Rohit Mehra', phone: '9876543210', email: 'rohit@email.com', type: 'Car', status: 'new', source: 'Website', date: '2024-11-22', value: 12000 },
  { id: 2, name: 'Pooja Sharma', phone: '8765432109', email: 'pooja@email.com', type: 'Health', status: 'contacted', source: 'Referral', date: '2024-11-21', value: 18000 },
  { id: 3, name: 'Arjun Nair', phone: '7654321098', email: 'arjun@email.com', type: 'Life', status: 'quoted', source: 'Campaign', date: '2024-11-20', value: 45000 },
  { id: 4, name: 'Sneha Patel', phone: '6543210987', email: 'sneha@email.com', type: 'Bike', status: 'converted', source: 'Website', date: '2024-11-19', value: 5500 },
  { id: 5, name: 'Vikram Singh', phone: '5432109876', email: 'vikram@email.com', type: 'Car', status: 'lost', source: 'Social', date: '2024-11-18', value: 14000 },
  { id: 6, name: 'Anjali Reddy', phone: '4321098765', email: 'anjali@email.com', type: 'Health', status: 'new', source: 'Website', date: '2024-11-17', value: 22000 },
];

const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  new: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'New', icon: User },
  contacted: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Contacted', icon: Phone },
  quoted: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Quoted', icon: Clock },
  converted: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Converted', icon: CheckCircle2 },
  lost: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Lost', icon: XCircle },
};

const statuses = ['all', 'new', 'contacted', 'quoted', 'converted', 'lost'];

const kanbanColumns = ['new', 'contacted', 'quoted', 'converted'];

export default function AgentLeadsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');

  const filtered = leads.filter((l) => {
    const matchStatus = activeFilter === 'all' || l.status === activeFilter;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={staggerContainer} initial="hidden" animate="visible"
      >
        <motion.div variants={fadeUpVariants}>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your leads pipeline</p>
        </motion.div>
        <motion.div variants={fadeUpVariants} className="flex gap-2">
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(['table', 'kanban'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 text-sm capitalize font-medium transition-colors ${
                  view === v ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Lead</Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                activeFilter === s
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? `All (${leads.length})` : `${statusConfig[s]?.label} (${leads.filter((l) => l.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    {['Lead', 'Contact', 'Type', 'Status', 'Source', 'Value', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => {
                    const sc = statusConfig[lead.status];
                    return (
                      <tr key={lead.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                              {lead.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{lead.phone}</p>
                          <p className="text-gray-400 text-xs">{lead.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{lead.type}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sc.color}`}>{sc.label}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{lead.source}</td>
                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">₹{lead.value.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(lead.date).toLocaleDateString('en-IN')}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Call">
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="WhatsApp">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="More">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {kanbanColumns.map((col) => {
              const colLeads = leads.filter((l) => l.status === col);
              const sc = statusConfig[col];
              return (
                <div key={col} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                      {sc.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{colLeads.length}</span>
                  </div>
                  {colLeads.map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{lead.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{lead.type} · ₹{lead.value.toLocaleString('en-IN')}</p>
                      <div className="flex gap-1.5">
                        <button className="p-1 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"><Phone className="w-3 h-3" /></button>
                        <button className="p-1 rounded-lg text-gray-400 hover:text-green-600 transition-colors"><MessageSquare className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Add lead
                  </button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
