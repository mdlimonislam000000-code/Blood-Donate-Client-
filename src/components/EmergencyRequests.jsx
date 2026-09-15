'use client';
import React, { useState, useEffect } from 'react';
import { FaTint, FaHospital, FaMapMarkerAlt, FaPhoneAlt, FaSpinner, FaArrowRight, FaUser } from 'react-icons/fa';
import Link from 'next/link';

const EmergencyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blood-requests');
        const data = await response.json();
        
        if (data.success) {
          setTotalCount(data.data.length); // মোট কয়টি ডাটা আছে তা সেভ করছি
          setRequests(data.data.slice(0, 4)); // সর্বোচ্চ ৪টি কার্ড দেখানোর জন্য
        }
      } catch (error) {
        console.error("Error fetching blood requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodRequests();
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 mb-2 border border-red-200 dark:border-red-900/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              LIVE EMERGENCY
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Emergency Blood Requests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Patients who urgently need blood. Your small help can save a life.
            </p>
          </div>
          
          <Link 
            href="/blood-requests" 
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-red-600 hover:border-red-600 hover:text-white font-medium text-sm transition-all shadow-sm"
          >
            <span>View All</span>
            <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No emergency blood requests found at the moment.</p>
          </div>
        ) : (
          <>
            {/* Cards Grid - 4 Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {requests.map((req) => (
                <div 
                  key={req._id} 
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Blood Group Row */}
                    <div className="flex items-center gap-3 mb-4">
                      {req.image ? (
                        <img 
                          src={req.image} 
                          alt={req.patientName} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-red-500 shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 border-2 border-red-500 shrink-0">
                          <FaUser className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                          {req.patientName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                            <FaTint className="w-2.5 h-2.5" /> {req.bloodGroup}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {req.bags} Bag(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Info */}
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 mb-5 border-t border-gray-100 dark:border-gray-800 pt-3">
                      <div className="flex items-start gap-2">
                        <FaHospital className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        <span className="truncate">হাসপাতাল: {req.hospitalName || req.hospital}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">লোকেশন: {req.hospitalLocation || req.location}</span>
                      </div>

                      {req.details && (
                        <p className="text-gray-500 dark:text-gray-400 truncate">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">বিবরণ:</span> {req.details}
                        </p>
                      )}

                      {req.guardian && (
                        <p className="text-gray-500 dark:text-gray-400 truncate">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">অভিভাবক:</span> {req.guardian}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Call Button */}
                  <a 
                    href={`tel:${req.contactNumber || req.contact}`}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-red-500/20 transition-all text-xs cursor-pointer"
                  >
                    <FaPhoneAlt className="w-3 h-3" />
                    <span>Call: {req.contactNumber || req.contact}</span>
                  </a>

                </div>
              ))}
            </div>

            {/* See More Button (যদি ৪টির বেশি ডাটা থাকে তবেই দেখাবে) */}
            {totalCount > 4 && (
              <div className="flex justify-center mt-10">
                <Link 
                  href="/blood-requests" 
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105"
                >
                  <span>See More Requests</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

export default EmergencyRequests;