'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaHeartbeat, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');

    if (!email || !token) {
      toast.error('ইমেল বা টোকেন পাওয়া যায়নি!', { id: toastId });
      setLoading(false);
      return;
    }

    try {
      // সঠিক পাথ: /api/auth/ বাদ দিয়ে শুধু /api/reset-password দেওয়া হলো
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          token: token, 
          newPassword: password 
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে!', { id: toastId });
      } else {
        toast.success(data.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!', { id: toastId });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      toast.error('কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/20 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex bg-red-500 text-white p-3 rounded-full shadow-lg mb-3 animate-pulse">
            <FaHeartbeat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaLock className="w-4 h-4" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPasswordPage;