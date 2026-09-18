'use client';
import React from 'react';
import { FaUserPlus, FaSearch, FaHandHoldingHeart, FaCheckCircle } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUserPlus className="w-4 h-4 sm:w-7 sm:h-7 text-red-600 dark:text-red-400" />,
      title: 'Registration',
      description: 'Easily create an account or register as a blood donor with your basic details and blood group.',
    },
    {
      id: 2,
      icon: <FaSearch className="w-4 h-4 sm:w-7 sm:h-7 text-red-600 dark:text-red-400" />,
      title: 'Find or Request',
      description: 'Search for verified donors nearby or post an emergency blood request immediately.',
    },
    {
      id: 3,
      icon: <FaHandHoldingHeart className="w-4 h-4 sm:w-7 sm:h-7 text-red-600 dark:text-red-400" />,
      title: 'Connect & Donate',
      description: 'Directly communicate with donors or patients and successfully complete the safe donation.',
    },
  ];

  return (
    <section className="py-4 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-14">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-1.5 sm:mb-2 border border-red-200 dark:border-red-900/50 shadow-2xs">
            <FaCheckCircle className="w-2.5 h-2.5" />
            EASY PROCESS
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            How Our Platform Works
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-1.5 max-w-lg mx-auto px-2">
            In just 3 simple steps, you can become a part of this life-saving mission.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6 mt-0 relative">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="group bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-2.5 sm:p-8 shadow-sm hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col items-center text-center justify-between relative overflow-hidden"
            >
              {/* Top Gradient Border on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-full flex flex-col items-center">
                {/* Icon Wrapper */}
                <div className="w-8 h-8 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner mb-1.5 sm:mb-5 group-hover:scale-105 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Step Number Badge */}
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full mb-1 sm:mb-2">
                  Step 0{step.id}
                </span>

                {/* Content */}
                <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {step.title}
                </h3>
              </div>

              <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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