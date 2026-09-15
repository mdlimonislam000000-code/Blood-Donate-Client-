/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // BetterAuth বা অথেন্টিকেশনের রুটগুলো বাদ দিয়ে বাকিগুলো রিডাইরেক্ট করুন
        source: '/api/((?!auth).*)',
        destination: 'http://localhost:5000/api/$1',
      },
    ];
  },
};

export default nextConfig;