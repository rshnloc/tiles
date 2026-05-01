'use client';

import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  Insurance: [
    { label: 'Car Insurance', href: '/insurance/car' },
    { label: 'Bike Insurance', href: '/insurance/bike' },
    { label: 'Health Insurance', href: '/insurance/health' },
    { label: 'Life Insurance', href: '/insurance/life' },
    { label: 'Travel Insurance', href: '/insurance/travel' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Partner With Us', href: '/partner' },
    { label: 'Become an Advisor', href: '/agent/register' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'File a Claim', href: '/claims/new' },
    { label: 'Renew Policy', href: '/renew' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Grievance Redressal', href: '/grievance' },
  ],
  Resources: [
    { label: 'Insurance Blog', href: '/blog' },
    { label: 'Insurance Guides', href: '/guides' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Glossary', href: '/glossary' },
  ],
};

const insurers = [
  'HDFC Ergo', 'ICICI Lombard', 'Bajaj Allianz', 'New India Assurance',
  'Star Health', 'Niva Bupa', 'LIC', 'SBI Life',
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Insurer logos strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">
            Our Insurance Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {insurers.map((name) => (
              <span key={name} className="text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Sunischist<span className="text-primary-400">Insurance</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-gray-500">
              India's most trusted insurance marketplace. Compare, buy and manage insurance from 30+ insurers. IRDAI licensed broker.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>1800-123-4567 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@sunischistinsurance.com</span>
              </div>
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span>123, Insurance Tower, Bandra Kurla Complex, Mumbai - 400051</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-200 text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} SunischistInsurance Broking Pvt. Ltd. All rights reserved.
              IRDAI Registration No: 123 | CIN: U66010MH2024PTC123456
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Use</Link>
              <Link href="/disclaimer" className="hover:text-gray-400 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
