/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'insurance.careerxera.com',
      'api.insurance.careerxera.com',
      'via.placeholder.com',
      'randomuser.me',
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://insurance.careerxera.com/api',
    NEXT_PUBLIC_APP_NAME: 'SunischistInsurance',
  },
};

module.exports = nextConfig;
