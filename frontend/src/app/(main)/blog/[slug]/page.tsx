'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';

const articles: Record<string, { title: string; category: string; readTime: string; date: string; cover: string; content: string }> = {
  'how-to-choose-car-insurance': {
    title: 'How to Choose the Right Car Insurance Plan in 2025',
    category: 'Car Insurance',
    readTime: '5 min',
    date: '2024-11-20',
    cover: '🚗',
    content: `## Why Car Insurance Matters

    Every vehicle on Indian roads is legally required to have at least a third-party insurance policy. But third-party alone covers only damage to *other* people — your own vehicle isn't covered.

    ## Types of Car Insurance

    **Third-Party Only** — Mandatory by law. Covers injury/damage to third parties. Does not cover your own vehicle.

    **Comprehensive** — Covers third-party liability + own damage (accidents, theft, fire, natural disasters).

    **Standalone Own Damage (OD)** — Covers only your vehicle's damage. Requires a separate third-party policy.

    ## What Is IDV?

    IDV (Insured Declared Value) is the current market value of your car. It's the maximum amount your insurer pays if your car is stolen or totalled. A higher IDV means higher premium but better protection.

    ## What Is NCB?

    No Claim Bonus (NCB) is a discount on your premium for every claim-free year. It starts at 20% and can go up to 50% after 5 consecutive claim-free years.

    ## Key Add-ons to Consider

    - **Zero Depreciation** — Insurer pays full cost of parts without deducting depreciation.
    - **Engine Protection** — Covers engine damage due to water ingression or oil leakage.
    - **Roadside Assistance** — 24/7 help if your car breaks down.
    - **Return to Invoice** — Get the original invoice value if the car is totalled.

    ## How to Compare Plans

    1. Compare IDV offered by different insurers
    2. Check claim settlement ratio (higher is better)
    3. Look at the garage network for cashless claims
    4. Read the exclusions carefully
    5. Factor in add-ons you genuinely need
  `,
  },
};

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles[slug];

  if (!article) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-4xl mb-4">📄</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article not found</h1>
          <Link href="/blog" className="text-primary-600 dark:text-primary-400 hover:underline">← Back to Blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Cover */}
        <div className="text-6xl text-center bg-white dark:bg-gray-900 rounded-2xl py-12 border border-gray-100 dark:border-gray-800 mb-6">
          {article.cover}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="badge badge-info">{article.category}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime} read</span>
          <span>{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white mb-8 leading-snug">
          {article.title}
        </h1>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {article.content.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{trimmed.slice(3)}</h2>;
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <p key={i} className="font-semibold text-gray-900 dark:text-white mt-4">{trimmed.slice(2, -2)}</p>;
            if (trimmed.startsWith('- **')) {
              const [bold, rest] = trimmed.slice(4).split('** — ');
              return <li key={i} className="text-gray-600 dark:text-gray-400 text-sm mt-1"><strong>{bold}</strong>{rest ? ` — ${rest}` : ''}</li>;
            }
            if (trimmed.match(/^\d+\./)) return <li key={i} className="text-gray-600 dark:text-gray-400 text-sm mt-1 list-decimal">{trimmed.slice(3)}</li>;
            if (trimmed) return <p key={i} className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-2">{trimmed}</p>;
            return null;
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white text-center">
          <p className="font-bold text-lg mb-2">Ready to get insured?</p>
          <p className="text-primary-100 text-sm mb-4">Compare 200+ plans and get the best price in minutes.</p>
          <Link
            href="/insurance"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-sm"
          >
            Compare Plans →
          </Link>
        </div>
      </div>
    </main>
  );
}
