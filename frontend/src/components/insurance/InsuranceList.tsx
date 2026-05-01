'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, SlidersHorizontal, Check, Star, Shield, Users,
  ChevronDown, ArrowRight, Heart, X, Info, Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import type { InsurancePlan, InsuranceCategory } from '@/types';

// Mock data
const mockPlans: InsurancePlan[] = [
  {
    id: 1,
    insurer: { id: 1, name: 'HDFC Ergo', logo: '🏦', claim_ratio: 98.4, rating: 4.5, description: 'Leading insurer' },
    category: 'car',
    name: 'Smart Protect',
    premium: 8499,
    sum_insured: 500000,
    coverage: ['Own Damage', 'Third Party', 'Personal Accident'],
    exclusions: ['Mechanical breakdown', 'Wear and tear'],
    add_ons: [
      { id: 1, name: 'Zero Depreciation', price: 1200, description: 'Full claim without depreciation' },
      { id: 2, name: 'Engine Protection', price: 800, description: 'Covers engine damage' },
    ],
    claim_ratio: 98.4,
    cashless_hospitals: 8500,
    features: [
      { icon: 'shield', label: 'IDV', value: '₹5.5 Lakh' },
      { icon: 'garage', label: 'Garages', value: '8,500+' },
    ],
    is_popular: true,
    badge: 'Best Value',
  },
  {
    id: 2,
    insurer: { id: 2, name: 'ICICI Lombard', logo: '🏛️', claim_ratio: 97.8, rating: 4.4, description: 'Trusted insurer' },
    category: 'car',
    name: 'Complete Cover',
    premium: 9299,
    sum_insured: 500000,
    coverage: ['Own Damage', 'Third Party', 'Personal Accident', 'Roadside Assistance'],
    exclusions: ['Drunk driving', 'Racing'],
    add_ons: [
      { id: 3, name: 'Consumable Cover', price: 600, description: 'Covers consumables' },
      { id: 4, name: 'Key Replacement', price: 400, description: 'Key loss coverage' },
    ],
    claim_ratio: 97.8,
    cashless_hospitals: 7300,
    features: [
      { icon: 'shield', label: 'IDV', value: '₹5.5 Lakh' },
      { icon: 'garage', label: 'Garages', value: '7,300+' },
    ],
    is_popular: false,
    badge: 'Popular',
  },
  {
    id: 3,
    insurer: { id: 3, name: 'Bajaj Allianz', logo: '🔒', claim_ratio: 96.1, rating: 4.3, description: 'Affordable insurance' },
    category: 'car',
    name: 'Basic Cover',
    premium: 7899,
    sum_insured: 500000,
    coverage: ['Own Damage', 'Third Party'],
    exclusions: ['Racing events', 'Criminal acts'],
    add_ons: [
      { id: 5, name: 'Zero Depreciation', price: 900, description: 'Full claim without depreciation' },
    ],
    claim_ratio: 96.1,
    cashless_hospitals: 6800,
    features: [
      { icon: 'shield', label: 'IDV', value: '₹5.5 Lakh' },
      { icon: 'garage', label: 'Garages', value: '6,800+' },
    ],
    is_popular: false,
    badge: 'Budget Pick',
  },
];

interface InsuranceListProps {
  category: InsuranceCategory;
  categoryLabel: string;
}

export function InsuranceList({ category, categoryLabel }: InsuranceListProps) {
  const [plans] = useState<InsurancePlan[]>(mockPlans);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'premium' | 'claim_ratio' | 'rating'>('premium');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    maxPremium: 20000,
    minClaimRatio: 90,
    addOns: [] as string[],
  });

  const toggleCompare = useCallback((id: number) => {
    setCompareList((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  }, []);

  const sorted = [...plans].sort((a, b) => {
    if (sortBy === 'premium') return a.premium - b.premium;
    if (sortBy === 'claim_ratio') return b.claim_ratio - a.claim_ratio;
    return b.insurer.rating - a.insurer.rating;
  });

  return (
    <div className="flex gap-6">
      {/* Sidebar Filters */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-24">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-4 h-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>

          {/* Premium Range */}
          <div className="mb-6">
            <label className="label">Max Premium</label>
            <input
              type="range"
              min={5000}
              max={50000}
              step={1000}
              value={filters.maxPremium}
              onChange={(e) => setFilters((f) => ({ ...f, maxPremium: Number(e.target.value) }))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹5,000</span>
              <span className="text-primary-600 font-semibold">₹{filters.maxPremium.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Claim Ratio */}
          <div className="mb-6">
            <label className="label">Min Claim Ratio</label>
            <input
              type="range"
              min={80}
              max={100}
              step={0.5}
              value={filters.minClaimRatio}
              onChange={(e) => setFilters((f) => ({ ...f, minClaimRatio: Number(e.target.value) }))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>80%</span>
              <span className="text-primary-600 font-semibold">{filters.minClaimRatio}%</span>
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="label">Add-ons Required</label>
            <div className="space-y-2">
              {['Zero Depreciation', 'Engine Protection', 'Roadside Assistance', 'NCB Protect', 'Consumable Cover'].map((addon) => (
                <label key={addon} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    filters.addOns.includes(addon)
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
                  }`}
                    onClick={() => setFilters((f) => ({
                      ...f,
                      addOns: f.addOns.includes(addon)
                        ? f.addOns.filter((a) => a !== addon)
                        : [...f.addOns, addon],
                    }))}
                  >
                    {filters.addOns.includes(addon) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{addon}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="flex-1">
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <strong className="text-gray-900 dark:text-white">{sorted.length}</strong> {categoryLabel} plans
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
            <div className="flex gap-1">
              {(['premium', 'claim_ratio', 'rating'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sortBy === sort
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {sort === 'premium' ? 'Price' : sort === 'claim_ratio' ? 'Claim Ratio' : 'Rating'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="space-y-4">
          {sorted.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Insurer Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0 border border-gray-100 dark:border-gray-700">
                      {plan.insurer.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 dark:text-white">{plan.insurer.name}</h3>
                        {plan.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            plan.badge === 'Best Value' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            plan.badge === 'Popular' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{plan.name}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span>{plan.insurer.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Shield className="w-3.5 h-3.5 text-green-500" />
                          <span>{plan.claim_ratio}% Claim Ratio</span>
                        </div>
                        {plan.cashless_hospitals && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            <span>{plan.cashless_hospitals.toLocaleString()}+ Cashless</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Premium & CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{plan.premium.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">per year</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Link href={`/insurance/${category}/buy/${plan.id}`}>
                        <Button variant="gradient" size="sm" fullWidth>Buy Now</Button>
                      </Link>
                      <button
                        onClick={() => toggleCompare(plan.id)}
                        className={`text-xs font-medium transition-colors ${
                          compareList.includes(plan.id)
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                      >
                        {compareList.includes(plan.id) ? '✓ Added to Compare' : '+ Add to Compare'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coverage tags */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {plan.coverage.map((cov) => (
                      <span key={cov} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium">
                        <Check className="w-3 h-3" /> {cov}
                      </span>
                    ))}
                    {plan.add_ons.slice(0, 3).map((addon) => (
                      <span key={addon.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium">
                        + {addon.name} (₹{addon.price})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compare tray */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-4 bg-gray-900 dark:bg-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl border border-gray-700">
                <span className="text-sm font-medium">
                  {compareList.length} plan{compareList.length > 1 ? 's' : ''} selected
                </span>
                <Link href={`/insurance/${category}/compare?ids=${compareList.join(',')}`}>
                  <Button variant="gradient" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    Compare Now
                  </Button>
                </Link>
                <button onClick={() => setCompareList([])} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
