"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; // আপনার প্রজেক্টের পাথ অনুযায়ী এটি মিলিয়ে নিবেন
import {
  FaBell,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // BetterAuth থেকে রিয়েল সেশন এবং ইউজার নিয়ে আসা
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userId = session?.user?.id;

  // ১. নোটিফিকেশন ফেচ করা
  useEffect(() => {
    // যদি সেশন লোড হতে থাকে অথবা ইউজার আইডি না পাওয়া যায়, তবে রিটার্ন করবে
    if (sessionLoading) return;

    if (!userId) {
      setLoading(false);
      setError("দয়া করে প্রথমে লগইন করুন।");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/notifications/${userId}`,
        );
        const data = await response.json();

        if (data.success) {
          setNotifications(data.data);
        } else {
          setError(data.message || "নোটিফিকেশন পাওয়া যায়নি।");
        }
      } catch (err) {
        setError("নোটিফিকেশন লোড করতে সার্ভারে সমস্যা হচ্ছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, sessionLoading]);

  // ২. নোটিফিকেশন রিড হিসেবে মার্ক করা
  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/read/${id}`,
        {
          method: "PATCH",
        },
      );
      const data = await response.json();

      if (data.success) {
        // UI আপডেট করা
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // নোটিফিকেশনের ধরন অনুযায়ী আইকন সেট করা
  const getIcon = (type) => {
    switch (type) {
      case "blood_request":
        return <FaExclamationCircle className="text-red-500 text-xl mt-1" />;
      case "donation_success":
        return <FaCheckCircle className="text-green-500 text-xl mt-1" />;
      case "nid_status":
        return <FaInfoCircle className="text-blue-500 text-xl mt-1" />;
      default:
        return <FaBell className="text-gray-500 text-xl mt-1" />;
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBell className="text-red-600" />
          আমার নোটিফিকেশন
        </h2>
        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {notifications.filter((n) => !n.isRead).length} Unread
        </span>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">আপনার কোনো নতুন নোটিফিকেশন নেই।</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                notif.isRead
                  ? "bg-white border-gray-200 shadow-sm opacity-75"
                  : "bg-red-50 border-red-200 shadow-md transform hover:-translate-y-1"
              }`}
            >
              {/* আইকন */}
              <div className="flex-shrink-0">{getIcon(notif.type)}</div>

              {/* কন্টেন্ট */}
              <div className="flex-1">
                <h3
                  className={`text-base font-semibold ${notif.isRead ? "text-gray-700" : "text-gray-900"}`}
                >
                  {notif.title}
                </h3>
                <p
                  className={`text-sm mt-1 ${notif.isRead ? "text-gray-500" : "text-gray-700"}`}
                >
                  {notif.message}
                </p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(notif.createdAt).toLocaleString("bn-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {/* আনরিড ডট ইন্ডিকেটর */}
              {!notif.isRead && (
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserNotificationsPage;
