'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft, FaHeartbeat, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending reset link...');

    try {
      // ব্যাকএন্ডের কাস্টম এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো হচ্ছে
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to send reset link!', { id: toastId });
      } else {
        toast.success(data.message || 'Reset link sent to your email!', { id: toastId });
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!', { id: toastId });
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter your email to reset your password</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl text-sm">
              পাসওয়ার্ড রিসেট করার লিংক আপনার ইমেইলে পাঠিয়ে দেওয়া হয়েছে। অনুগ্রহ করে ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।
            </div>
            <Link href="/login" className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <FaEnvelope className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
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
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <FaArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;