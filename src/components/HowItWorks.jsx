'use client';
import React from 'react';
import { FaUserPlus, FaSearch, FaHandHoldingHeart, FaCheckCircle } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUserPlus className="w-7 h-7 text-red-600 dark:text-red-400" />,
      stepNumber: '০ ওয়ান',
      title: 'রেজিস্ট্রেশন করুন',
      description: 'আপনার সঠিক তথ্য এবং রক্তের গ্রুপ দিয়ে খুব সহজেই একটি অ্যাকাউন্ট তৈরি করুন বা ডোনার হিসেবে নাম নিবন্ধন করুন।',
    },
    {
      id: 2,
      icon: <FaSearch className="w-7 h-7 text-red-600 dark:text-red-400" />,
      stepNumber: '০ টু',
      title: 'ডোনার খুঁজুন বা রিকোয়েস্ট দিন',
      description: 'আপনার এলাকার প্রয়োজন অনুযায়ী রক্তদাতা খুঁজুন অথবা জরুরি রক্তের প্রয়োজন হলে রিকোয়েস্ট পোস্ট করুন।',
    },
    {
      id: 3,
      icon: <FaHandHoldingHeart className="w-7 h-7 text-red-600 dark:text-red-400" />,
      stepNumber: '০ থ্রি',
      title: 'যোগাযোগ ও রক্তদান',
      description: 'ডোনার বা রোগীর সাথে সরাসরি যোগাযোগ করুন এবং নিরাপদে রক্তদান প্রক্রিয়া সম্পন্ন করে একটি জীবন বাঁচান।',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-3 border border-red-200 dark:border-red-900/50">
            <FaCheckCircle className="w-3.5 h-3.5" />
            সহজ প্রক্রিয়া
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            কিভাবে আমাদের প্ল্যাটফর্ম কাজ করে?
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-3">
            মাত্র ৩টি সহজ ধাপে আপনিও হতে পারেন এই জীবনরক্ষাকারী মিশনের একটি অংশ।
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="group bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col items-text text-center relative overflow-hidden"
            >
              {/* Top Gradient Border on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Step Badge & Icon Wrapper */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 mx-auto">
                  {step.icon}
                </div>
              </div>

              {/* Step Number Badge */}
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full w-max mx-auto mb-4">
                ধাপ {step.id}
              </span>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;