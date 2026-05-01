'use client';

import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  gradient = false,
  onClick,
  padding = 'md',
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = cn(
    'rounded-2xl border transition-all duration-300',
    glass
      ? 'bg-white/10 backdrop-blur-md border-white/20 shadow-glass'
      : gradient
      ? 'bg-gradient-to-br from-primary-600 to-primary-800 border-transparent text-white'
      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-card',
    hover && !glass && !gradient && 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
    paddings[padding],
    className
  );

  if (hover || onClick) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  prefix?: string;
  suffix?: string;
}

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
};

export function StatCard({ title, value, change, icon, color = 'blue', prefix, suffix }: StatCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
          </p>
          {change !== undefined && (
            <p className={cn('text-xs font-semibold mt-1', change >= 0 ? 'text-green-600' : 'text-red-500')}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colorMap[color])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
