'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaUser, 
  FaTint, 
  FaFileMedical, 
  FaUsers, 
  FaChartBar,
  FaArrowLeft,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaHandHoldingHeart,
  FaCheckCircle,
  FaBars,
  FaTimes,
  FaUserShield,
  FaExclamationTriangle,
  FaLock
} from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const [dbUserStatus, setDbUserStatus] = useState(null);
  const [suspendUntil, setSuspendUntil] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserLiveStatus = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email/${session.user.email}`);
          const data = await res.json();
          if (data.success && data.data) {
            setDbUserStatus(data.data.status || 'active');
            setSuspendUntil(data.data.suspendUntil || null);
          }
        } catch (err) {
          console.error("Failed to fetch live user status", err);
        }
      }
    };

    if (session?.user?.email) {
      fetchUserLiveStatus();
      const interval = setInterval(fetchUserLiveStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (!isMounted) {
    return null; 
  }

  const userRole = session?.user?.role; 

  const currentUserStatus = dbUserStatus || session?.user?.status || 'active';
  const suspendUntilDate = suspendUntil ? new Date(suspendUntil) : (session?.user?.suspendUntil ? new Date(session.user.suspendUntil) : null);
  const isNow = new Date();

  const isSuspended = currentUserStatus === 'suspended' && (!suspendUntilDate || isNow < suspendUntilDate);

  const userLinks = [
    { name: 'My Profile', path: '/dashboard/user/profile', icon: <FaUser /> },
    { name: 'Create Blood Request', path: '/dashboard/user/create-request', icon: <FaTint /> },
    { name: 'My Blood Requests', path: '/dashboard/user/my-requests', icon: <FaFileMedical /> },
    { name: 'Donation History', path: '/dashboard/user/donation-history', icon: <FaHandHoldingHeart /> },
    { name: 'Notifications', path: '/dashboard/user/notifications', icon: <FaBell /> },
    { name: 'Account Settings', path: '/dashboard/user/settings', icon: <FaCog /> },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/dashboard/admin/overview', icon: <FaHome /> },
    { name: 'Admin Profile', path: '/dashboard/admin/profile', icon: <FaUserShield /> },
    { name: 'Manage Users', path: '/dashboard/admin/manage-users', icon: <FaUsers /> },
    { name: 'Blood Requests', path: '/dashboard/admin/all-requests', icon: <FaFileMedical /> },
    { name: 'Pending Approvals', path: '/dashboard/admin/pending-approvals', icon: <FaCheckCircle /> },
    { name: 'Donation Records', path: '/dashboard/admin/donations', icon: <FaHandHoldingHeart /> },
    { name: 'Analytics & Reports', path: '/dashboard/admin/statistics', icon: <FaChartBar /> },
  ];

  const menuLinks = userRole === 'admin' ? adminLinks : userLinks;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged out!");
          router.push('/login');
        },
      },
    });
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      
      {/* ১. ডেস্কটপ সাইডবার */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div>
          <div className="mb-6 px-4 pt-2">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
              {userRole === 'admin' ? '👑 Admin Panel' : '🩸 User Dashboard'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Blood Donate Society</p>
          </div>

          <div className="mb-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400 font-medium transition-all text-sm shadow-sm"
            >
              <FaArrowLeft className="text-red-500" />
              <span>Back to Home</span>
            </Link>
          </div>

          <nav className="space-y-1.5">
            {menuLinks.map((link, index) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={index}
                  href={link.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/20 dark:bg-red-600 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-white' : 'text-red-500'}`}>
                    {link.icon}
                  </span>
                  <span className="text-sm">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1.5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 font-medium transition-colors cursor-pointer text-sm"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* ২. বামপাশের সাইডবার ড্রয়ার (Left Side Mobile Drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* ব্যাকড্রপ ব্লার */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* বামপাশে পজিশন করার জন্য mr-auto ও left-0 ব্যবহার করা হয়েছে */}
          <div className="relative mr-auto w-56 max-w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-10 transition-transform transform duration-300 ease-in-out">
            
            {/* ড্রয়ার হেডার */}
            <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-red-600 dark:text-red-500 text-xs truncate">
                {userRole === 'admin' ? '👑 Admin Panel' : '🩸 Dashboard'}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-white focus:outline-none rounded-full bg-gray-100 dark:bg-gray-800 cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* ড্রয়ার লিংকস */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5">
              {/* Back to Home লিংক */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mb-2"
              >
                <FaArrowLeft className="text-red-500 w-3.5 h-3.5" /> Back to Home
              </Link>

              {menuLinks.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={index}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className={`text-sm ${isActive ? 'text-white' : 'text-red-500'}`}>{link.icon}</span>
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* ড্রয়ার ফুটার / লগআউট সেকশন */}
            <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-1.5 w-full bg-red-600 hover:bg-red-700 text-white px-2.5 py-2 rounded-lg font-medium text-[11px] transition-all cursor-pointer shadow-sm"
              >
                <FaSignOutAlt className="w-3 h-3" /> Logout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ৩. মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <h1 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 truncate">
              {isPending ? (
                "Loading..."
              ) : (
                `Welcome, ${session?.user?.name || (userRole === 'admin' ? 'Admin' : 'User')}!`
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border-2 border-red-500 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 dark:bg-gray-800 dark:text-red-400 flex items-center justify-center font-bold">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        </header>

        <main className={`p-4 sm:p-6 flex-1 overflow-x-hidden ${isSuspended ? 'pointer-events-none filter blur-sm select-none' : ''}`}>
          {children}
        </main>

      </div>

      {/* Suspended User Preventive Modal */}
      {isSuspended && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-3xl shadow-inner mb-3">
              <FaExclamationTriangle />
            </div>
            
            <h3 className="text-2xl font-extrabold text-red-600 mb-2">অ্যাকাউন্ট সাময়িকভাবে স্থগিত!</h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
              পলিসি লঙ্ঘনের কারণে আপনার অ্যাকাউন্টটি আগামী{' '}
              <span className="font-bold text-red-600">
                {suspendUntilDate ? suspendUntilDate.toLocaleDateString() : 'নির্ধারিত সময়'}
              </span>{' '}
              পর্যন্ত সাসপেন্ড করা হয়েছে।
            </p>
            
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              এই সময়ে আপনি ড্যাশবোর্ডের কোনো ফিচার ব্যবহার করতে পারবেন না। মেয়াদ শেষ হলে স্বয়ংক্রিয়ভাবে অ্যাকাউন্ট সচল হবে।
            </p>

            <button 
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 font-bold shadow-md bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors cursor-pointer text-sm"
            >
              <FaLock /> হোম পেজে ফিরে যান
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}