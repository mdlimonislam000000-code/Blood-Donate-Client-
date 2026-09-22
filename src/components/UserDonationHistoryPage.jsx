"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaUserInjured,
  FaUserCheck,
  FaKey,
  FaCheckCircle,
  FaCopy,
} from "react-icons/fa";
import toast from "react-hot-toast";

const UserDonationHistoryPage = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const fetchDonationHistory = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/donation-history/${session.user.id}`,
        );
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

  // Filtering & Sorting logic
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

      if (sortOrder === "latest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Secret code copied to clipboard!");
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 px-4">
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">
          Please login first to view this page!
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight mb-1.5">
          Donation <span className="text-error">History</span>
        </h2>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
          View and track all the successful blood donations you have completed.
        </p>
      </div>

      {/* Search & Sorting Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 bg-white dark:bg-gray-900 p-3.5 md:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <input
            type="text"
            placeholder="Search by patient, donor, hospital, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full text-xs md:text-sm rounded-2xl bg-gray-50/50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 placeholder-gray-400 py-3.5 h-auto"
          />
        </div>
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-bordered w-full text-xs md:text-sm rounded-2xl bg-gray-50/50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 py-3.5 h-auto"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* History Cards Grid */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 px-4">
          <p className="text-sm md:text-base font-medium text-gray-400 dark:text-gray-500">
            No donation history found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                {/* Card Top Title & Badge */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-error flex items-center justify-center shrink-0">
                      <FaUserInjured size={14} />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white truncate">
                      {item.patientName}
                    </h3>
                  </div>
                  <span className="bg-red-600 text-white font-black px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 text-xs shrink-0 border border-red-500">
                    <FaTint size={10} className="text-red-200 animate-pulse" /> {item.bloodGroup}
                  </span>
                </div>

                {/* Compact Details List */}
                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 mb-3 flex-grow">
                  <div className="flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/60 px-2.5 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                      <FaUserInjured className="text-error" size={12} /> Patient:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium truncate max-w-[130px]">
                      {item.patientName || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/60 px-2.5 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                      <FaUserCheck className="text-emerald-500" size={12} /> Donor:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium truncate max-w-[130px]">
                      {item.donorName || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-gray-50/80 dark:bg-gray-800/60 px-2.5 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
                    <FaHospital className="text-error shrink-0" size={12} />
                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {item.hospitalName}
                    </span>
                    <span className="text-gray-300 dark:text-gray-700 font-light">|</span>
                    <FaMapMarkerAlt className="text-gray-400 shrink-0" size={11} />
                    <span className="text-gray-500 dark:text-gray-400 truncate">
                      {item.hospitalLocation}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="bg-gray-50/50 dark:bg-gray-800/40 px-2.5 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span className="font-semibold text-gray-400 text-[10px] block uppercase tracking-wider">Bags</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{item.bags} Bags</span>
                    </div>
                    {item.donatedDate && (
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/40 px-2.5 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[10px] block uppercase tracking-wider">Date</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px] truncate block">{item.donatedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secret Donation Code */}
                {item.donationCode && (
                  <div className="mb-3 px-3 py-2 bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                        <FaKey size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-red-400 tracking-wider">
                          Secret Code
                        </p>
                        <p className="text-xs font-mono font-bold tracking-widest text-red-700 dark:text-red-400 truncate">
                          {item.donationCode}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(item.donationCode)}
                      className="p-1.5 bg-white dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0 border border-red-100 dark:border-red-900/40"
                      title="Copy Secret Code"
                    >
                      <FaCopy size={12} />
                    </button>
                  </div>
                )}

                {/* Status Footer */}
                <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 -mx-4 md:-mx-5 -mb-4 md:-mb-5 px-4 md:px-5 py-2.5 rounded-b-3xl mt-auto flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                  <span className="font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] shadow-2xs">
                    <FaCheckCircle className="text-emerald-500" size={11} /> {item.status || "Completed"}
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

export default UserDonationHistoryPage;