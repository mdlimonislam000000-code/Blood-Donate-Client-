'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaIdCard, FaLock, FaArrowLeft, FaHeartbeat, FaEye, FaEyeSlash, FaImage, FaSpinner, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { uploadImageToImgBB } from '@/lib/imageUpload';
import { authClient } from '@/lib/auth-client'; 
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Register Form, Step 2: OTP Verification
  const [showPassword, setShowPassword] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    emailOrPhone: '',
    image: '', 
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setImageFile(file); 
    }
  };

  // ১. রেজিস্ট্রেশন সাবমিট এবং ওটিপি পাঠানোর ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Processing registration...');

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        toast.loading('Uploading profile image...', { id: toastId });
        const uploadedUrl = await uploadImageToImgBB(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error('Image upload failed! Please try again.', { id: toastId });
          setLoading(false);
          return;
        }
      }

      // যদি ইমেল দিয়ে রেজিস্টার করে, তবে ওটিপি পাঠানোর জন্য ব্যাকএন্ড কল করতে পারেন
      // অথবা Better Auth এর বিল্ট-ইন ফ্লো ব্যবহার করতে পারেন। 
      // এখানে আপনার ব্যাকএন্ডের /api/send-otp রুট কল করা হচ্ছে:
      toast.loading('Sending verification OTP to your email...', { id: toastId });
      
      const otpRes = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.emailOrPhone }),
      });
      const otpData = await otpRes.json();

      if (!otpData.success) {
        toast.error(otpData.message || 'Failed to send OTP!', { id: toastId });
        setLoading(false);
        return;
      }

      toast.success('OTP sent successfully! Please check your email.', { id: toastId });
      setStep(2); // ওটিপি স্ক্রিনে চলে যাবে

    } catch (error) {
      console.error("Registration error:", error);
      toast.error('Something went wrong!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ২. ওটিপি ভেরিফাই করে ফাইনালি অ্যাকাউন্ট তৈরি করার ফাংশন
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Verifying OTP and creating account...');

    try {
      // প্রথমে ওটিপি ভেরিফাই করা
      const verifyRes = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.emailOrPhone, otp }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        toast.error(verifyData.message || 'Invalid OTP!', { id: toastId });
        setLoading(false);
        return;
      }

      // ওটিপি সঠিক হলে Better Auth দিয়ে ইউজার সাইন আপ বা ডাটাবেজে সেভ করা
      toast.loading('Saving user to database...', { id: toastId });

      let imageUrl = formData.image;
      const { data, error } = await authClient.signUp.email({
        email: formData.emailOrPhone, 
        password: formData.password,
        name: formData.fullName,
        image: imageUrl,
        role: 'user', 
      });

      if (error) {
        toast.error(error.message || 'Failed to register user!', { id: toastId });
      } else {
        toast.success('Registration & Verification Successful!', { id: toastId });
        setTimeout(() => {
          router.push('/'); // সফল হলে হোম পেজে রিডাইরেক্ট হবে
        }, 1500);
      }

    } catch (error) {
      console.error("Verification error:", error);
      toast.error('Something went wrong during verification!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    toast.loading('Connecting to Google...', { id: 'googleAuth' });

    await authClient.signIn.social({
      provider:'google',
      callbackURL: '/',
    });
    setGoogleLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/20 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-8 transition-all">
        
        <div className="text-center mb-6">
          <div className="inline-flex bg-red-500 text-white p-3 rounded-full shadow-lg mb-3 animate-pulse">
            <FaHeartbeat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? 'Create Account' : 'Verify OTP'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {step === 1 ? 'Join People For People Blood Bank' : `Enter the 6-digit code sent to ${formData.emailOrPhone}`}
          </p>
        </div>

        {step === 1 ? (
          <>
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer mb-5"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>

            <div className="flex items-center mb-5">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">Or with details</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <FaUser className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <FaIdCard className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    name="emailOrPhone"
                    required
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    placeholder="example@gmail.com or 017xxxxxxxx" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Profile Picture
                </label>
                <div className="relative flex items-center w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-3 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <FaImage className="w-4 h-4" />
                  </span>
                  <label className="flex-grow cursor-pointer text-sm text-gray-500 dark:text-gray-400 truncate">
                    {imageName ? imageName : "Choose photo..."}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium px-2 py-1 rounded-md">
                    Browse
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Continue & Send OTP</span>
                    <FaPaperPlane className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Enter 6-digit OTP Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <FaLock className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Complete Register</span>
                  <FaCheckCircle className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Go back & change information
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-red-600 dark:text-red-400 hover:underline font-semibold">
            Login
          </Link>
        </p>

        <div className="text-center mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <FaArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;