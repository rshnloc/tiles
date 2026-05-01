'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileText, Upload, CheckCircle2, Clock, XCircle,
  ChevronRight, AlertCircle, Car, Heart, Bike, Plus,
  Search, Filter, Calendar, IndianRupee,
} from 'lucide-react';

const mockClaims = [
  {
    id: 'CLM-2024-001',
    type: 'Car Insurance',
    icon: Car,
    color: 'blue',
    policy: 'HDFC ERGO – MH12AB1234',
    date: '18 Dec 2024',
    amount: '₹85,000',
    status: 'approved',
    statusLabel: 'Approved',
    timeline: [
      { label: 'Claim Filed', done: true, date: '18 Dec' },
      { label: 'Documents Verified', done: true, date: '20 Dec' },
      { label: 'Survey Scheduled', done: true, date: '22 Dec' },
      { label: 'Settlement Processed', done: true, date: '26 Dec' },
    ],
    description: 'Rear-end collision on NH-48. Bumper & trunk damage.',
  },
  {
    id: 'CLM-2024-002',
    type: 'Health Insurance',
    icon: Heart,
    color: 'pink',
    policy: 'Star Health – FAM-FLOATER',
    date: '3 Jan 2025',
    amount: '₹1,20,000',
    status: 'processing',
    statusLabel: 'Under Review',
    timeline: [
      { label: 'Claim Filed', done: true, date: '3 Jan' },
      { label: 'Documents Verified', done: true, date: '5 Jan' },
      { label: 'Medical Review', done: false, date: 'Pending' },
      { label: 'Settlement', done: false, date: 'Pending' },
    ],
    description: 'Planned knee surgery — Apollo Hospital, Bangalore.',
  },
  {
    id: 'CLM-2024-003',
    type: 'Bike Insurance',
    icon: Bike,
    color: 'purple',
    policy: 'Bajaj Allianz – KA03XY9876',
    date: '9 Jan 2025',
    amount: '₹22,000',
    status: 'pending',
    statusLabel: 'Awaiting Docs',
    timeline: [
      { label: 'Claim Filed', done: true, date: '9 Jan' },
      { label: 'Documents Submitted', done: false, date: 'Pending' },
      { label: 'Survey', done: false, date: 'Pending' },
      { label: 'Settlement', done: false, date: 'Pending' },
    ],
    description: 'Accident near Koramangala junction. Front fork damage.',
  },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  approved: { color: 'text-green-600 dark:text-green-400', icon: CheckCircle2, bg: 'bg-green-100 dark:bg-green-900/30' },
  processing: { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock, bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  pending: { color: 'text-orange-600 dark:text-orange-400', icon: AlertCircle, bg: 'bg-orange-100 dark:bg-orange-900/30' },
  rejected: { color: 'text-red-600 dark:text-red-400', icon: XCircle, bg: 'bg-red-100 dark:bg-red-900/30' },
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
};

export default function ClaimsPage() {
  const [showForm, setShowForm] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formStep, setFormStep] = useState(1);

  const filtered = filterStatus === 'all'
    ? mockClaims
    : mockClaims.filter((c) => c.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div>
              <span className="text-primary-200 text-sm font-semibold uppercase tracking-widest">Claims Centre</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                File & Track Claims
              </h1>
              <p className="text-primary-200 mt-2 max-w-md">
                Submit new claims, upload documents, and track status in real time — all in one place.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowForm(true); setFormStep(1); }}
              className="flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              File New Claim
            </motion.button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10"
          >
            {[
              { label: 'Total Claims', value: '3' },
              { label: 'Approved', value: '1' },
              { label: 'Processing', value: '1' },
              { label: 'Total Settled', value: '₹85K' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl px-5 py-4 text-white">
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-primary-200 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'approved', 'processing', 'pending', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                filterStatus === f
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }`}
            >
              {f === 'all' ? 'All Claims' : f}
            </button>
          ))}
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((claim, i) => {
              const status = statusConfig[claim.status];
              const StatusIcon = status.icon;
              const ClaimIcon = claim.icon;
              const isExpanded = expandedClaim === claim.id;

              return (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    onClick={() => setExpandedClaim(isExpanded ? null : claim.id)}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[claim.color]}`}>
                      <ClaimIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 dark:text-white">{claim.type}</span>
                        <span className="text-xs text-gray-400">{claim.id}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{claim.policy}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">{claim.amount}</div>
                        <div className="text-xs text-gray-400">{claim.date}</div>
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {claim.statusLabel}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Claim Progress</h4>
                            <div className="space-y-3">
                              {claim.timeline.map((step, si) => (
                                <div key={step.label} className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    step.done ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    {step.done
                                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                      : <Clock className="w-3.5 h-3.5 text-gray-400" />
                                    }
                                  </div>
                                  <div className="flex-1">
                                    <span className={`text-sm font-medium ${step.done ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                      {step.label}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-400">{step.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Description</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{claim.description}</p>
                            <div className="mt-4 flex gap-2">
                              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                                <FileText className="w-3.5 h-3.5" />
                                View Documents
                              </button>
                              <span className="text-gray-300 dark:text-gray-600">|</span>
                              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                                <Upload className="w-3.5 h-3.5" />
                                Upload More
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* File New Claim Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">File a New Claim</h2>
                    <p className="text-primary-200 text-sm mt-0.5">Step {formStep} of 3</p>
                  </div>
                  <button onClick={() => setShowForm(false)} className="text-primary-200 hover:text-white transition-colors text-2xl font-light leading-none">&times;</button>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-primary-600/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    animate={{ width: `${(formStep / 3) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Select Policy</h3>
                      <div className="space-y-3">
                        {['HDFC ERGO – Car – MH12AB1234', 'Star Health – Family Floater', 'Bajaj Allianz – Bike – KA03XY9876'].map((p) => (
                          <label key={p} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 transition-colors">
                            <input type="radio" name="policy" className="accent-primary-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {formStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Incident Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Incident Date</label>
                          <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Claim Amount (₹)</label>
                          <input type="number" placeholder="e.g. 50000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Description</label>
                          <textarea rows={3} placeholder="Brief description of the incident..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {formStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Upload Documents</h3>
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10 MB each</p>
                      </div>
                      <div className="mt-4 space-y-1">
                        {['FIR Copy / Accident Report', 'Repair Estimate / Hospital Bills', 'Policy Document', 'ID Proof'].map((doc) => (
                          <div key={doc} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-6">
                  {formStep > 1 && (
                    <button onClick={() => setFormStep((p) => p - 1)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => formStep < 3 ? setFormStep((p) => p + 1) : setShowForm(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-colors"
                  >
                    {formStep === 3 ? 'Submit Claim' : 'Continue'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
