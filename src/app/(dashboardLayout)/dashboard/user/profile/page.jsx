'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTint, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEdit, 
  FaHistory, 
  FaHeartbeat,
  FaShieldAlt,
  FaIdCard,
  FaCog
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import VarificationUser from '@/components/VarificationUser';
import { authClient } from '@/lib/auth-client';

const UserProfile = () => {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const currentUser = session?.user;

  // ইউজার ডেটা স্টেট
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    presentAddress: { division: "", district: "", upazila: "" },
    permanentAddress: { division: "", district: "", upazila: "" },
    lastDonationDate: "",
    totalDonations: 0,
    role: "user",
    image: ""
  });

  const [isEditingDonationDate, setIsEditingDonationDate] = useState(false);
  const [donationDateInput, setDonationDateInput] = useState("");
  const [donationCodeInput, setDonationCodeInput] = useState("");
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verifiedDetails, setVerifiedDetails] = useState(null);
  const [updating, setUpdating] = useState(false);

  // সেশন থেকে ইউজারের রিয়েল ডাটা সেট করা
  useEffect(() => {
    if (currentUser) {
      const initialData = {
        name: currentUser.name || currentUser.fullName || "N/A",
        email: currentUser.email || "N/A",
        phone: currentUser.phone || "N/A",
        bloodGroup: currentUser.bloodGroup || "N/A",
        presentAddress: currentUser.presentAddress || { division: "", district: "", upazila: "" },
        permanentAddress: currentUser.permanentAddress || { division: "", district: "", upazila: "" },
        lastDonationDate: currentUser.lastDonationDate ? currentUser.lastDonationDate.split('T')[0] : "",
        totalDonations: currentUser.totalDonations || 0,
        role: currentUser.role || "user",
        image: currentUser.image || currentUser.userImage || currentUser.photoURL || ""
      };
      setUserData(initialData);
      setDonationDateInput(currentUser.lastDonationDate ? currentUser.lastDonationDate.split('T')[0] : "");
    }
  }, [currentUser]);

  // ব্যাকএন্ড থেকে ইউজারের ভেরিফিকেশন স্ট্যাটাস ও ডেটা ফেচ করা
  useEffect(() => {
    const fetchStatus = async () => {
      const userId = currentUser?._id || currentUser?.id;
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/verify-nid/status/${userId}`);
        const data = await res.json();
        if (res.ok && data.success && data.verification) {
          setVerificationStatus(data.verification.status?.toLowerCase());
          setVerifiedDetails(data.verification);

          if (data.verification.lastDonationDate) {
            setUserData(prev => ({
              ...prev,
              lastDonationDate: data.verification.lastDonationDate.split('T')[0],
              totalDonations: data.verification.totalDonations ?? prev.totalDonations
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching status:', err);
      }
    };

    if (currentUser) {
      fetchStatus();
    }
  }, [currentUser]);

  // ৩ মাস (৯০ দিন) পূর্ণ হয়েছে কিনা তা চেক করার ফাংশন
  const checkAvailability = (donationDate) => {
    if (!donationDate) return true;
    const lastDate = new Date(donationDate);
    const today = new Date();
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90;
  };

  const displayName = verifiedDetails?.fullName || userData.name;
  const displayPhone = verifiedDetails?.phone || userData.phone;
  const displayBlood = verifiedDetails?.bloodGroup || userData.bloodGroup;
  const displayPresentAddr = verifiedDetails?.presentAddress || userData.presentAddress;
  const displayPermanentAddr = verifiedDetails?.permanentAddress || userData.permanentAddress;
  const displayLastDonationDate = verifiedDetails?.lastDonationDate ? verifiedDetails.lastDonationDate.split('T')[0] : userData.lastDonationDate;
  const displayTotalDonations = verifiedDetails?.totalDonations ?? userData.totalDonations;
  
  const displayAvatar = verifiedDetails?.image || verifiedDetails?.userImage || userData.image;
  const isAvailableForDonation = checkAvailability(displayLastDonationDate);

  // ডোনেশন কোড ভেরিফাই এবং ডেটা আপডেট করার হ্যান্ডলার
  const handleVerifyAndCompleteDonation = async () => {
    if (!donationCodeInput || donationCodeInput.length !== 6) {
      toast.error("Please enter a valid 6-digit donation code.");
      return;
    }
    if (!donationDateInput) {
      toast.error("Please select a donation date.");
      return;
    }

    const selectedDate = new Date(donationDateInput);
    const today = new Date();

    if (selectedDate > today) {
      toast.error("Donation date cannot be in the future!");
      return;
    }

    setUpdating(true);
    const userId = currentUser?._id || currentUser?.id;

    try {
      const res = await fetch(`http://localhost:5000/api/blood-requests/verify-and-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          donationCode: donationCodeInput,
          donationDate: donationDateInput
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const newTotal = Number(displayTotalDonations) + 1;
        setUserData(prev => ({
          ...prev,
          lastDonationDate: donationDateInput,
          totalDonations: newTotal
        }));
        if (verifiedDetails) {
          setVerifiedDetails(prev => ({
            ...prev,
            lastDonationDate: donationDateInput,
            totalDonations: newTotal
          }));
        }
        setIsEditingDonationDate(false);
        setDonationCodeInput("");
        toast.success("Donation verified successfully! Profile and history updated.");
      } else {
        toast.error(data.message || "Failed to verify donation code.");
      }
    } catch (err) {
      console.error("Error verifying donation:", err);
      toast.error("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">

      {/* Top Banner / Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-gray-700 overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">

          <div className="relative">
            {displayAvatar ? (
              <img 
                src={displayAvatar} 
                alt={displayName} 
                className="w-28 h-28 rounded-full object-cover border-4 border-red-500 shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-red-500 shadow-md flex items-center justify-center text-gray-400 font-bold text-xl">
                {displayName?.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-0 right-0 bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow border-2 border-white dark:border-gray-800 flex items-center gap-1">
              <FaTint /> {displayBlood}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {displayName}
                {userData.role === 'admin' && (
                  <span className="bg-red-100 dark:bg-gray-700 text-red-600 dark:text-red-400 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase flex items-center gap-1">
                    <FaShieldAlt /> Admin
                  </span>
                )}
              </h1>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                {verificationStatus === 'accepted' || verificationStatus === 'approved' ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-lg">
                    <FaCheckCircle /> Verified Profile
                  </span>
                ) : verificationStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-lg">
                    Verification Pending
                  </span>
                ) : (
                  <button
                    onClick={() => setIsVerificationOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    <FaIdCard /> Verify Profile
                  </button>
                )}

                <button
                  onClick={() => router.push('/dashboard/user/settings')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                >
                  <FaCog /> Settings
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
              <FaMapMarkerAlt className="text-red-500" /> {displayPresentAddr?.upazila || 'Upazila'}, {displayPresentAddr?.district || 'District'}, {displayPresentAddr?.division || 'Division'}
            </p>

            <div className="pt-2 flex justify-center sm:justify-start">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isAvailableForDonation 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}
              >
                {isAvailableForDonation ? <FaCheckCircle /> : <FaTimesCircle />}
                {isAvailableForDonation ? "Available to Donate" : "Not Available (3 months not completed)"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-xl text-xl">
            <FaHeartbeat />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Total Donations</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{displayTotalDonations} Times</p>
          </div>
        </div>

        {/* Last Donation Date Card with Edit Button */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-xl text-xl">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Last Donation Date</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{displayLastDonationDate || "Not Donated Yet"}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setDonationDateInput(displayLastDonationDate || new Date().toISOString().split('T')[0]);
              setIsEditingDonationDate(!isEditingDonationDate);
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Verify & Update Last Donation Date"
          >
            <FaEdit />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-xl text-xl">
            <FaHistory />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Account Status</p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">Active</p>
          </div>
        </div>
      </div>

      {/* Donation Code & Date Verification Box (Toggleable) */}
      {isEditingDonationDate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-red-200 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaIdCard className="text-red-500" /> Verify Donation Code & Update Date
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Donation Date</label>
              <input 
                type="date" 
                value={donationDateInput}
                onChange={(e) => setDonationDateInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">6-Digit Donation Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit code"
                value={donationCodeInput}
                onChange={(e) => setDonationCodeInput(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Note: Providing a valid active donation code from the blood request is mandatory to verify and update your donation history.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingDonationDate(false)}
              disabled={updating}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerifyAndCompleteDonation}
              disabled={updating}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {updating ? 'Verifying...' : 'Verify & Save'}
            </button>
          </div>
        </div>
      )}

      {/* Personal Details View */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-gray-700 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-gray-700 text-red-600 rounded-lg">
              <FaEnvelope />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Address</p>
              <p className="font-semibold text-gray-800 dark:text-white">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-gray-700 text-red-600 rounded-lg">
              <FaPhone />
            </div>
            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="font-semibold text-gray-800 dark:text-white">{displayPhone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-gray-700 text-red-600 rounded-lg mt-1">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="text-xs text-gray-400">Present Address</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {displayPresentAddr?.upazila || 'N/A'}, {displayPresentAddr?.district || 'N/A'}, {displayPresentAddr?.division || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-gray-700 text-red-600 rounded-lg mt-1">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="text-xs text-gray-400">Permanent Address</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {displayPermanentAddr?.upazila || 'N/A'}, {displayPermanentAddr?.district || 'N/A'}, {displayPermanentAddr?.division || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-gray-700 text-red-600 rounded-lg">
              <FaTint />
            </div>
            <div>
              <p className="text-xs text-gray-400">Blood Group</p>
              <p className="font-semibold text-gray-800 dark:text-white">{displayBlood}</p>
            </div>
          </div>

          {verifiedDetails?.nidNumber && (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 dark:bg-gray-700 text-red-600 rounded-lg">
                <FaIdCard />
              </div>
              <div>
                <p className="text-xs text-gray-400">NID Number</p>
                <p className="font-semibold text-gray-800 dark:text-white">{verifiedDetails.nidNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NID Verification Modal */}
      <VarificationUser 
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onStatusChange={(status) => setVerificationStatus(status?.toLowerCase())}
      />

    </div>
  );
};

export default UserProfile;