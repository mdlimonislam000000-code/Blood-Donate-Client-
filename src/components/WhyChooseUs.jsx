'use client';
import React from 'react';
import { FaShieldAlt, FaBolt, FaHeadset, FaUsers, FaCheckCircle } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <FaBolt className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: 'দ্রুত সাড়া ও জরুরি সেবা',
      description: 'জরুরি মুহূর্তে রক্তদাতাদের সাথে দ্রুত যোগাযোগ স্থাপন এবং রিকোয়েস্ট ম্যানেজ করার সুবিধা।',
    },
    {
      id: 2,
      icon: <FaShieldAlt className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: '১00% নিরাপদ ও বিশ্বস্ত',
      description: 'আমাদের প্ল্যাটফর্মে নিবন্ধিত প্রতিটি রক্তদাতার তথ্য যাচাইকৃত ও সুরক্ষিত থাকে।',
    },
    {
      id: 3,
      icon: <FaUsers className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: 'বৃহৎ ডোনার কমিউনিটি',
      description: 'দেশের বিভিন্ন প্রান্তের হাজারো সক্রিয় রক্তদাতা যুক্ত রয়েছেন আমাদের এই প্ল্যাটফর্মে।',
    },
    {
      id: 4,
      icon: <FaHeadset className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: '২৪/৭ সক্রিয় সাপোর্ট',
      description: 'যেকোনো জরুরি প্রয়োজনে সাহায্য করার জন্য আমাদের টিম সবসময় প্রস্তুত রয়েছে।',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-3 border border-red-200 dark:border-red-900/50">
            <FaCheckCircle className="w-3.5 h-3.5" />
            কেন আমরা সেরা
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            কেন আমাদের ওপর ভরসা রাখবেন?
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-3">
            মানুষের বিপদে দ্রুত রক্ত পৌঁছে দিতে আমরা দিচ্ছি আধুনিক, নিরাপদ ও নির্ভরযোগ্য সেবা।
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col items-text text-center relative overflow-hidden"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon Box */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 mx-auto">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
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