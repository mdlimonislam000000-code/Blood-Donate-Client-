'use client';
import React, { useState } from 'react';
import { 
  FaUser, 
  FaTint, 
  FaLock, 
  FaBell, 
  FaSave 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import GeneralInfo from '@/components/GeneralInfo';
import Donor from '@/components/Donor';
import { authClient } from '@/lib/auth-client'; // Better Auth ক্লায়েন্ট ইম্পোর্ট করা হলো

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Better Auth এর বিল্ট-ইন হুক ব্যবহার করে সরাসরি সেশন এবং ইউজার ডেটা নেওয়া হচ্ছে
  const { data: session, isPending: loadingUser } = authClient.useSession();
  
  // ইউজার আইডি নিরাপদে বের করার উপায় (Better Auth এ সাধারণত id থাকে)
  const currentUserId = session?.user?.id || session?.user?._id;

  const [formData, setFormData] = useState({
    bloodGroup: "A+",
    isAvailableForDonate: true,
    emailAlerts: true,
    smsAlerts: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile information, medical preferences, and security settings.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 md:grid-cols-4">
        
        {/* সাইডবার ট্যাব লিস্ট */}
        <div className="border-b md:border-b-0 md:border-r border-red-100 dark:border-gray-700 p-4 space-y-1 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'general' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FaUser /> General Info
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'medical' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FaTint /> Medical & Donor
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FaLock /> Security
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'notifications' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FaBell /> Notifications
          </button>
        </div>

        {/* মেইন ফর্ম কন্টেন্ট */}
        <div className="md:col-span-3 p-6 sm:p-8">
          
          {activeTab === 'general' && <GeneralInfo />}

          {activeTab === 'medical' && (
            loadingUser ? (
              <p className="text-sm text-gray-500">Loading user data...</p>
            ) : currentUserId ? (
              <Donor 
                formData={formData} 
                handleChange={handleChange} 
                userId={currentUserId} 
              />
            ) : (
              <p className="text-sm text-red-500">Please log in again to manage your donor settings.</p>
            )
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">Change Password</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Current Password</label>
                    <input 
                      type="password" 
                      name="currentPassword" 
                      value={formData.currentPassword} 
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">New Password</label>
                    <input 
                      type="password" 
                      name="newPassword" 
                      value={formData.newPassword} 
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">Notification Preferences</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Email Alerts</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive emails about blood requests and account updates.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="emailAlerts" 
                      checked={formData.emailAlerts} 
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">SMS Alerts</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get text messages for critical emergency campaigns.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="smsAlerts" 
                      checked={formData.smsAlerts} 
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default UserSettings;