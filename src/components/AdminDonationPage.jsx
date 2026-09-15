
'use client'
import React, { useEffect, useState } from 'react';

const AdminDonationPage = () => {
      const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/donation-history/all');
        const data = await response.json();
        
        if (data.success) {
          setDonations(data.data);
        } else {
          setError(data.message || 'ডোনেশন রেকর্ড সংগ্রহ করতে সমস্যা হয়েছে।');
        }
      } catch (err) {
        console.error(err);
        setError('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const totalBags = donations.reduce((sum, item) => sum + (Number(item.bags) || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-3">
        <span className="loading loading-spinner loading-lg text-error"></span>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">রেকর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center rounded-2xl shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">দুঃখিত! সমস্যা হয়েছে</h3>
        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="text-error">🩸</span> রক্তদান ও ডোনেশন হিস্ট্রি
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            সকল সফল রক্তদানের তালিকা এবং রোগীর বিবরণ এখানে দেখতে পাবেন।
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-red-50 dark:bg-gray-800 border border-red-100 dark:border-gray-700 px-5 py-3 rounded-xl shadow-xs text-center">
            <span className="block text-xs font-semibold text-red-600 dark:text-red-400 uppercase">মোট রেকর্ড</span>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{donations.length} টি</span>
          </div>
          <div className="bg-emerald-50 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 px-5 py-3 rounded-xl shadow-xs text-center">
            <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">মোট রক্ত সংগ্রহ</span>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalBags} ব্যাগ</span>
          </div>
        </div>
      </div>
      
      {donations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-5xl mb-3">📂</div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">কোনো ডোনেশন রেকর্ড পাওয়া যায়নি।</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">নতুন ডোনেশন সম্পন্ন হলে তা এখানে তালিকাভুক্ত হবে।</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <table className="table w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-4 px-4 text-center">#</th>
                <th className="py-4 px-4">রোগীর নাম ও হাসপাতাল</th>
                <th className="py-4 px-4">গ্রুপ</th>
                <th className="py-4 px-4">ব্যাগ</th>
                <th className="py-4 px-4">ডোনারের তথ্য</th>
                <th className="py-4 px-4">লোকেশন ও কোড</th>
                <th className="py-4 px-4">তারিখ</th>
                <th className="py-4 px-4 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
              {donations.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-red-50/30 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  
                  <td className="py-4 px-4 text-center font-semibold text-gray-500 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs">{index + 1}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-base">{item.patientName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      🏥 {item.hospitalName}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="badge badge-error bg-red-600 text-white font-bold px-3 py-3 rounded-lg shadow-xs">
                      {item.bloodGroup}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    {item.bags} ব্যাগ
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      <span>👤</span> {item.donorName }
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5 flex items-center gap-1">
                      📞 {item.donorEmail }
                    </div>
                  </td>

                  {/* লোকেশন ও কোড */}
                  <td className="py-4 px-4">
                    <div className="text-xs text-gray-600 dark:text-gray-400 max-w-[180px] truncate" title={item.hospitalLocation}>
                      📍 {item.hospitalLocation || 'প্রযোজ্য নয়'}
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                      কোড: <span className="text-gray-600 dark:text-gray-300 font-semibold">{item.donationCode}</span>
                    </div>
                  </td>

                  {/* তারিখ */}
                  <td className="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {item.donatedDate || new Date(item.createdAt).toLocaleDateString('bn-BD')}
                  </td>

                  {/* স্ট্যাটাস */}
                  <td className="py-4 px-4 text-center">
                    <span className="badge badge-success bg-emerald-500 border-none text-white font-medium text-xs px-3 py-2 capitalize shadow-xs">
                      ✨ {item.status || 'completed'}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDonationPage;