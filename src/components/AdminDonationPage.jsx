'use client'
import React, { useEffect, useState } from 'react';
import { FaTint, FaFileAlt, FaHospital, FaUser, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const AdminDonationPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/donation-history/all`);
        const data = await response.json();
        
        if (data.success) {
          setDonations(data.data);
        } else {
          setError(data.message || 'Failed to fetch donation records.');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to connect to the server.');
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
        <span className="loading loading-spinner loading-lg text-rose-600"></span>
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse text-xs">Loading records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center rounded-2xl shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">Sorry! An Error Occurred</h3>
        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 shrink-0 mt-0.5 sm:mt-0">
            <FaTint size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              Donation & Blood History
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
              View all successful blood donation lists and patient details here.
            </p>
          </div>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-100 dark:border-rose-900/50 text-center">
            <span className="block text-[10px] font-semibold uppercase opacity-75">Total Records</span>
            {donations.length}
          </div>
          <div className="flex-1 sm:flex-none bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-center">
            <span className="block text-[10px] font-semibold uppercase opacity-75">Total Blood</span>
            {totalBags} Bags
          </div>
        </div>
      </div>
      
      {donations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <FaFileAlt className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={40} />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No donation records found.</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">New donations will appear here once completed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <table className="table w-full border-collapse text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-center">#</th>
                <th className="py-3.5 px-4">Patient & Hospital</th>
                <th className="py-3.5 px-4">Group</th>
                <th className="py-3.5 px-4">Bags</th>
                <th className="py-3.5 px-4">Donor Info</th>
                <th className="py-3.5 px-4">Location & Code</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {donations.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">{index + 1}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{item.patientName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <FaHospital size={10} className="text-slate-400" /> {item.hospitalName}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900/30">
                      <FaTint size={10} /> {item.bloodGroup}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {item.bags} Bags
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <FaUser size={10} className="text-slate-400" /> {item.donorName}
                    </div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5 flex items-center gap-1">
                      <FaEnvelope size={10} /> {item.donorEmail}
                    </div>
                  </td>

                  {/* Location & Code */}
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 max-w-[180px] truncate flex items-center gap-1" title={item.hospitalLocation}>
                      <FaMapMarkerAlt size={10} className="text-slate-400 shrink-0" /> <span className="truncate">{item.hospitalLocation || 'N/A'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                      Code: <span className="text-slate-600 dark:text-slate-300 font-semibold">{item.donationCode}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {item.donatedDate || new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 font-semibold text-[10px] px-2.5 py-1 rounded-lg capitalize">
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