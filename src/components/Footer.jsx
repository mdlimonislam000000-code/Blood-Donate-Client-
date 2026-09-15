'use client';
import React from 'react';
import Link from 'next/link';
import { FaTint, FaHeart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 transition-colors relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: About / Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <FaTint className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-wide">মানুষ মানুষের জন্য</h3>
                <p className="text-[10px] text-red-500 font-bold tracking-wider uppercase">Blood Donate Society</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              স্বেচ্ছায় রক্তদান হোক আমাদের অঙ্গীকার। একটি রক্তবিন্দু বাঁচাতে পারে একটি অমূল্য প্রাণ। আমাদের সাথে যুক্ত হয়ে মানবতার সেবায় অংশ নিন।
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaTwitter className="w-3.5 h-3.5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative inline-block">
              দ্রুত লিংক
              <span className="absolute left-0 -bottom-1 w-8 h-0.5 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors flex items-center gap-2">
                  <span className="text-red-500">›</span> হোম
                </Link>
              </li>
              <li>
                <Link href="/all-doner" className="hover:text-red-500 transition-colors flex items-center gap-2">
                  <span className="text-red-500">›</span> সকল রক্তদাতা
                </Link>
              </li>
              <li>
                <Link href="/blood-requests" className="hover:text-red-500 transition-colors flex items-center gap-2">
                  <span className="text-red-500">›</span> জরুরি রক্তের আবেদন
                </Link>
              </li>
              <li>
                <Link href="/dashboard/user/profile" className="hover:text-red-500 transition-colors flex items-center gap-2">
                  <span className="text-red-500">›</span> ড্যাশবোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Blood Donation Info */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative inline-block">
              রক্তদানের নিয়মাবলী
              <span className="absolute left-0 -bottom-1 w-8 h-0.5 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে।
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> শারীরিক ওজন কমপক্ষে ৪৫ কেজি হতে হবে।
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> প্রতি ৩ মাস অন্তর রক্তদান করা যায়।
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> সম্পূর্ণ সুস্থ ও রোগমুক্ত থাকতে হবে।
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative inline-block">
              যোগাযোগ করুন
              <span className="absolute left-0 -bottom-1 w-8 h-0.5 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-red-500 w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-gray-400">রংপুর, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-red-500 w-4 h-4 flex-shrink-0" />
                <span className="text-gray-400">+880 1301269582</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-red-500 w-4 h-4 flex-shrink-0" />
                <span className="text-gray-400">support@manushmanusherjonno.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} মানুষ মানুষের জন্য (Blood Donate Society)। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            Developed with <FaHeart className="text-red-500 w-3 h-3 animate-pulse" /> by <span className="text-gray-300 font-semibold">Limon Mia</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;