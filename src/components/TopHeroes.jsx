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
            const donorName = item.donorName || 'Unknown Donor';
            if (!donorMap[donorName]) {
              donorMap[donorName] = {
                id: item._id,
                name: donorName,
                bloodGroup: item.bloodGroup || 'N/A',
                location: item.hospitalLocation || 'Bangladesh',
                lastHospital: item.hospitalName || 'N/A',
                lastDonatedDate: item.donatedDate || 'N/A',
                totalBags: 0,
                totalDonations: 0,
              };
            }
            donorMap[donorName].totalDonations += 1;
            donorMap[donorName].totalBags += (item.bags || 1);
            donorMap[donorName].lastDonatedDate = item.donatedDate || donorMap[donorName].lastDonatedDate;
          });

          const sortedHeroes = Object.values(donorMap).sort((a, b) => b.totalDonations - a.totalDonations);
          setTopHeroes(sortedHeroes);
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
    return <div className="text-center py-10 text-gray-500 animate-pulse text-xs sm:text-sm">Loading top heroes list...</div>;
  }

  if (topHeroes.length === 0) {
    return null; 
  }

  return (
    <section className="py-4 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-14">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-1.5 sm:mb-2 border border-red-200 dark:border-red-900/50 shadow-2xs">
            <FaAward className="w-2.5 h-2.5" />
            COMMUNITY HEROES
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Our Top Blood Donors
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-1.5 max-w-lg mx-auto px-2">
            Many lives have been saved through their regular blood donations. Our heartfelt gratitude to them.
          </p>
        </div>

        {/* Heroes Grid / Slider for Mobile */}
        <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible gap-3 sm:gap-6 mt-0 pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-thin">
          {topHeroes.map((hero, index) => (
            <div 
              key={index}
              className="min-w-[46%] sm:min-w-[42%] lg:min-w-0 flex-shrink-0 snap-start group bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-sm hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div>
                {/* Header: Name, Location & Blood Group */}
                <div className="flex items-start justify-between gap-1.5 mb-2.5 sm:mb-5">
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white mb-0.5 flex items-center gap-1 truncate">
                      <span className="truncate">{hero.name}</span>
                      <FaCheckCircle className="text-blue-500 w-3 h-3 flex-shrink-0" title="Verified Donor" />
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                      <FaMapMarkerAlt className="w-2.5 h-2.5 text-red-500 flex-shrink-0" /> 
                      <span className="truncate">{hero.location}</span>
                    </p>
                  </div>

                  {/* Blood Group Badge */}
                  <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 rounded-full flex items-center gap-0.5 shadow-sm flex-shrink-0">
                    <FaTint className="w-2.5 h-2.5" /> {hero.bloodGroup}
                  </span>
                </div>

                {/* Info Box */}
                <div className="space-y-1.5 sm:space-y-2 bg-white dark:bg-gray-900 p-2 sm:p-4 rounded-lg sm:rounded-2xl border border-gray-200 dark:border-gray-800 text-[10px] sm:text-xs mb-2.5 sm:mb-5 shadow-2xs">
                  <div className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-1.5 truncate">
                    <FaHospital className="text-red-500 w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Hospital: {hero.lastHospital}</span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-1.5 truncate">
                    <FaCalendarAlt className="text-red-500 w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Last Donated: {hero.lastDonatedDate}</span>
                  </div>
                </div>
              </div>

              {/* Total Donation Badge at Bottom */}
              <div className="w-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 rounded-lg sm:rounded-2xl py-1.5 sm:py-2.5 px-2 sm:px-4 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-bold text-red-600 dark:text-red-400 shadow-2xs">
                <FaHeart className="w-3 h-3 text-red-500 animate-pulse flex-shrink-0" />
                <span className="truncate">Total: {hero.totalDonations} times ({hero.totalBags} Bags)</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopHeroes;