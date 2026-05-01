'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Play, CheckCircle2, Lock, Award, Star,
  Clock, ChevronRight, Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';

const courses = [
  {
    id: 1,
    title: 'Insurance Fundamentals',
    description: 'Learn the basics of general and life insurance products.',
    modules: 8,
    duration: '4h 30m',
    progress: 100,
    status: 'completed',
    level: 'Beginner',
    certificate: true,
    thumbnail: '📚',
  },
  {
    id: 2,
    title: 'Motor Insurance Deep Dive',
    description: 'Comprehensive guide to car and bike insurance plans.',
    modules: 12,
    duration: '6h 15m',
    progress: 65,
    status: 'in_progress',
    level: 'Intermediate',
    certificate: true,
    thumbnail: '🚗',
  },
  {
    id: 3,
    title: 'Health Insurance Mastery',
    description: 'Everything about health plans, riders, and claims.',
    modules: 10,
    duration: '5h 45m',
    progress: 0,
    status: 'locked',
    level: 'Intermediate',
    certificate: true,
    thumbnail: '🏥',
  },
  {
    id: 4,
    title: 'Sales & Customer Handling',
    description: 'Selling techniques and objection handling for advisors.',
    modules: 6,
    duration: '3h 00m',
    progress: 0,
    status: 'available',
    level: 'All Levels',
    certificate: false,
    thumbnail: '🎯',
  },
  {
    id: 5,
    title: 'Life & Term Insurance',
    description: 'Detailed walkthrough of LIC, ULIP, and term plans.',
    modules: 14,
    duration: '7h 30m',
    progress: 0,
    status: 'locked',
    level: 'Advanced',
    certificate: true,
    thumbnail: '❤️',
  },
  {
    id: 6,
    title: 'IRDAI Compliance & Ethics',
    description: 'Regulatory requirements, compliance norms, and ethics.',
    modules: 5,
    duration: '2h 15m',
    progress: 0,
    status: 'available',
    level: 'All Levels',
    certificate: true,
    thumbnail: '⚖️',
  },
];

const certificates = [
  { title: 'Insurance Fundamentals', issued: '2024-09-15', id: 'CERT-001' },
];

const statusColor: Record<string, string> = {
  completed: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  in_progress: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  available: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
  locked: 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500',
};

export default function AgentTrainingPage() {
  const [tab, setTab] = useState<'courses' | 'certificates'>('courses');

  const completed = courses.filter((c) => c.status === 'completed').length;
  const inProgress = courses.filter((c) => c.status === 'in_progress').length;

  return (
    <div className="p-6 space-y-6">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUpVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Training Academy</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Upskill and earn certifications</p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={fadeUpVariants} className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-green-600' },
            { label: 'In Progress', value: inProgress, icon: Play, color: 'text-blue-600' },
            { label: 'Certificates', value: certificates.length, icon: Award, color: 'text-yellow-600' },
          ].map((item) => (
            <div key={item.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <item.icon className={`w-6 h-6 mx-auto ${item.color}`} />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {(['courses', 'certificates'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {tab === 'courses' && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ${
                course.status === 'locked' ? 'opacity-60' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{course.thumbnail}</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[course.status]}`}>
                    {course.status === 'in_progress' ? 'In Progress' : course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{course.description}</p>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.modules} modules</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  {course.certificate && <span className="flex items-center gap-1 text-yellow-600"><Award className="w-3.5 h-3.5" /> Cert</span>}
                </div>

                {/* Progress bar */}
                {course.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  {course.status === 'locked' ? (
                    <button disabled className="w-full py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" /> Complete prerequisites first
                    </button>
                  ) : course.status === 'completed' ? (
                    <button className="w-full py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Completed — Review
                    </button>
                  ) : (
                    <Button variant="primary" fullWidth icon={course.status === 'in_progress' ? <Play className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}>
                      {course.status === 'in_progress' ? 'Continue' : 'Start Course'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {tab === 'certificates' && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No certificates yet. Complete a course to earn one!</p>
            </div>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-900/30 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{cert.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Issued: {new Date(cert.issued).toLocaleDateString('en-IN')} · ID: {cert.id}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" icon={<Download className="w-4 h-4" />} size="sm">Download</Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Download({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
