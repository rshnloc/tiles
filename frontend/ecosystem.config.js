// PM2 config for Hostinger Node.js App Manager
// Upload this file alongside server.js in the standalone folder

module.exports = {
  apps: [
    {
      name: 'sunischist-insurance',
      script: './server.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://api.insurance.careerxera.com',
        NEXT_PUBLIC_APP_NAME: 'SunischistInsurance',
      },
    },
  ],
};
