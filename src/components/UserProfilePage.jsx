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
  FaHeartbeat,
  FaShieldAlt,
  FaIdCard,
  FaCog,
  FaHeart
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import VarificationUser from '@/components/VarificationUser';
import { authClient } from '@/lib/auth-client';

const UserProfilePage = () => {
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
    image: "",
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
        presentAddress: currentUser.presentAddress || {
          division: "",
          district: "",
          upazila: "",
        },
        permanentAddress: currentUser.permanentAddress || {
          division: "",
          district: "",
          upazila: "",
        },
        lastDonationDate: currentUser.lastDonationDate
          ? currentUser.lastDonationDate.split("T")[0]
          : "",
        totalDonations: currentUser.totalDonations || 0,
        role: currentUser.role || "user",
        image:
          currentUser.image ||
          currentUser.userImage ||
          currentUser.photoURL ||
          "",
      };
      setUserData(initialData);
      setDonationDateInput(
        currentUser.lastDonationDate
          ? currentUser.lastDonationDate.split("T")[0]
          : "",
      );
    }
  }, [currentUser]);

  // ব্যাকএন্ড থেকে ইউজারের ভেরিফিকেশন স্ট্যাটাস ও ডেটা ফেচ করা
  useEffect(() => {
    const fetchStatus = async () => {
      const userId = currentUser?._id || currentUser?.id;
      if (!userId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-nid/status/${userId}`,
        );
        const data = await res.json();
        if (res.ok && data.success && data.verification) {
          setVerificationStatus(data.verification.status?.toLowerCase());
          setVerifiedDetails(data.verification);

          if (data.verification.lastDonationDate) {
            setUserData((prev) => ({
              ...prev,
              lastDonationDate:
                data.verification.lastDonationDate.split("T")[0],
              totalDonations:
                data.verification.totalDonations ?? prev.totalDonations,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching status:", err);
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
  const displayPresentAddr =
    verifiedDetails?.presentAddress || userData.presentAddress;
  const displayPermanentAddr =
    verifiedDetails?.permanentAddress || userData.permanentAddress;
  const displayLastDonationDate = verifiedDetails?.lastDonationDate
    ? verifiedDetails.lastDonationDate.split("T")[0]
    : userData.lastDonationDate;
  const displayTotalDonations =
    verifiedDetails?.totalDonations ?? userData.totalDonations;
  const displayAvatar =
    verifiedDetails?.image || verifiedDetails?.userImage || userData.image;

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blood-requests/verify-and-complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            donationCode: donationCodeInput,
            donationDate: donationDateInput,
          }),
        },
      );

      const data = await res.json();

      if (res.ok && data.success) {
        const newTotal = Number(displayTotalDonations) + 1;
        setUserData((prev) => ({
          ...prev,
          lastDonationDate: donationDateInput,
          totalDonations: newTotal,
        }));
        if (verifiedDetails) {
          setVerifiedDetails((prev) => ({
            ...prev,
            lastDonationDate: donationDateInput,
            totalDonations: newTotal,
          }));
        }
        setIsEditingDonationDate(false);
        setDonationCodeInput("");
        toast.success(
          "Donation verified successfully! Profile and history updated.",
        );
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
    <div className="space-y-4 max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      
      {/* Profile Header Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 sm:p-7">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 relative z-10 text-center sm:text-left">
          
          {/* Avatar Section */}
          <div className="relative shrink-0">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-red-500/20 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl">
                {displayName?.charAt(0)}
              </div>
            )}
            <span className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow text-red-500">
              <FaHeart size={12} />
            </span>
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 w-full space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {displayName}
                  </h1>
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-red-500/20">
                    <FaTint /> {displayBlood}
                  </span>
                  {userData.role === "admin" && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase flex items-center gap-1">
                      <FaShieldAlt /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1">
                  <FaMapMarkerAlt className="text-red-500 shrink-0" /> 
                  <span className="truncate max-w-[260px] sm:max-w-md font-medium">
                    {displayPresentAddr?.upazila || "Upazila"}, {displayPresentAddr?.district || "District"}, {displayPresentAddr?.division || "Division"}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 flex-wrap pt-1 sm:pt-0">
                {verificationStatus === "accepted" || verificationStatus === "approved" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                    <FaCheckCircle /> Verified
                  </span>
                ) : verificationStatus === "pending" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl border border-amber-500/20">
                    Pending
                  </span>
                ) : (
                  <button
                    onClick={() => setIsVerificationOpen(true)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    <FaIdCard /> Verify NID
                  </button>
                )}

                <button
                  onClick={() => router.push("/dashboard/user/settings")}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all cursor-pointer border border-gray-200/50 dark:border-gray-600"
                >
                  <FaCog /> Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid (কম্প্যাক্ট সাইজ) */}
      <div className="grid grid-cols-2 gap-3 max-w-xl">
        
        {/* Total Donations Card */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-2.5">
          <div className="hidden sm:flex p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-base shrink-0 shadow-inner items-center justify-center">
            <FaHeartbeat />
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider">
              Total Donations
            </p>
            <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mt-0.5 truncate">
              {displayTotalDonations} Times
            </p>
          </div>
        </div>

        {/* Last Donation Date Card */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex flex-col justify-between">
          <p className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider">
            Last Donation
          </p>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">
              {displayLastDonationDate || "Not Yet"}
            </p>
            <button
              onClick={() => {
                setDonationDateInput(
                  displayLastDonationDate ||
                    new Date().toISOString().split("T")[0],
                );
                setIsEditingDonationDate(!isEditingDonationDate);
              }}
              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-200 shrink-0"
              title="Update Last Donation Date"
            >
              <FaEdit size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* Donation Availability Status Banner */}
      <div
        className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all shadow-sm ${
          isAvailableForDonation
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
            : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40"
        }`}
      >
        <span className="text-sm shrink-0">
          {isAvailableForDonation ? <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" /> : <FaTimesCircle className="text-rose-600 dark:text-rose-400" />}
        </span>
        <span className="leading-tight">
          {isAvailableForDonation
            ? "You are currently available to donate blood."
            : "Not available right now (3 months gap not completed)."}
        </span>
      </div>

      {/* Donation Code & Date Verification Box */}
      {isEditingDonationDate && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-red-200 dark:border-gray-700 shadow-xl space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaIdCard className="text-red-500" /> Verify Donation Code & Update Date
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">
                Donation Date
              </label>
              <input
                type="date"
                value={donationDateInput}
                onChange={(e) => setDonationDateInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">
                6-Digit Donation Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={donationCodeInput}
                onChange={(e) => setDonationCodeInput(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Note: Providing a valid active donation code is mandatory to update your history.
          </p>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingDonationDate(false)}
              disabled={updating}
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerifyAndCompleteDonation}
              disabled={updating}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/25 cursor-pointer disabled:opacity-50"
            >
              {updating ? "Verifying..." : "Verify & Save"}
            </button>
          </div>
        </div>
      )}

      {/* Personal Details Card (Updated to Responsive Grid Layout for a cleaner look) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
        <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-3.5 border-b border-gray-100 dark:border-gray-700 pb-2.5 flex items-center justify-between">
          <span>Personal Details</span>
          <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">Secure Info</span>
        </h2>

        {/* নিচের grid ক্লাসের মাধ্যমে মোবাইল ও ডেক্সটপে টু-কলাম বা সুন্দর গ্রিড আকারে দেখাবে */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-700/25 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 bg-red-50 dark:bg-gray-700 text-red-600 rounded-xl shrink-0 shadow-sm">
              <FaEnvelope size={13} />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Email Address</p>
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {userData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-700/25 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 bg-red-50 dark:bg-gray-700 text-red-600 rounded-xl shrink-0 shadow-sm">
              <FaPhone size={13} />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Phone Number</p>
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {displayPhone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-700/25 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 bg-red-50 dark:bg-gray-700 text-red-600 rounded-xl mt-0.5 shrink-0 shadow-sm">
              <FaMapMarkerAlt size={13} />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Present Address</p>
              <p className="font-bold text-gray-900 dark:text-white leading-snug truncate">
                {displayPresentAddr?.upazila || "N/A"}, {displayPresentAddr?.district || "N/A"}, {displayPresentAddr?.division || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-700/25 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 bg-red-50 dark:bg-gray-700 text-red-600 rounded-xl mt-0.5 shrink-0 shadow-sm">
              <FaMapMarkerAlt size={13} />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Permanent Address</p>
              <p className="font-bold text-gray-900 dark:text-white leading-snug truncate">
                {displayPermanentAddr?.upazila || "N/A"}, {displayPermanentAddr?.district || "N/A"}, {displayPermanentAddr?.division || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-700/25 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 bg-red-50 dark:bg-gray-700 text-red-600 rounded-xl shrink-0 shadow-sm">
              <FaTint size={13} />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Blood Group</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {displayBlood}
              </p>
            </div>
          </div>

          {verifiedDetails?.nidNumber && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-700/25 border border-gray-100 dark:border-gray-700/50">
              <div className="p-2 bg-red-50 dark:bg-gray-700 text-red-600 rounded-xl shrink-0 shadow-sm">
                <FaIdCard size={13} />
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">NID Number</p>
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {verifiedDetails.nidNumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NID Verification Modal */}
      <VarificationUser
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onStatusChange={(status) =>
          setVerificationStatus(status?.toLowerCase())
        }
      />
    </div>
  );
};

export default UserProfilePage;