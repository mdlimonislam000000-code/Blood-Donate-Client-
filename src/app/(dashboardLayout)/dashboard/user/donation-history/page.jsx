'use client'
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { FaHospital, FaMapMarkerAlt, FaTint, FaUserInjured, FaUserCheck, FaKey, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const DonationHistory = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  const fetchDonationHistory = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`http://localhost:5000/api/donation-history/${session.user.id}`);
        const data = await response.json();
        
        if (data.success) {
          setHistoryList(data.data);
        }
      } catch (error) {
        console.error("Error fetching donation history:", error);
      } finally {
        setLoading(false);
      }
    } else if (!sessionLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationHistory();
  }, [session, sessionLoading]);

  // সার্চ এবং ডেট অনুযায়ী সোর্টিং লজিক
  const filteredHistory = historyList
    .filter((item) => {
      const matchesSearch = 
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospitalLocation?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.donatedDate || a.createdAt || 0);
      const dateB = new Date(b.donatedDate || b.createdAt || 0);

      if (sortOrder === 'latest') {
        return dateB - dateA; // নতুন থেকে পুরানো
      } else {
        return dateA - dateB; // পুরানো থেকে নতুন
      }
    });

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-gray-600">দয়া করে প্রথমে লগইন করুন!</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-error mb-2 flex items-center justify-center gap-2">
          রক্তদানের ইতিহাস (Donation History)
        </h2>
        <p className="text-gray-600">আপনার সম্পন্ন করা ব্লাড ডোনেশনের হিস্ট্রি এখানে দেখতে পাবেন।</p>
      </div>

      {/* সার্চ এবং সোর্টিং সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-base-200 p-4 rounded-xl shadow-sm">
        <div>
          <input
            type="text"
            placeholder="রোগী, ডোনার, হাসপাতাল বা লোকেশন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="latest">নতুন থেকে পুরানো (Latest first)</option>
            <option value="oldest">পুরানো থেকে নতুন (Oldest first)</option>
          </select>
        </div>
      </div>

      {/* হিস্ট্রি লিস্ট বা কার্ড */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-xl border">
          <p className="text-lg text-gray-500">কোনো ডোনেশন হিস্ট্রি পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div key={item._id} className="card bg-base-100 shadow-xl border border-error/20 flex flex-col justify-between">
              <div className="card-body">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="card-title text-xl font-bold flex items-center gap-2">
                      <span className="text-error"><FaUserInjured /></span> {item.patientName}
                    </h3>
                  </div>
                  <span className="bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 text-sm shrink-0">
                    <FaTint /> {item.bloodGroup}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600 my-2 pt-2 border-t border-gray-100">
                  {/* রোগীর নাম লেবেল সহ */}
                  <p className="flex items-center gap-2">
                    <FaUserInjured className="text-error" /> 
                    <span className="font-semibold text-gray-700">রোগীর নাম:</span> {item.patientName || 'N/A'}
                  </p>
                  {/* ডোনারের নাম */}
                  <p className="flex items-center gap-2">
                    <FaUserCheck className="text-emerald-500" /> 
                    <span className="font-semibold text-gray-700">ডোনার:</span> {item.donorName || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaHospital className="text-gray-400" /> 
                    <span className="font-semibold">হাসপাতাল:</span> {item.hospitalName}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" /> 
                    <span className="font-semibold">লোকেশন:</span> {item.hospitalLocation}
                  </p>
                  <p>
                    <span className="font-semibold">রক্তের ব্যাগ:</span> {item.bags} ব্যাগ
                  </p>
                  
                  {item.donatedDate && (
                    <p className="flex items-center gap-2 text-xs text-emerald-600 font-semibold pt-1">
                      <FaCalendarAlt /> রক্তদানের তারিখ: {item.donatedDate}
                    </p>
                  )}
                </div>

                {/* সিক্রেট কোড ভিউ */}
                {item.donationCode && (
                  <div className="my-3 p-3 bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2">
                    <FaKey className="text-red-600" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500">Secret Donation Code</p>
                      <p className="text-sm font-mono font-bold tracking-widest text-red-600 dark:text-red-400">{item.donationCode}</p>
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-4 pt-3 border-t border-gray-100">
                  <span className="badge font-bold p-3 flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-300 capitalize">
                    <FaCheckCircle /> {item.status || 'Completed'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;