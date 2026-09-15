'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";
import { FaIdCard, FaSearch, FaTint, FaShieldAlt, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/overview");
        const data = await res.json();

        if (data.success) {
          setOverviewData(data);
        } else {
          throw new Error(data.message || "ওভারভিউ ডেটা ফেচ করতে সমস্যা হয়েছে!");
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // অ্যাডমিন ওভারভিউয়ের লজিক অনুযায়ী ডেটা ম্যাপিং
  const totalUsers = overviewData?.totalUsers || 0;
  const completedDonations = overviewData?.donationRecords || 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-zinc-50 dark:from-red-950/20 dark:via-zinc-950 dark:to-zinc-900 py-10 lg:py-16">
      
      {/* ব্যাকগ্রাউন্ড শেইপ ও গ্লো ইফেক্ট */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-5 left-10 w-96 h-96 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-5 right-10 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* লেফট কন্টেন্ট (টেক্সট ও বাটন) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* ব্যাজ */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
              <FaTint className="animate-pulse" /> Blood Society &bull; Save Life Today
            </div>

            {/* মূল শিরোনাম */}
            <h1 className="text-3xl sm:text-5xl lg:text-4xl font-black text-zinc-900 dark:text-white leading-[1.15] tracking-tight mb-5">
              Donate Blood, Save Lives, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                Be a Real Hero.
              </span>
            </h1>

            {/* সাব-টাইটেল */}
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed mb-7 max-w-2xl mx-auto lg:mx-0">
              Connect directly with verified blood donors in your emergency moments. Join our community platform to make blood donation easier, faster, and safer for everyone.
            </p>

            {/* অ্যাকশন বাটনসমূহ */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href="/donors" className="w-full sm:w-auto">
                <Button 
                  color="danger" 
                  variant="solid" 
                  size="lg"
                  className="w-full font-bold shadow-lg shadow-red-600/30 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl transition-all duration-300"
                  startContent={<FaSearch />}
                >
                  Find Donors
                </Button>
              </Link>

              {/* NID Verification বাটন */}
              <Link href="/blood-requests" className="w-full sm:w-auto">
                <Button 
                  variant="bordered" 
                  size="lg"
                  className="w-full font-bold border-2 border-red-600 text-red-600 dark:text-red-400 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 px-8 py-3.5 rounded-2xl transition-all duration-300"
                  startContent={<FaIdCard />}
                >
                  Emergency blood requests
                </Button>
              </Link>
            </div>

            {/* ট্রাস্ট স্ট্যাটিস্টিক্স / কাউন্টার (অ্যাডমিন ওভারভিউ ডেটা অনুযায়ী ডায়নামিক) */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto lg:mx-0">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  {loading ? <span className="inline-block w-12 h-6 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded"></span> : totalUsers}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">Active Donors</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  {loading ? <span className="inline-block w-12 h-6 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded"></span> : completedDonations}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">Lives Saved</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  100%
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">Verified</p>
              </div>
            </div>

          </div>

          {/* রাইট ভিজ্যুয়াল কার্ড */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* গ্লাস মর্ফিজম কার্ড */}
              <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-500 flex items-center justify-center text-3xl mb-6 shadow-inner">
                  <FaTint className="animate-bounce" />
                </div>
                
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                  Emergency Blood Request?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                  Post your requirement instantly and get connected with nearby available blood donors within minutes.
                </p>

                <div className="space-y-3">
                  {/* ক্লিকযোগ্য ইনস্ট্যান্ট ম্যাচিং লিঙ্ক */}
                  <Link href="/blood-requests" className="block group">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/50 text-green-600 flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            Instant Matching
                          </h4>
                          <p className="text-xs text-zinc-500">Find blood group by location</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                        <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center font-bold">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Secure & Private</h4>
                      <p className="text-xs text-zinc-500">Your privacy is protected</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* ব্যাকগ্রাউন্ড বর্ডার গ্লো */}
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-red-600 to-rose-500 rounded-[2.5rem] -z-10 opacity-20 blur-sm"></div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;