/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // BetterAuth বা অথেন্টিকেশনের রুটগুলো বাদ দিয়ে বাকিগুলো রিডাইরেক্ট করুন
        source: '/api/((?!auth).*)',
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/$1`,
      },
    ];
  },
};

export default nextConfig;