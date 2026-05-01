'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const insurers = [
  {
    id: 1,
    name: 'HDFC Ergo',
    logo: '🏦',
    category: 'Car',
    premium: 8499,
    sumInsured: 500000,
    claimRatio: 98.4,
    cashlessGarages: 8500,
    rating: 4.5,
    badge: 'Best Value',
    badgeColor: 'bg-green-100 text-green-700',
    features: {
      'Zero Depreciation': true,
      'Engine Protection': true,
      'Roadside Assistance': true,
      'NCB Protect': true,
      'Consumable Cover': false,
      'Key Replacement': true,
    },
  },
  {
    id: 2,
    name: 'ICICI Lombard',
    logo: '🏛️',
    category: 'Car',
    premium: 9299,
    sumInsured: 500000,
    claimRatio: 97.8,
    cashlessGarages: 7300,
    rating: 4.4,
    badge: 'Popular',
    badgeColor: 'bg-blue-100 text-blue-700',
    features: {
      'Zero Depreciation': true,
      'Engine Protection': true,
      'Roadside Assistance': true,
      'NCB Protect': false,
      'Consumable Cover': true,
      'Key Replacement': true,
    },
  },
  {
    id: 3,
    name: 'Bajaj Allianz',
    logo: '🔒',
    category: 'Car',
    premium: 7899,
    sumInsured: 500000,
    claimRatio: 96.1,
    cashlessGarages: 6800,
    rating: 4.3,
    badge: 'Budget Pick',
    badgeColor: 'bg-orange-100 text-orange-700',
    features: {
      'Zero Depreciation': true,
      'Engine Protection': false,
      'Roadside Assistance': true,
      'NCB Protect': true,
      'Consumable Cover': false,
      'Key Replacement': false,
    },
  },
];

const compareRows = [
  { label: 'Annual Premium', key: 'premium', format: (v: number) => `₹${v.toLocaleString('en-IN')}` },
  { label: 'Sum Insured', key: 'sumInsured', format: (v: number) => `₹${(v / 100000).toFixed(1)}L` },
  { label: 'Claim Ratio', key: 'claimRatio', format: (v: number) => `${v}%` },
  { label: 'Cashless Garages', key: 'cashlessGarages', format: (v: number) => `${v.toLocaleString()}+` },
  { label: 'Rating', key: 'rating', format: (v: number) => `${v}★` },
];

export function CompareSection() {
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);

  const selected = insurers.filter((i) => selectedIds.includes(i.id));

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-3">
            COMPARE PLANS
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Compare Plans Side by Side
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            See a detailed comparison of features and pricing before you decide.
          </p>
        </motion.div>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="min-w-[700px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-gray-100 dark:border-gray-800">
              <div className="p-5 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</p>
              </div>
              {selected.map((insurer) => (
                <div key={insurer.id} className="p-5 text-center border-l border-gray-100 dark:border-gray-800">
                  <div className="text-2xl mb-1">{insurer.logo}</div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{insurer.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${insurer.badgeColor}`}>
                    {insurer.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing rows */}
            {compareRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/30'}`}>
                <div className="p-4 flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
                </div>
                {selected.map((insurer) => (
                  <div key={insurer.id} className="p-4 text-center border-l border-gray-100 dark:border-gray-800 flex items-center justify-center">
                    <span className={`text-sm font-semibold ${row.key === 'premium' ? 'text-primary-600 dark:text-primary-400 text-base' : 'text-gray-700 dark:text-gray-300'}`}>
                      {row.format((insurer as any)[row.key])}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            {/* Feature rows */}
            <div className="border-t border-gray-100 dark:border-gray-800">
              {Object.keys(selected[0]?.features || {}).map((feat, i) => (
                <div key={feat} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/30'}`}>
                  <div className="p-4 flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feat}</span>
                  </div>
                  {selected.map((insurer) => (
                    <div key={insurer.id} className="p-4 text-center border-l border-gray-100 dark:border-gray-800 flex items-center justify-center">
                      {insurer.features[feat as keyof typeof insurer.features] ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Buy buttons */}
            <div className="grid grid-cols-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="p-5" />
              {selected.map((insurer) => (
                <div key={insurer.id} className="p-5 border-l border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2">
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ₹{insurer.premium.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-gray-500">/yr</span>
                  </p>
                  <Link href={`/insurance/car/buy/${insurer.id}`} className="w-full">
                    <Button variant="gradient" size="sm" fullWidth>Buy Now</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link href="/insurance/car">
            <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Compare All Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
