/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // همه دامنه‌ها (می‌تونی محدود کنی مثلا cdn.example.com)
      },
    ],
    domains: ['localhost'], // اگه تصاویر از بک‌اند لوکال میان
  },
};

module.exports = nextConfig;
