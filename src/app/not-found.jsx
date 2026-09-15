'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";
import { FaHome, FaHeartbeat, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-red-50/30 to-zinc-100 dark:from-zinc-950 dark:via-red-950/20 dark:to-zinc-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-500/10 dark:bg-red-600/15 rounded-full blur-[130px] pointer-events-none"></div>
      
      <div className="max-w-md w-full text-center relative z-10 bg-white/90 dark:bg-zinc-900/90 border border-red-100 dark:border-zinc-800 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(220,38,38,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        
        {/* থিম આધારিত ব্লাড ড্রপ/হার্টবিট আইকন */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-500 flex items-center justify-center text-3xl shadow-inner mb-6 animate-pulse border border-red-200/50 dark:border-red-900/50">
          <FaHeartbeat className="animate-bounce" />
        </div>

        {/* স্টাইলাইজড 404 নাম্বার */}
        <div className="relative mb-3">
          <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-700 tracking-tighter select-none">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Page Not Found
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          The page you are looking for might have been removed, relocated, or never existed in this network.
        </p>

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link href="/" className="w-full sm:w-auto">
            <Button 
              color="danger" 
              variant="solid" 
              className="w-full font-bold shadow-lg shadow-red-600/30 bg-red-600 hover:bg-red-700 text-white py-3.5 px-6 rounded-2xl transition-all duration-300"
              startContent={<FaHome className="text-base" />}
            >
              Back to Home
            </Button>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 py-3.5 px-6 rounded-2xl transition-all duration-300 cursor-pointer border border-zinc-200 dark:border-zinc-700/50"
          >
            <FaArrowLeft className="text-xs" /> Go Back
          </button>
        </div>

        {/* ফুটার টেক্সট */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
          <p className="text-xs font-semibold text-red-600/70 dark:text-red-400/70 tracking-widest uppercase">
            Blood Society &bull; Emergency Portal
          </p>
        </div>

      </div>
    </div>
  );
}