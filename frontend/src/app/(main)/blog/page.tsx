'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock, Tag, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    slug: 'how-to-choose-car-insurance',
    title: 'How to Choose the Right Car Insurance Plan in 2025',
    excerpt: 'A complete guide to understanding IDV, NCB, zero depreciation add-ons and what really matters when comparing car insurance.',
    category: 'Car Insurance',
    readTime: '5 min',
    date: '2024-11-20',
    cover: '🚗',
    featured: true,
  },
  {
    slug: 'health-insurance-family-floater',
    title: 'Individual vs Family Floater Health Plans: Which Is Better?',
    excerpt: 'Break down the pros and cons of individual policies versus a single family floater plan to make the best decision for your household.',
    category: 'Health Insurance',
    readTime: '6 min',
    date: '2024-11-15',
    cover: '❤️',
    featured: true,
  },
  {
    slug: 'term-insurance-beginners-guide',
    title: 'Term Insurance: Everything You Need to Know',
    excerpt: 'Why term plans offer the highest coverage at the lowest premium, and how to pick the right sum assured for your income.',
    category: 'Life Insurance',
    readTime: '7 min',
    date: '2024-11-10',
    cover: '🛡️',
    featured: false,
  },
  {
    slug: 'bike-insurance-third-party-vs-comprehensive',
    title: 'Third-party vs Comprehensive Bike Insurance Explained',
    excerpt: 'Mandatory third-party or full comprehensive? We break down the differences so you never overpay or under-insure your two-wheeler.',
    category: 'Bike Insurance',
    readTime: '4 min',
    date: '2024-11-05',
    cover: '🏍️',
    featured: false,
  },
  {
    slug: 'how-to-file-insurance-claim',
    title: 'Step-by-Step Guide to Filing an Insurance Claim',
    excerpt: "From the moment of incident to receiving your settlement — here's exactly what to do and what documents to keep ready.",
    category: 'Claims',
    readTime: '5 min',
    date: '2024-10-28',
    cover: '📋',
    featured: false,
  },
  {
    slug: 'ncb-car-insurance-discount',
    title: 'What Is NCB and How to Maximise Your Discount?',
    excerpt: 'No Claim Bonus can reduce your premium by up to 50%. Learn how to protect and transfer your NCB when switching insurers.',
    category: 'Car Insurance',
    readTime: '3 min',
    date: '2024-10-20',
    cover: '💰',
    featured: false,
  },
];

const categories = ['All', 'Car Insurance', 'Bike Insurance', 'Health Insurance', 'Life Insurance', 'Claims'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-7 h-7 text-primary-400" />
            <span className="text-primary-400 font-semibold">Insurance Knowledge Hub</span>
          </div>
          <h1 className="font-display font-black text-4xl text-white mb-3">Learn. Compare. Save.</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Expert guides on insurance, claims, and financial planning — written in plain English.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Posts */}
        {featured.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <h2 className="font-bold text-gray-900 dark:text-white">Featured</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-800 p-8 text-4xl text-center">
                      {post.cover}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-info text-xs">{post.category}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-1 mt-3 text-primary-600 dark:text-primary-400 text-sm font-medium">
                        Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        {rest.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5">All Articles</h2>
            {rest.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="text-3xl w-12 h-12 flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {post.cover}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm">
                      {post.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No articles found for "{search}"</p>
          </div>
        )}
      </div>
    </main>
  );
}
