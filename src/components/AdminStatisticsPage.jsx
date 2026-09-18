'use client';
import React, { useState, useEffect } from 'react';
import { FaUsers, FaTint, FaCheckCircle, FaClock, FaShieldAlt } from 'react-icons/fa';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const AdminStatisticsPage = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalRequests: 0,
    donationRecords: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/overview`);
        const data = await res.json();
        
        if (data.success) {
          setStatsData({
            totalUsers: data.totalUsers ?? 0,
            totalRequests: data.totalRequests ?? 0,
            donationRecords: data.donationRecords ?? 0,
            pendingRequests: data.pendingRequests ?? 0
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

  // Data for Pie Chart
  const chartData = [
    { name: 'Users', value: statsData.totalUsers, color: '#3b82f6' },
    { name: 'Requests', value: statsData.totalRequests, color: '#f43f5e' },
    { name: 'Successful', value: statsData.donationRecords, color: '#10b981' },
    { name: 'Pending', value: statsData.pendingRequests, color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-3">
        <span className="loading loading-spinner loading-lg text-rose-600"></span>
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse text-xs">
          Loading statistics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 text-slate-800 dark:text-slate-100">
      
      {/* Header Banner */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-52 h-52 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/25 text-rose-200 border border-rose-500/30 mb-1.5">
            <FaShieldAlt size={10} /> Impact Statistics
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Our Work Impact & Statistics
          </h2>
          <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5 max-w-xl">
            A quick glance at our blood donation activities and overview metrics.
          </p>
        </div>
      </div>

      {/* Main Grid: Compact Cards (Left) & Pie Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        
        {/* Statistics Cards Grid (2 cards per row, very compact) */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Total Users */}
          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Users
              </span>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <FaUsers size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {statsData.totalUsers}
              </h3>
            </div>
          </div>

          {/* Blood Requests */}
          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Blood Requests
              </span>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <FaTint size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {statsData.totalRequests}
              </h3>
            </div>
          </div>

          {/* Successful Donations */}
          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Successful
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <FaCheckCircle size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {statsData.donationRecords}
              </h3>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <FaClock size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400">
                {statsData.pendingRequests}
              </h3>
            </div>
          </div>

        </div>

        {/* Pie Chart Section */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Statistics Distribution Overview
          </h3>
          <div className="w-full h-52 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStatisticsPage;