'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Search, Calendar, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const renewals = [
  {
    id: 'POL-2024-4521',
    type: 'Car Insurance',
    insurer: 'HDFC Ergo',
    expiresOn: '2024-12-05',
    premium: 12400,
    daysLeft: 34,
    status: 'expiring_soon',
  },
  {
    id: 'POL-2024-3890',
    type: 'Health Insurance',
    insurer: 'Star Health',
    expiresOn: '2025-01-18',
    premium: 24000,
    daysLeft: 78,
    status: 'upcoming',
  },
  {
    id: 'POL-2023-2210',
    type: 'Bike Insurance',
    insurer: 'Bajaj Allianz',
    expiresOn: '2024-11-10',
    premium: 5400,
    daysLeft: -11,
    status: 'expired',
  },
];

function statusInfo(status: string, daysLeft: number) {
  if (status === 'expired') return { label: 'Expired', cls: 'badge-danger', icon: AlertTriangle };
  if (daysLeft <= 30) return { label: `${daysLeft}d left`, cls: 'badge-warning', icon: AlertTriangle };
  return { label: `${daysLeft}d left`, cls: 'badge-info', icon: Calendar };
}

export default function RenewPage() {
  const [search, setSearch] = useState('');
  const filtered = renewals.filter((r) =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="font-display font-black text-2xl text-gray-900 dark:text-white">Renew Policies</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review and renew your expiring or expired policies.</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by policy ID or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 py-2.5 text-sm w-full"
          />
        </div>

        {/* Policy Cards */}
        <div className="space-y-4">
          {filtered.map((policy, i) => {
            const info = statusInfo(policy.status, policy.daysLeft);
            const InfoIcon = info.icon;
            return (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{policy.type}</span>
                    <span className={`badge ${info.cls} flex items-center gap-1`}>
                      <InfoIcon className="w-3 h-3" />
                      {info.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {policy.id} · {policy.insurer}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Expires: {new Date(policy.expiresOn).toLocaleDateString('en-IN')} · Premium: ₹{policy.premium.toLocaleString('en-IN')}
                  </p>
                </div>
                <Link href={`/insurance/car`}>
                  <Button
                    variant={policy.status === 'expired' ? 'danger' : 'primary'}
                    size="sm"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Renew
                  </Button>
                </Link>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No policies found.</p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Looking for a new policy?{' '}
          <Link href="/insurance" className="text-primary-600 dark:text-primary-400 hover:underline">
            Browse insurance plans →
          </Link>
        </p>
      </div>
    </main>
  );
}
