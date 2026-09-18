'use client';
import React, { useState } from 'react';
import { 
  FaPhoneAlt, 
  FaHospital, 
  FaMapMarkerAlt, 
  FaTint, 
  FaUserInjured, 
  FaSearch, 
  FaFilter, 
  FaNotesMedical, 
  FaHeartbeat
} from 'react-icons/fa';

const BloodRequestsPage = ({ initialRequests = [] }) => {
  const [bloodRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  // Filtering Logic
  const filteredRequests = bloodRequests.filter((item) => {
    const matchesSearch = 
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hospitalLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedBloodGroup ? item.bloodGroup === selectedBloodGroup : true;

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Top Hero Banner Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
          <FaHeartbeat size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2.5 border border-white/20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            Emergency Blood Request
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-1.5">
            Urgent Blood Requests
          </h1>
          <p className="text-xs md:text-sm text-red-100 font-medium leading-relaxed">
            Browse active blood donation requests below. If your blood group matches or you are available to donate, please contact the guardian directly.
          </p>
        </div>
      </div>

      {/* Compact Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl shadow-2xs border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-2/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by patient name, hospital or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
          />
        </div>

        {/* Blood Group Filter Dropdown */}
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <FaFilter size={12} />
          </span>
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all cursor-pointer shadow-2xs"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A (+ve)</option>
            <option value="A-">A (-ve)</option>
            <option value="B+">B (+ve)</option>
            <option value="B-">B (-ve)</option>
            <option value="AB+">AB (+ve)</option>
            <option value="AB-">AB (-ve)</option>
            <option value="O+">O (+ve)</option>
            <option value="O-">O (-ve)</option>
          </select>
        </div>
      </div>

      {/* Requests Cards Grid */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FaTint size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">
            No emergency blood requests found
          </h3>
          <p className="text-xs text-gray-400">
            There are no active requests matching your filter right now. Try searching with different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Patient Image if available */}
              {req.patientImage && (
                <div className="h-40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-70"></div>
                  <img
                    src={req.patientImage}
                    alt={req.patientName || "Patient"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 z-20 flex justify-between items-center text-white">
                    <span className="text-[11px] font-semibold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      {req.bags} Bag(s) Required
                    </span>
                  </div>
                </div>
              )}

              {/* Card Main Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Title & Blood Group Badge */}
                  <div className="flex justify-between items-start gap-2.5 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <FaUserInjured size={14} />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                          {req.patientName}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-medium">Patient Details</p>
                      </div>
                    </div>
                    
                    <span className="bg-red-600 text-white font-black px-3 py-1 rounded-lg shadow-2xs flex items-center gap-1 text-xs shrink-0">
                      <FaTint size={10} /> {req.bloodGroup}
                    </span>
                  </div>

                  {/* Info Details List (Compact) */}
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50/60 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-start gap-2">
                      <FaHospital className="text-red-500 shrink-0 mt-0.5" size={12} />
                      <div className="truncate">
                        <span className="font-bold text-gray-700 dark:text-gray-200">Hospital: </span>
                        <span>{req.hospitalName}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-red-500 shrink-0 mt-0.5" size={12} />
                      <div className="truncate">
                        <span className="font-bold text-gray-700 dark:text-gray-200">Location: </span>
                        <span>{req.hospitalLocation}</span>
                      </div>
                    </div>

                    {!req.patientImage && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                        <span className="font-bold text-gray-700 dark:text-gray-200">Required Bags:</span>
                        <span className="font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[11px]">{req.bags} Bag(s)</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                      <FaNotesMedical className="text-gray-400 shrink-0 mt-0.5" size={12} />
                      <div className="truncate">
                        <span className="font-bold text-gray-700 dark:text-gray-200">Disease/Condition: </span>
                        <span className="text-gray-500 dark:text-gray-400">{req.disease || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                      <span className="font-bold text-gray-700 dark:text-gray-200">Patient Phone:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{req.patientPhone || "Not provided"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700 dark:text-gray-200">Guardian Contact:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{req.guardianPhone}</span>
                    </div>
                  </div>

                  {/* Additional Notes Box */}
                  {req.additionalNotes && (
                    <div className="mt-2.5 p-2.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
                      <span className="font-bold">Note: </span>
                      {req.additionalNotes}
                    </div>
                  )}
                </div>

                {/* Call Action Button */}
                <div className="pt-1">
                  <a
                    href={`tel:${req.guardianPhone}`}
                    className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm shadow-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaPhoneAlt size={10} /> Call Guardian Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodRequestsPage;