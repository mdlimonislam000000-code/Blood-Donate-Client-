'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaTint, FaPhoneAlt, FaCheckCircle, FaHome, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LocationFilter from '@/components/LocationFilter';

const AllDoner = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // সার্চ এবং ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');

  // ব্যাকএন্ড থেকে accepted ডোনারদের ডাটা ফেচ করা
  useEffect(() => {
    const fetchAcceptedDonors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/nid-verifications?status=accepted');
        const data = await response.json();

        if (response.ok) {
          setDonors(data.data || []);
        } else {
          toast.error(data.message || 'Failed to fetch donors');
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
        toast.error('Something went wrong while fetching donors.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedDonors();
  }, []);

  // ৩ মাসের হিসাব চেক করার ফাংশন
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

  // নিখুঁত ফিল্টারিং লজিক
  const filteredDonors = donors.filter((donor) => {
    const fullName = (donor.fullName || donor.name || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const div = donor.presentAddress?.division || donor.division || donor.bivag || '';
    const dist = donor.presentAddress?.district || donor.district || donor.jela || '';
    const upa = donor.presentAddress?.upazila || donor.upazila || donor.upozela || '';

    const matchesDivision = selectedDivision ? div.toLowerCase() === selectedDivision.toLowerCase() : true;
    const matchesDistrict = selectedDistrict ? dist.toLowerCase() === selectedDistrict.toLowerCase() : true;
    const matchesUpazila = selectedUpazila ? upa.toLowerCase() === selectedUpazila.toLowerCase() : true;

    return matchesSearch && matchesDivision && matchesDistrict && matchesUpazila;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Blood Donors</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Find verified blood donors by name and location.</p>
      </div>

      {/* ফিল্টার সেকশন */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        
        {/* নাম দিয়ে সার্চ */}
        <div className="relative w-full">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
          />
        </div>

        {/* লোকেশন ফিল্টার কম্পোনেন্ট */}
        <LocationFilter 
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedUpazila={selectedUpazila}
          setSelectedUpazila={setSelectedUpazila}
        />

      </div>

      {/* ডোনার লিস্ট */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading verified donors...</div>
      ) : filteredDonors.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No verified donors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => {
            const donorImage = donor.image || donor.userImage || 'https://i.ibb.co/Wvn88YHn/Hero-jpg.png';
            const donorName = donor.fullName || donor.name || 'Anonymous Donor';
            
            // Present Address
            const presDiv = donor.presentAddress?.division || donor.division || '';
            const presDist = donor.presentAddress?.district || donor.district || '';
            const presUpa = donor.presentAddress?.upazila || donor.upazila || '';

            // Permanent Address
            const permDiv = donor.permanentAddress?.division || '';
            const permDist = donor.permanentAddress?.district || '';
            const permUpa = donor.permanentAddress?.upazila || '';

            // Last Donation Date & Dynamic Availability Logic (৩ মাস ভিত্তিক)
            const lastDonation = donor.lastDonationDate || '';
            const isAvailable = checkIsAvailable(lastDonation);

            return (
              <div 
                key={donor._id} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* ওপরের সাইডে: ছবি, নাম, রক্তের গ্রুপ এবং ডানপাশে ডাইনামিক স্ট্যাটাস */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={donorImage} 
                        alt={donorName} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-red-500 shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                          {donorName}
                          <FaCheckCircle className="text-blue-500 text-xs" title="Verified Donor" />
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-full mt-1">
                          <FaTint className="inline mr-1" /> {donor.bloodGroup || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* ডানপাশে ওপরের দিকে Available বা Not Ready ব্যাজ এবং তার ঠিক নিচে Last Donation */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                        isAvailable 
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                      }`}>
                        {isAvailable ? 'Available' : 'Not Ready'}
                      </span>

                      <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                        <FaCalendarAlt className="text-red-500 text-[10px]" />
                        <span>Last: {lastDonation ? lastDonation : 'Not yet'}</span>
                      </span>
                    </div>
                  </div>

                  {/* ঠিকানা অংশ (Present & Permanent) */}
                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="flex items-start gap-1.5">
                      <FaMapMarkerAlt className="text-red-500 flex-shrink-0 mt-0.5" /> 
                      <span><strong>Present:</strong> {`${presUpa}, ${presDist}, ${presDiv}`}</span>
                    </p>
                    {permDist && (
                      <p className="flex items-start gap-1.5">
                        <FaHome className="text-blue-500 flex-shrink-0 mt-0.5" /> 
                        <span><strong>Permanent:</strong> {`${permUpa}, ${permDist}, ${permDiv}`}</span>
                      </p>
                    )}
                  </div>

                  {/* কন্টাক্ট ইনফো */}
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p><strong>Email:</strong> {donor.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {donor.phone || donor.mobile || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${donor.phone || donor.mobile || ''}`}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                  >
                    <FaPhoneAlt className="rotate-90 text-[11px]" /> Call Donor
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

export default AllDoner;