'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Eye, CheckCircle2, XCircle, Clock,
  FileText, User, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const kycList = [
  { id: 1, name: 'Kavya Reddy', type: 'Agent', documents: ['PAN', 'Aadhaar', 'IRDAI License'], status: 'pending', submitted: '2024-11-22', email: 'kavya@email.com', phone: '98765XXXXX' },
  { id: 2, name: 'Ravi Teja', type: 'Agent', documents: ['PAN', 'Aadhaar'], status: 'pending', submitted: '2024-11-21', email: 'ravi@email.com', phone: '87654XXXXX' },
  { id: 3, name: 'Deepak Nair', type: 'Customer', documents: ['Aadhaar'], status: 'pending', submitted: '2024-11-20', email: 'deepak@email.com', phone: '76543XXXXX' },
  { id: 4, name: 'Meena Iyer', type: 'Customer', documents: ['PAN', 'Aadhaar'], status: 'approved', submitted: '2024-11-19', email: 'meena@email.com', phone: '65432XXXXX' },
  { id: 5, name: 'Sanjay Gupta', type: 'Customer', documents: ['PAN'], status: 'rejected', submitted: '2024-11-18', email: 'sanjay@email.com', phone: '54321XXXXX' },
];

const statusColors: Record<string, string> = {
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
};

export default function AdminKYCPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = kycList.filter((k) => {
    const matchFilter = filter === 'all' || k.status === filter;
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = { all: kycList.length, pending: kycList.filter((k) => k.status === 'pending').length, approved: kycList.filter((k) => k.status === 'approved').length, rejected: kycList.filter((k) => k.status === 'rejected').length };

  return (
    <div className="p-6 space-y-6">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUpVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">KYC Management</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Review and approve KYC submissions</p>
          </div>
        </motion.div>

        {/* Counters */}
        <motion.div variants={fadeUpVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total', value: counts.all, icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Pending', value: counts.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'Approved', value: counts.approved, icon: CheckCircle2, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
            { label: 'Rejected', value: counts.rejected, icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
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

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['User', 'Type', 'Documents', 'Status', 'Submitted', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.type === 'Agent' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.documents.map((doc) => (
                        <span key={doc} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{doc}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${statusColors[item.status]}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(item.submitted).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View Documents">
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <Button variant="primary" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>Approve</Button>
                          <Button variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>Reject</Button>
                        </>
                      )}
                    </div>
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
