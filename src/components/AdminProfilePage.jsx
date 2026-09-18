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
  FiAlertTriangle,
  FiX
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && (data.success || data.admin || data.data)) {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/profile`, {
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
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMessage("Could not connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-slate-50 dark:bg-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-rose-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-600">
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
          <FiAlertTriangle size={36} className="text-rose-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Access Denied
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Your account could not be authenticated or your role is not verified as{" "}
            <span className="font-mono text-rose-600 font-bold">admin</span>. Please login with a valid admin account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Compact Banner */}
      <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/25 text-rose-200 border border-rose-500/30 mb-1.5">
            <FiShield size={10} /> MMJ Blood Bank - Admin Panel
          </span>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Admin Control Center
          </h1>
          <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5">
            Real-time admin profile details fetched directly from database.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-md">
          <FiCheckCircle size={16} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2 shadow-md">
          <FiAlertTriangle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Compact Card: Profile Overview */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center h-fit relative">
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
            </span>
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 mt-1">
            <img
              src={
                admin?.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              }
              alt="Admin Avatar"
              className="w-full h-full object-cover rounded-full border-3 border-rose-600/30 shadow-md"
            />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 break-words max-w-full">
            {admin?.name}
          </h2>
          <span className="mt-1 px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 uppercase">
            Role: {admin?.role}
          </span>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 my-4"></div>

          <div className="w-full space-y-2.5 text-left text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} className="text-rose-500 shrink-0" /> Joined:
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1.5">
                <FiLock size={13} className="text-rose-500 shrink-0" /> Verified:
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {admin?.emailVerified ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Detailed Info / Edit Form */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  User Collection Admin Details
                </h3>
                <p className="text-[11px] text-slate-400">
                  Fetched directly from the system collection
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-semibold rounded-xl transition duration-300 border border-rose-100 dark:border-rose-900/50 shrink-0"
              >
                {isEditing ? <FiX size={13} /> : <FiEdit3 size={13} />}
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-2xs overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiUser size={13} className="text-rose-500 shrink-0" /> Full Name
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
                    {admin?.name}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-2xs overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiMail size={13} className="text-rose-500 shrink-0" /> Email Address
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">
                    {admin?.email}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-2xs overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiPhone size={13} className="text-rose-500 shrink-0" /> Phone Number
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
                    {admin?.phone || "Not Linked"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-2xs overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiMapPin size={13} className="text-rose-500 shrink-0" /> Address
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
                    {admin?.address || "Not Linked"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-300 transition text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition shadow-md text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-left sm:text-right text-[10px] text-slate-400 break-all">
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