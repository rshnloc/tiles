'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Bike, Heart, Shield, ArrowRight } from 'lucide-react';

const categories = [
  {
    label: 'Car Insurance',
    icon: Car,
    href: '/insurance/car',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    desc: 'Protect your car against accidents, theft & damage.',
  },
  {
    label: 'Bike Insurance',
    icon: Bike,
    href: '/insurance/bike',
    color: 'from-orange-500 to-orange-700',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    desc: 'Two-wheeler plans starting at just ₹714/year.',
  },
  {
    label: 'Health Insurance',
    icon: Heart,
    href: '/insurance/health',
    color: 'from-green-500 to-emerald-700',
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    desc: 'Cashless hospitalisation for your whole family.',
  },
  {
    label: 'Life Insurance',
    icon: Shield,
    href: '/insurance/life',
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-300',
    desc: "Secure your family's future with term & ULIP plans.",
  },
];

export default function InsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-20 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-display font-black text-4xl sm:text-5xl mb-4">
            Insurance Marketplace
          </h1>
          <p className="text-primary-200 text-lg">
            Compare 200+ plans from 30+ top insurers. Best price guaranteed.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Choose Insurance Category
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={cat.href}
                className={`group flex items-center gap-5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-card-hover transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{cat.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
