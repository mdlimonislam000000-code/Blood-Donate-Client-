'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";
import { FaIdCard, FaSearch, FaTint, FaArrowRight, FaHeartbeat } from 'react-icons/fa';

const Hero = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/overview`);
        const data = await res.json();
        if (data.success) setOverviewData(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalUsers = overviewData?.totalUsers || 0;
  const completedDonations = overviewData?.donationRecords || 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-zinc-50 dark:from-red-950/20 dark:via-zinc-950 dark:to-zinc-900 py-4 sm:py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-10 items-center">
          
          {/* লেফট কন্টেন্ট */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
              <FaHeartbeat className="animate-pulse" /> Save Life Today
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">
              Donate Blood, Save Lives, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                Be a Real Hero.
              </span>
            </h1>

            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-base max-w-xl mx-auto lg:mx-0">
              Connect instantly with verified blood donors in emergency moments. Fast, secure, and reliable community blood donation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 pt-0.5">
              <Link href="/all-doner" className="w-full sm:w-auto">
                <Button color="danger" size="sm" className="w-full font-bold bg-red-600 text-white px-5 py-2 rounded-xl shadow-md text-xs" startContent={<FaSearch />}>
                  Find Donors
                </Button>
              </Link>

              <Link href="/blood-requests" className="w-full sm:w-auto">
                <Button variant="bordered" size="sm" className="w-full font-bold border-2 border-red-500 text-red-600 dark:text-red-400 px-5 py-2 rounded-xl text-xs" startContent={<FaIdCard />}>
                  Emergency Requests
                </Button>
              </Link>
            </div>

            {/* স্ট্যাটস */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800 max-w-md mx-auto lg:mx-0">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
                  {loading ? "..." : totalUsers}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold">Donors</p>
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
                  {loading ? "..." : completedDonations}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold">Lives Saved</p>
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">100%</h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold">Verified</p>
              </div>
            </div>
          </div>

          {/* রাইট কার্ড */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-xl space-y-2.5">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center text-base sm:text-lg shadow-inner">
                <FaTint />
              </div>
              
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-white">Need Blood Urgently?</h3>
                <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">Post requests and match with nearby available donors instantly.</p>
              </div>

              <Link href="/blood-requests" className="block group">
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 group-hover:border-red-500 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-[11px] sm:text-xs font-bold text-zinc-800 dark:text-white">Instant Matching</span>
                  </div>
                  <FaArrowRight className="text-[10px] text-red-500 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;