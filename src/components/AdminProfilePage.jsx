
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiShield, 
  FiEdit3, 
  FiCheckCircle, 
  FiCalendar,
  FiLock,
  FiAlertTriangle
} from "react-icons/fi";

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("API Response Data:", data); // কনসোলে ডেটা চেক করার জন্য

        if (res.ok && (data.success || data.admin || data.data)) {
          // ডেটা অবজেক্ট যেকোনো ফরম্যাটে আসতে পারে (data.admin বা data.data বা সরাসরি data)
          const profileData = data.admin || data.data || data;

          if (
            !profileData ||
            !profileData.role ||
            profileData.role.toLowerCase() !== "admin"
          ) {
            setAccessDenied(true);
          } else {
            setAdmin(profileData);
            setFormData(profileData);
          }
        } else {
          setAccessDenied(true);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedData = data.admin || data.data || formData;
        setAdmin(updatedData);
        setIsEditing(false);
        setSuccessMessage("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.message || "আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      setErrorMessage("সার্ভারে সংযোগ স্থাপন করা যায়নি।");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-slate-50 dark:bg-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-rose-600">
            MMJ
          </div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] bg-slate-50 dark:bg-slate-950 px-4 text-center">
        <div className="p-6 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-2xl max-w-md shadow-xl">
          <FiAlertTriangle size={40} className="text-rose-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            অ্যাক্সেস ডিনাইড (Access Denied)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            আপনার অ্যাকাউন্টটি অথেন্টিকেট করা যায়নি অথবা এর রোল{" "}
            <span className="font-mono text-rose-600 font-bold">admin</span>{" "}
            হিসেবে ভেরিফাই হয়নি। দয়া করে সঠিক অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন
            করুন।
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/25 text-rose-200 border border-rose-500/30 mb-2">
            <FiShield size={12} /> MMJ Blood Bank - Admin Panel
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            অ্যাডমিন কন্ট্রোল সেন্টার
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            ডেটাবেজ থেকে রিয়েল-টাইম ফেচ করা অ্যাডমিন প্রোফাইল তথ্য।
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-2 shadow-lg">
          <FiCheckCircle size={18} className="shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-sm flex items-center gap-2 shadow-lg">
          <FiAlertTriangle size={18} className="shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Profile Overview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center h-fit relative">
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
              Active Admin
            </span>
          </div>

          <div className="relative w-32 h-32 mb-5 mt-2">
            <img
              src={
                admin?.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              }
              alt="Admin Avatar"
              className="w-full h-full object-cover rounded-full border-4 border-rose-600/30 shadow-lg"
            />
          </div>

          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {admin?.name}
          </h2>
          <span className="mt-1.5 px-3 py-1 inline-flex text-xs font-bold rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 shadow-sm uppercase">
            Role: {admin?.role}
          </span>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 my-6"></div>

          <div className="w-full space-y-3.5 text-left text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-2">
                <FiCalendar size={14} className="text-rose-500" /> একাউন্ট তৈরি:
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {admin?.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-2">
                <FiLock size={14} className="text-rose-500" /> ইমেইল ভেরিফাইড:
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {admin?.emailVerified ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Detailed Info / Edit Form */}
        <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ইউজার কালেকশন অ্যাডমিন ডিটেইলস
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ডাটাবেজ থেকে সরাসরি ফেচ করা হয়েছে
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-xl transition duration-300 border border-rose-100 dark:border-rose-900/50 shadow-sm"
              >
                <FiEdit3 size={14} />{" "}
                {isEditing ? "এডিট বাতিল" : "প্রোফাইল এডিট করুন"}
              </button>
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiUser size={14} className="text-rose-500" /> পূর্ণ নাম
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {admin?.name}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiMail size={14} className="text-rose-500" /> ইমেইল
                    অ্যাড্রেস
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {admin?.email}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiPhone size={14} className="text-rose-500" /> ফোন নম্বর
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {admin?.phone || "সংযুক্ত নেই"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiMapPin size={14} className="text-rose-500" /> ঠিকানা
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {admin?.address || "সংযুক্ত নেই"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      পূর্ণ নাম
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      ইমেইল অ্যাড্রেস
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      ফোন নম্বর
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      ঠিকানা
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-300 transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition shadow-md"
                  >
                    পরিবর্তন সেভ করুন
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-right text-xs text-slate-400">
            MongoDB ID:{" "}
            <span className="font-mono text-slate-500">
              {admin?._id || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
