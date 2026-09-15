'use client';
import React, { useState, useEffect } from 'react';
import { FaUsers, FaTint, FaClock, FaCheckCircle, FaAward } from 'react-icons/fa';

const ImpactStats = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    donationRecords: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/admin/overview');
        const data = await res.json();
        
        if (data.success) {
          setStatsData({
            totalUsers: data.totalUsers ?? 0,
            totalRequests: data.totalRequests ?? 0,
            pendingRequests: data.pendingRequests ?? 0,
            donationRecords: data.donationRecords ?? 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch impact statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewStats();
  }, []);

  const stats = [
    {
      id: 1,
      icon: <FaUsers className="w-6 h-6 text-red-600 dark:text-red-400" />,
      count: statsData.totalUsers,
      label: 'Active Donors / Users',
      description: 'Registered platform users and donors.',
    },
    {
      id: 2,
      icon: <FaTint className="w-6 h-6 text-red-600 dark:text-red-400" />,
      count: statsData.totalRequests,
      label: 'Blood Requests',
      description: 'Total blood requests generated.',
    },
    {
      id: 3,
      icon: <FaCheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
      count: statsData.donationRecords,
      label: 'Successful Donations',
      description: 'Successfully completed blood donations.',
    },
    {
      id: 4,
      icon: <FaClock className="w-6 h-6 text-red-600 dark:text-red-400" />,
      count: statsData.pendingRequests,
      label: 'Pending Requests',
      description: 'Emergency requests waiting for response.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
      
      {/* Background Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-3 border border-red-200 dark:border-red-900/50">
            <FaAward className="w-3.5 h-3.5" />
            OUR ACHIEVEMENTS
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Impact in Numbers
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-3">
            Every number tells a story of hope, community support, and lives saved through blood donation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl shadow-gray-100/50 dark:shadow-none hover:shadow-2xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 text-center flex flex-col items-center justify-between relative overflow-hidden"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon Box - এখানে mb-4 দিয়ে সবগুলোর স্পেস সমান রাখা হয়েছে */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center  shadow-inner group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 dark:bg-gray-800 text-transparent rounded-lg w-16 h-8">...</span>
                  ) : (
                    stat.count
                  )}
                </h3>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
                  {stat.label}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ImpactStats;