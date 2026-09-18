"use client";
import React, { useState } from "react";
import { FaUser, FaTint, FaLock, FaBell, FaSave, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import GeneralInfo from "@/components/GeneralInfo";
import Donor from "@/components/Donor";
import { authClient } from "@/lib/auth-client";

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const { data: session, isPending: loadingUser } = authClient.useSession();
  const currentUserId = session?.user?.id || session?.user?._id;

  const [formData, setFormData] = useState({
    bloodGroup: "A+",
    isAvailableForDonate: true,
    emailAlerts: true,
    smsAlerts: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings updated successfully!");
  };

  const navItems = [
    { id: "general", label: "General Info", icon: FaUser, desc: "Personal details" },
    { id: "medical", label: "Medical & Donor", icon: FaTint, desc: "Blood group & status" },
    { id: "security", label: "Security", icon: FaLock, desc: "Password & safety" },
    { id: "notifications", label: "Notifications", icon: FaBell, desc: "Alerts & preferences" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xs border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-error">Account Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your profile information, medical preferences, and security settings seamlessly.
          </p>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Sidebar Tabs (Left Column - 4 Spans) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 p-4 lg:p-6 space-y-2 bg-gray-50/50 dark:bg-gray-900/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-3">
            Navigation Menu
          </p>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-error text-white shadow-md shadow-red-500/20 translate-x-1"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-error"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${isActive ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] font-normal ${isActive ? "text-red-100" : "text-gray-400"}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area (Right Column - 8 Spans) */}
        <div className="lg:col-span-8 p-6 sm:p-8 md:p-10">
          {activeTab === "general" && <GeneralInfo />}

          {activeTab === "medical" &&
            (loadingUser ? (
              <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-md text-error"></span>
              </div>
            ) : currentUserId ? (
              <Donor
                formData={formData}
                handleChange={handleChange}
                userId={currentUserId}
              />
            ) : (
              <div className="text-center py-16 bg-red-50/50 rounded-2xl border border-red-100 p-6">
                <p className="text-sm font-medium text-red-500">
                  Please log in again to manage your donor settings.
                </p>
              </div>
            ))}

          {activeTab === "security" && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-error flex items-center justify-center">
                    <FaShieldAlt size={14} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Change Password
                    </h2>
                    <p className="text-xs text-gray-400">Ensure your account is using a secure password.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-error transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-error transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-error transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-error hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-500/20 cursor-pointer"
                >
                  <FaSave size={14} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-error flex items-center justify-center">
                    <FaBell size={14} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Notification Preferences
                    </h2>
                    <p className="text-xs text-gray-400">Choose how you want to receive alerts and updates.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:border-red-200 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Email Alerts
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Receive important emails about blood requests and account updates.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="emailAlerts"
                      checked={formData.emailAlerts}
                      onChange={handleChange}
                      className="checkbox checkbox-error checkbox-sm rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:border-red-200 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        SMS Alerts
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Get text messages for critical emergency donation campaigns.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="smsAlerts"
                      checked={formData.smsAlerts}
                      onChange={handleChange}
                      className="checkbox checkbox-error checkbox-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-error hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-500/20 cursor-pointer"
                >
                  <FaSave size={14} /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;