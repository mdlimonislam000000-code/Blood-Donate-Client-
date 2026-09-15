'use client'
import React, { useState, useEffect } from 'react';

const ImpactStats = () => {
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
        const res = await fetch('http://localhost:5000/api/admin/overview');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">আমাদের কাজের প্রভাব (Impact Statistics)</h2>
          <p className="text-base-content/70 mt-2">এক নজরে আমাদের রক্তদান কার্যক্রমের পরিসংখ্যান</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="stat bg-base-100 shadow-xl rounded-box p-6 text-center border border-base-300">
            <div className="stat-title text-base font-semibold text-base-content/70">মোট ব্যবহারকারী</div>
            <div className="stat-value text-primary text-4xl font-extrabold mt-3">{statsData.totalUsers}</div>
          </div>

          {/* Total Requests */}
          <div className="stat bg-base-100 shadow-xl rounded-box p-6 text-center border border-base-300">
            <div className="stat-title text-base font-semibold text-base-content/70">রক্তের অনুরোধ</div>
            <div className="stat-value text-secondary text-4xl font-extrabold mt-3">{statsData.totalRequests}</div>
          </div>

          {/* Donation Records / Success */}
          <div className="stat bg-base-100 shadow-xl rounded-box p-6 text-center border border-base-300">
            <div className="stat-title text-base font-semibold text-base-content/70">সফল ডোনেশন</div>
            <div className="stat-value text-success text-4xl font-extrabold mt-3">{statsData.donationRecords}</div>
          </div>

          {/* Pending Requests */}
          <div className="stat bg-base-100 shadow-xl rounded-box p-6 text-center border border-base-300">
            <div className="stat-title text-base font-semibold text-base-content/70">অপেক্ষমাণ অনুরোধ</div>
            <div className="stat-value text-warning text-4xl font-extrabold mt-3">{statsData.pendingRequests}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;