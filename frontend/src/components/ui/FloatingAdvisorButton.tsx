'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Headphones, X, MessageSquare, Phone, Calendar } from 'lucide-react';

const OPTIONS = [
  { icon: MessageSquare, label: 'Chat with Advisor', href: '/advisors', color: 'bg-primary-600 hover:bg-primary-700' },
  { icon: Phone, label: 'Call 1800-123-4567', href: 'tel:18001234567', color: 'bg-green-600 hover:bg-green-700' },
  { icon: Calendar, label: 'Book a Callback', href: '/advisors?tab=callback', color: 'bg-secondary-600 hover:bg-secondary-700' },
];

export function FloatingAdvisorButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Sub-options */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.22, type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-end gap-2"
          >
            {OPTIONS.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={opt.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={opt.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 ${opt.color} text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-x-0.5 whitespace-nowrap`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {opt.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-2xl flex items-center justify-center overflow-hidden"
        aria-label="Talk to Advisor"
      >
        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-primary-400/50"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.7, 0, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
          />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Headphones className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Label tooltip (visible when closed) */}
      <AnimatePresence>
        {!open && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xs font-semibold text-white bg-gray-900/80 dark:bg-gray-800/90 backdrop-blur px-2.5 py-1 rounded-lg shadow pointer-events-none"
          >
            Talk to Advisor
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
