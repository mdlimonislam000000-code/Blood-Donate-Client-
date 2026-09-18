'use client';
import React from 'react';
import { FaShieldAlt, FaBolt, FaHeadset, FaUsers, FaCheckCircle } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <FaBolt className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      title: 'Fast & Emergency',
      description: 'Quick communication with blood donors and easy request management during emergencies.',
    },
    {
      id: 2,
      icon: <FaShieldAlt className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      title: '100% Secure & Trusted',
      description: 'Every registered donor’s information on our platform is verified and secure.',
    },
    {
      id: 3,
      icon: <FaUsers className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      title: 'Large Donor Community',
      description: 'Thousands of active blood donors from various parts of the country are connected.',
    },
    {
      id: 4,
      icon: <FaHeadset className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      title: '24/7 Active Support',
      description: 'Our dedicated team is always ready to assist you with any emergency needs.',
    },
  ];

  return (
    <section className="py-4 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-14">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-1.5 sm:mb-2 border border-red-200 dark:border-red-900/50 shadow-2xs">
            <FaCheckCircle className="w-2.5 h-2.5" />
            WHY CHOOSE US
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Why You Can Trust Us
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-1.5 max-w-lg mx-auto px-2">
            We provide modern, secure, and reliable services to deliver blood quickly during critical times.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mt-0 relative">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="group bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-2.5 sm:p-8 shadow-sm hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col items-center text-center justify-between relative overflow-hidden"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-full flex flex-col items-center">
                {/* Icon Box */}
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-1.5 sm:mb-5 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed hidden sm:block">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;