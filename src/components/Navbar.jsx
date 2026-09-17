'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaBars, 
  FaTimes, 
  FaHome,  
  FaFileAlt, 
  FaTachometerAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaHeartbeat,
  FaSun,
  FaMoon,
  FaUserCircle,
  FaUser,
  FaUserShield
} from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdBloodtype } from 'react-icons/md';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Better Auth থেকে সেশন ফেচ করা
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;

  // ইউজারের রোল চেক করা (admin বা user)
  const userRole = session?.user?.role || 'user';

  // ড্যাশবোর্ডের সঠিক রুট নির্ধারণ
  const dashboardPath = userRole === 'admin' ? '/dashboard/admin/overview' : '/dashboard/user/profile';

  // থিম লোড এবং টগল হুক
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হওয়ার হুক
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ড্যাশবোর্ড পেজে নেভবার হাইড করার কন্ডিশন
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  const toggleTheme = () => {
    if (darkMode) {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully!");
          router.push('/login');
        },
      },
    });
  };

  // নেভবার লিংকগুলো
  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome className="w-4 h-4" />,
    },
    {
      name: "All Doner",
      path: "/all-doner",
      icon: <MdBloodtype className="w-4 h-4" />,
    },
    {
      name: "Emergency Request",
      path: "/blood-requests",
      icon: <FaFileAlt className="w-4 h-4" />,
    },
    ...(isLoggedIn ? [{
      name: "Dashboard",
      path: dashboardPath,
      icon: <FaTachometerAlt className="w-4 h-4" />,
    }] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-red-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-red-500 text-white p-2 rounded-full shadow-md animate-pulse">
                <FaHeartbeat className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl text-red-600 dark:text-red-500 tracking-tight leading-tight">
                  মানুষ মানুষের জন্য
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
                  Blood Donate Society
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => {
              const isActive = link.path === '/dashboard/admin/overview' || link.path === '/dashboard/user/profile' 
                ? pathname?.startsWith('/dashboard') 
                : pathname === link.path;

              return (
                <Link 
                  key={index} 
                  href={link.path} 
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-800" 
                      : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side: Theme Toggle & Auth / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4 text-gray-600" />}
            </button>

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                >
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-red-500 shadow-sm"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{session?.user?.name || "User"}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-red-100 text-red-600 dark:bg-gray-700 dark:text-red-400">
                        {userRole}
                      </span>
                    </div>
                    
                    <Link
                      href={dashboardPath}
                      onClick={() => setProfileDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                        pathname?.startsWith('/dashboard') 
                          ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-700 font-semibold" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600"
                      }`}
                    >
                      {userRole === 'admin' ? (
                        <>
                          <FaUserShield className="w-4 h-4 text-red-500" /> Admin Dashboard
                        </>
                      ) : (
                        <>
                          <FaUser className="w-4 h-4 text-red-500" /> My Profile
                        </>
                      )}
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <FaSignOutAlt className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
              >
                <FaSignInAlt className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 focus:outline-none p-2 rounded-md cursor-pointer"
              aria-label="Toggle Menu"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Side Drawer (Compact Width: w-56) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Background Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Drawer Content (w-56 করে আরও ছোট করা হয়েছে) */}
          <div className="relative ml-auto w-56 max-w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-10 transition-transform transform duration-300 ease-in-out">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-red-600 dark:text-red-500 text-sm">মেনু</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-white focus:outline-none rounded-full bg-gray-100 dark:bg-gray-800 cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5">
              {navLinks.map((link, index) => {
                const isActive = link.path === '/dashboard/admin/overview' || link.path === '/dashboard/user/profile' 
                  ? pathname?.startsWith('/dashboard') 
                  : pathname === link.path;

                return (
                  <Link 
                    key={index}
                    href={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
                      isActive 
                        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-800 font-semibold" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-red-500">{link.icon}</span> {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer / Auth section */}
            <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              {isLoggedIn ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 px-1">
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-red-500 shadow-sm"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{session?.user?.name || "User"}</p>
                      <span className="inline-block px-1 py-0.2 text-[8px] font-semibold uppercase rounded bg-red-100 text-red-600 dark:bg-gray-800 dark:text-red-400">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg font-medium text-[11px] ${
                      pathname?.startsWith('/dashboard')
                        ? "bg-red-100 dark:bg-gray-800 text-red-600 dark:text-red-400 font-semibold"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {userRole === 'admin' ? (
                      <>
                        <FaUserShield className="w-3.5 h-3.5 text-red-500" /> Admin Dashboard
                      </>
                    ) : (
                      <>
                        <FaUser className="w-3.5 h-3.5 text-red-500" /> My Profile
                      </>
                    )}
                  </Link>

                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-1.5 w-full bg-red-600 hover:bg-red-700 text-white px-2.5 py-2 rounded-lg font-medium text-[11px] transition-all cursor-pointer shadow-sm"
                  >
                    <FaSignOutAlt className="w-3 h-3" /> Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium text-xs shadow-sm transition-all"
                >
                  <FaSignInAlt className="w-3.5 h-3.5" /> Login
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;