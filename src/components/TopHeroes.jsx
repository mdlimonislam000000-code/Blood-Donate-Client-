'use client';
import React, { useState, useEffect } from 'react';
import { FaAward, FaTint, FaMapMarkerAlt, FaHeart, FaCheckCircle, FaHospital, FaCalendarAlt } from 'react-icons/fa';

const TopHeroes = () => {
  const [topHeroes, setTopHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopHeroes = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/donation-history/all');
        const data = await res.json();

        if (data.success && data.data) {
          const donorMap = {};
          
          data.data.forEach((item) => {
            const donorName = item.donorName || 'অজ্ঞাতদাতা';
            if (!donorMap[donorName]) {
              donorMap[donorName] = {
                id: item._id,
                name: donorName,
                bloodGroup: item.bloodGroup || 'N/A',
                location: item.hospitalLocation || 'বাংলাদেশ',
                lastHospital: item.hospitalName || '',
                lastDonatedDate: item.donatedDate || '',
                totalBags: 0,
                totalDonations: 0,
              };
            }
            donorMap[donorName].totalDonations += 1;
            donorMap[donorName].totalBags += (item.bags || 1);
            donorMap[donorName].lastDonatedDate = item.donatedDate || donorMap[donorName].lastDonatedDate;
          });

          const sortedHeroes = Object.values(donorMap).sort((a, b) => b.totalDonations - a.totalDonations);
          setTopHeroes(sortedHeroes.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch top heroes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopHeroes();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 animate-pulse">শীর্ষ রক্তদাতাদের তালিকা লোড হচ্ছে...</div>;
  }

  if (topHeroes.length === 0) {
    return null; 
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-3 border border-red-200 dark:border-red-900/50">
            <FaAward className="w-3.5 h-3.5" />
            কমিউনিটি হিরো
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            আমাদের শীর্ষ রক্তদাতাগণ
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-3">
            যাঁদের নিয়মিত রক্তদানে বেঁচে ফিরেছে বহু মূল্যবান জীবন। তাঁদের প্রতি আমাদের অশেষ কৃতজ্ঞতা।
          </p>
        </div>

        {/* Heroes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topHeroes.map((hero, index) => (
            <div 
              key={index}
              className="group bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-red-300 dark:hover:border-red-900 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div>
                {/* Header: Name, Location & Blood Group in Same Line */}
                <div className="flex items-start justify-between gap-2 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                      {hero.name}
                      <FaCheckCircle className="text-blue-500 w-3.5 h-3.5 flex-shrink-0" title="Verified Donor" />
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 capitalize font-medium">
                      <FaMapMarkerAlt className="w-3 h-3 text-red-500 flex-shrink-0" /> {hero.location}
                    </p>
                  </div>

                  {/* Blood Group Badge */}
                  <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md flex-shrink-0">
                    <FaTint className="w-3 h-3" /> {hero.bloodGroup}
                  </span>
                </div>

                {/* Info Box: Explicitly forced light background for light mode and dark background for dark mode with high-contrast text */}
                <div className="space-y-2.5 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-300 dark:border-gray-700 text-xs mb-5 shadow-sm">
                  <div className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2 truncate">
                    <FaHospital className="text-red-500 w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">শেষ হসপিটাল: {hero.lastHospital}</span>
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                    <FaCalendarAlt className="text-red-500 w-3.5 h-3.5 flex-shrink-0" />
                    <span>শেষ দান: {hero.lastDonatedDate}</span>
                  </div>
                </div>
              </div>

              {/* Total Donation Badge at Bottom */}
              <div className="w-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 rounded-2xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 shadow-sm">
                <FaHeart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                মোট দান: {hero.totalDonations} বার ({hero.totalBags} ব্যাগ)
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopHeroes;