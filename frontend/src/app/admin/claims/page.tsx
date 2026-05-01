'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Eye, CheckCircle2, XCircle, AlertTriangle, Shield,
  Clock, Download,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const claims = [
  { id: 'CLM-001', policy: 'POL-2024-4521', customer: 'Rohit Mehra', type: 'Car', amount: 45000, status: 'under_review', filed: '2024-11-22', description: 'Accident damage to front bumper and hood.' },
  { id: 'CLM-002', policy: 'POL-2024-4498', customer: 'Pooja Sharma', type: 'Health', amount: 120000, status: 'approved', filed: '2024-11-20', description: 'Hospitalization for dengue — 5 days.' },
  { id: 'CLM-003', policy: 'POL-2024-4480', customer: 'Arjun Nair', type: 'Life', amount: 500000, status: 'submitted', filed: '2024-11-18', description: 'Critical illness — cancer diagnosis.' },
  { id: 'CLM-004', policy: 'POL-2024-4455', customer: 'Sneha Patel', type: 'Bike', amount: 15000, status: 'rejected', filed: '2024-11-15', description: 'Theft — no FIR copy provided.' },
  { id: 'CLM-005', policy: 'POL-2024-4430', customer: 'Vikram Singh', type: 'Car', amount: 38000, status: 'paid', filed: '2024-11-10', description: 'Total loss in flood-affected area.' },
];

const statusConfig: Record<string, { label: string; badge: string }> = {
  submitted: { label: 'Submitted', badge: 'badge-info' },
  under_review: { label: 'Under Review', badge: 'badge-warning' },
  approved: { label: 'Approved', badge: 'badge-success' },
  rejected: { label: 'Rejected', badge: 'badge-danger' },
  paid: { label: 'Paid', badge: 'badge-success' },
};

const filters = ['all', 'submitted', 'under_review', 'approved', 'rejected', 'paid'];

export default function AdminClaimsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = claims.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch = c.customer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUpVariants}>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Claims Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Review and process insurance claims</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUpVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Claims', value: claims.length, icon: Shield, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Under Review', value: claims.filter((c) => c.status === 'under_review').length, icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'Approved', value: claims.filter((c) => c.status === 'approved' || c.status === 'paid').length, icon: CheckCircle2, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
            { label: 'Rejected', value: claims.filter((c) => c.status === 'rejected').length, icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
          ].map((item) => (
            <div key={item.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${item.color}`}><item.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search claims..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Claim ID', 'Customer', 'Type', 'Amount', 'Status', 'Filed', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((claim) => {
                const sc = statusConfig[claim.status];
                return (
                  <tr key={claim.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-primary-600 dark:text-primary-400">{claim.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{claim.customer}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{claim.description.substring(0, 40)}...</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{claim.type}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">₹{claim.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4"><span className={`badge ${sc.badge}`}>{sc.label}</span></td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(claim.filed).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {claim.status === 'under_review' && (
                          <>
                            <Button variant="primary" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>Approve</Button>
                            <Button variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>Reject</Button>
                          </>
                        )}
                        {(claim.status === 'approved' || claim.status === 'paid') && (
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
