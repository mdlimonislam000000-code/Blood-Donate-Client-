'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaTint, 
  FaPhoneAlt, 
  FaCheckCircle, 
  FaHome, 
  FaCalendarAlt,
  FaHeartbeat
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import LocationFilter from '@/components/LocationFilter';

const AllDonorPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  // Fetch accepted donors from backend
  useEffect(() => {
    const fetchAcceptedDonors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/nid-verifications?status=accepted",
        );
        const data = await response.json();

        if (response.ok) {
          setDonors(data.data || []);
        } else {
          toast.error(data.message || "Failed to fetch donors");
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
        toast.error("Something went wrong while fetching donors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedDonors();
  }, []);

  // 3-month availability check logic
  const checkIsAvailable = (lastDonationDate) => {
    if (!lastDonationDate) return true;

    const lastDate = new Date(lastDonationDate);
    const currentDate = new Date();

    const diffTime = currentDate - lastDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 90) {
      return false;
    }
    return true;
  };

  // Filter logic
  const filteredDonors = donors.filter((donor) => {
    const fullName = (donor.fullName || donor.name || "").toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const div =
      donor.presentAddress?.division || donor.division || donor.bivag || "";
    const dist =
      donor.presentAddress?.district || donor.district || donor.jela || "";
    const upa =
      donor.presentAddress?.upazila || donor.upazila || donor.upozela || "";

    const matchesDivision = selectedDivision
      ? div.toLowerCase() === selectedDivision.toLowerCase()
      : true;
    const matchesDistrict = selectedDistrict
      ? dist.toLowerCase() === selectedDistrict.toLowerCase()
      : true;
    const matchesUpazila = selectedUpazila
      ? upa.toLowerCase() === selectedUpazila.toLowerCase()
      : true;

    return (
      matchesSearch && matchesDivision && matchesDistrict && matchesUpazila
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Hero Banner Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl p-5 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
          <FaHeartbeat size={220} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2.5 border border-white/20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            Verified Donors Directory
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-1.5">
            Available Blood Donors
          </h1>
          <p className="text-xs md:text-sm text-red-100 font-medium leading-relaxed">
            Find verified and trusted blood donors instantly by name and location to save lives.
          </p>
        </div>
      </div>

      {/* Filter Section: Mobile এ এক লাইনে ২ টা বা সুন্দর রেসপন্সিভ গ্রিড লেআউট */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xs border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* Name Search Input (Mobile এ ২ কলাম জুড়ে থাকবে অথবা ফিট হবে) */}
          <div className="relative w-full col-span-2 md:col-span-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
            />
          </div>

          {/* Location Filters Container - Mobile এ দুই কলামে ভাগ করার জন্য */}
          <div className="col-span-2 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <LocationFilter
              selectedDivision={selectedDivision}
              setSelectedDivision={setSelectedDivision}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedUpazila={selectedUpazila}
              setSelectedUpazila={setSelectedUpazila}
            />
          </div>
        </div>
      </div>

      {/* Donors List Section */}
      {loading ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-sm text-gray-500">
          Loading verified donors...
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FaTint size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">
            No verified donors found
          </h3>
          <p className="text-xs text-gray-400">
            There are no donors matching your specified criteria right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => {
            const donorImage =
              donor.image ||
              donor.userImage ||
              "https://i.ibb.co/Wvn88YHn/Hero-jpg.png";
            const donorName = donor.fullName || donor.name || "Anonymous Donor";

            // Present Address
            const presDiv =
              donor.presentAddress?.division || donor.division || "";
            const presDist =
              donor.presentAddress?.district || donor.district || "";
            const presUpa =
              donor.presentAddress?.upazila || donor.upazila || "";

            // Permanent Address
            const permDiv = donor.permanentAddress?.division || "";
            const permDist = donor.permanentAddress?.district || "";
            const permUpa = donor.permanentAddress?.upazila || "";

            // Last Donation Date & Availability Logic
            const lastDonation = donor.lastDonationDate || "";
            const isAvailable = checkIsAvailable(lastDonation);

            return (
              <div
                key={donor._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xs hover:shadow-md border border-gray-100 dark:border-gray-700 space-y-3.5 flex flex-col justify-between transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Top Header inside card: Image, Name, Blood Group & Dynamic Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={donorImage}
                        alt={donorName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-2xs shrink-0"
                      />
                      <div>
                        <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-1 tracking-tight">
                          {donorName}
                          <FaCheckCircle
                            className="text-blue-500 text-[11px]"
                            title="Verified Donor"
                          />
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-[11px] rounded-full mt-1">
                          <FaTint size={10} /> {donor.bloodGroup || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Available/Not Ready badge & Last donation date */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          isAvailable
                            ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isAvailable ? "Available" : "Not Ready"}
                      </span>

                      <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                        <FaCalendarAlt className="text-red-500 text-[9px]" />
                        <span>Last: {lastDonation ? lastDonation : "Not yet"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 p-2.5 rounded-xl">
                    <p className="flex items-start gap-1.5">
                      <FaMapMarkerAlt className="text-red-500 shrink-0 mt-0.5" size={12} />
                      <span className="truncate">
                        <strong className="text-gray-700 dark:text-gray-200">Present:</strong>{" "}
                        {`${presUpa}, ${presDist}, ${presDiv}`}
                      </span>
                    </p>
                    {permDist && (
                      <p className="flex items-start gap-1.5">
                        <FaHome className="text-blue-500 shrink-0 mt-0.5" size={12} />
                        <span className="truncate">
                          <strong className="text-gray-700 dark:text-gray-200">Permanent:</strong>{" "}
                          {`${permUpa}, ${permDist}, ${permDiv}`}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 pt-1">
                    <p className="truncate">
                      <strong className="text-gray-700 dark:text-gray-200">Email:</strong> {donor.email || "N/A"}
                    </p>
                    <p>
                      <strong className="text-gray-700 dark:text-gray-200">Phone:</strong>{" "}
                      {donor.phone || donor.mobile || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Call Action Button */}
                <div className="pt-1">
                  <a
                    href={`tel:${donor.phone || donor.mobile || ""}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-red-500/20 cursor-pointer"
                  >
                    <FaPhoneAlt className="rotate-90 text-[10px]" /> Call Donor
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllDonorPage;