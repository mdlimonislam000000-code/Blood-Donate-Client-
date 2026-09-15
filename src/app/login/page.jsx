'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaArrowLeft, FaHeartbeat, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // স্টেট ফর ইনপুট ডেটা
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Logging in...');

    try {
      // BetterAuth দিয়ে লগইন রিকোয়েস্ট পাঠানো হচ্ছে
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password!', { id: toastId });
      } else {
        toast.success('Login Successful!', { id: toastId });
        
        setTimeout(() => {
          // সেশন এবং নেভবার সঠিকভাবে আপডেট করার জন্য ফুল পেজ রিলোডসহ ড্যাশবোর্ডে রিডাইরেক্ট
          window.location.href = '/'; 
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Something went wrong!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const toastId = toast.loading('Connecting to Google...');

    try {
      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: 'http://localhost:3000', // লগইন সফল হলে ফ্রন্টএন্ডে ফিরে আসবে
      });

      if (error) {
        toast.error(error.message || 'Google login failed! Check account linking.', { id: toastId });
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error('Something went wrong with Google login!', { id: toastId });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/20 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-8 transition-all">
        
        {/* Top Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-red-500 text-white p-3 rounded-full shadow-lg mb-3 animate-pulse">
            <FaHeartbeat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">People For People Blood Bank</p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer mb-6 disabled:opacity-50"
        >
          {googleLoading ? (
            <FaSpinner className="w-5 h-5 animate-spin" />
          ) : (
            <FcGoogle className="w-5 h-5" />
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">Or with email</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Login Form */}
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
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaLock className="w-4 h-4" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" />
              Remember me
            </label>


            {/* akane forget password ar link diba /forgot-pass */}
            <Link href="#" className="text-red-600 dark:text-red-400 hover:underline font-medium">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Registration Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-red-600 dark:text-red-400 hover:underline font-semibold">
            Register
          </Link>
        </p>

        {/* Footer / Back to Home Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <FaArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;