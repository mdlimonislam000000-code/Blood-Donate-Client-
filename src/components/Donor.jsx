'use client';
import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Donor = ({ formData, handleChange, userId }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateDonor = async (e) => {
    e.preventDefault();

    if (!userId || userId === "YOUR_REAL_USER_ID_HERE") {
      toast.error('User ID not found! Please log in again.');
      return;
    }

    setLoading(true);

    try {
      // ব্যাকএন্ড পোর্টের সঠিক URL সহ ফেচ রিকোয়েস্ট
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/donor-settings/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodGroup: formData.bloodGroup,
          isAvailableForDonate: formData.isAvailableForDonate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update donor preferences');
      }

      toast.success('Medical & Donor preferences updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
        Medical & Blood Donor Preferences
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
            Blood Group
          </label>
          <select 
            name="bloodGroup" 
            value={formData.bloodGroup} 
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Available for Blood Donation</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Turn this on if you are ready to donate blood in emergencies.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="isAvailableForDonate" 
              checked={formData.isAvailableForDonate} 
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
      </div>

      {/* সেভ বাটন */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button
          type="button"
          onClick={handleUpdateDonor}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Donor;