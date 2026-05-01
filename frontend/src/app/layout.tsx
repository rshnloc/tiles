import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SunischistInsurance – Compare & Buy Insurance Online',
    template: '%s | SunischistInsurance',
  },
  description:
    'Compare and buy Car, Bike, Health & Life insurance from 30+ insurers. Get instant quotes, expert advice, and hassle-free claims.',
  keywords: [
    'insurance',
    'car insurance',
    'health insurance',
    'life insurance',
    'compare insurance',
    'buy insurance online',
    'insurance advisor',
  ],
  authors: [{ name: 'SunischistInsurance' }],
  creator: 'SunischistInsurance',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tiles-insurance.com',
    title: 'SunischistInsurance – Compare & Buy Insurance Online',
    description: 'Compare and buy insurance from 30+ insurers',
    siteName: 'SunischistInsurance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SunischistInsurance',
    description: 'Compare and buy insurance from 30+ insurers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
