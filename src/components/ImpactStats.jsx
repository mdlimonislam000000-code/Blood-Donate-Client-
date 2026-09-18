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
      icon: <FaUsers className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      count: statsData.totalUsers,
      label: 'Active Donors',
      description: 'Registered platform users & donors.',
    },
    {
      id: 2,
      icon: <FaTint className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      count: statsData.totalRequests,
      label: 'Blood Requests',
      description: 'Total blood requests generated.',
    },
    {
      id: 3,
      icon: <FaCheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />,
      count: statsData.donationRecords,
      label: 'Successful Donations',
      description: 'Completed blood donations.',
    },
    {
      id: 4,
      icon: -1 !== 4 ? <FaClock className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" /> : null,
      count: statsData.pendingRequests,
      label: 'Pending Requests',
      description: 'Emergency waiting requests.',
    },
  ];

  return (
    <section className="py-4 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-red-50/20 to-gray-50 dark:from-gray-900 dark:via-zinc-950 dark:to-gray-950 transition-colors relative overflow-hidden">
      
      {/* Background Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-red-500/10 dark:bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-1.5 sm:mb-3 border border-red-200 dark:border-red-900/50 shadow-2xs">
            <FaAward className="w-3 h-3" />
            OUR ACHIEVEMENTS
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Our Impact in Numbers
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2.5 max-w-lg mx-auto px-2">
            Every number tells a story of hope, community support, and lives saved through blood donation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mt-0">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="group bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800/85 rounded-xl sm:rounded-3xl p-2.5 sm:p-6 lg:p-8 shadow-md shadow-gray-100/40 dark:shadow-none hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col items-center text-center justify-between relative overflow-hidden"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-full flex flex-col items-center">
                {/* Icon Box */}
                <div className="w-7 h-7 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner mb-1.5 sm:mb-5 group-hover:scale-105 transition-transform duration-300">
                  {stat.icon}
                </div>

                {/* Count & Label */}
                <h3 className="text-base sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-0.5 sm:mb-2">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 dark:bg-gray-800 text-transparent rounded-lg w-8 sm:w-16 h-4 sm:h-8">...</span>
                  ) : (
                    stat.count
                  )}
                </h3>
                <h4 className="text-[11px] sm:text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 leading-tight">
                  {stat.label}
                </h4>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1 sm:mt-2 hidden sm:block">
                {stat.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ImpactStats;