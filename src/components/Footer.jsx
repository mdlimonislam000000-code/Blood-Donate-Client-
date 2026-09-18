'use client';
import React from 'react';
import Link from 'next/link';
import { FaTint, FaHeart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-gray-800 transition-colors relative overflow-hidden mt-0">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">
          
          {/* Column 1: About / Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <FaTint className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-xl font-black text-white tracking-wide">মানুষ মানুষের জন্য</h3>
                <p className="text-[9px] sm:text-[10px] text-red-500 font-bold tracking-wider uppercase">Blood Donate Society</p>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Voluntary blood donation is our commitment. A single drop of blood can save a priceless life. Join us in the service of humanity.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaFacebookF className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaTwitter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaInstagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                <FaLinkedinIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs sm:text-base mb-3 sm:mb-5 relative inline-block">
              Quick Links
              <span className="absolute left-0 -bottom-1 w-6 sm:w-8 h-0.5 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors flex items-center gap-1.5 sm:gap-2">
                  <span className="text-red-500">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/all-doner" className="hover:text-red-500 transition-colors flex items-center gap-1.5 sm:gap-2">
                  <span className="text-red-500">›</span> All Donors
                </Link>
              </li>
              <li>
                <Link href="/blood-requests" className="hover:text-red-500 transition-colors flex items-center gap-1.5 sm:gap-2">
                  <span className="text-red-500">›</span> Blood Requests
                </Link>
              </li>
              <li>
                <Link href="/dashboard/user/profile" className="hover:text-red-500 transition-colors flex items-center gap-1.5 sm:gap-2">
                  <span className="text-red-500">›</span> Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Blood Donation Info */}
          <div>
            <h4 className="text-white font-bold text-xs sm:text-base mb-3 sm:mb-5 relative inline-block">
              Donation Rules
              <span className="absolute left-0 -bottom-1 w-6 sm:w-8 h-0.5 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-sm text-gray-400">
              <li className="flex items-start sm:items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 sm:mt-0 flex-shrink-0"></span> Age must be between 18 and 60 years.
              </li>
              <li className="flex items-start sm:items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 sm:mt-0 flex-shrink-0"></span> Body weight must be at least 45 kg.
              </li>
              <li className="flex items-start sm:items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 sm:mt-0 flex-shrink-0"></span> Can donate blood every 3 months.
              </li>
              <li className="flex items-start sm:items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 sm:mt-0 flex-shrink-0"></span> Must be completely healthy and disease-free.
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold text-xs sm:text-base mb-3 sm:mb-5 relative inline-block">
              Contact Us
              <span className="absolute left-0 -bottom-1 w-6 sm:w-8 h-0.5 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5 sm:gap-3">
                <FaMapMarkerAlt className="text-red-500 w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Rangpur, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3">
                <FaPhoneAlt className="text-red-500 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-gray-400">+880 1301269582</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3">
                <FaEnvelope className="text-red-500 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-gray-400 truncate">support@manushmanusherjonno.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-gray-500 gap-2 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} মানুষ মানুষের জন্য (Blood Donate Society). All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Developed with <FaHeart className="text-red-500 w-3 h-3 animate-pulse" /> by <span className="text-gray-300 font-semibold">Limon Mia</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;