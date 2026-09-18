"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckDouble,
} from "react-icons/fa";
import toast from "react-hot-toast";

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (sessionLoading) return;

    if (!userId) {
      setLoading(false);
      setError("Please login first to view notifications.");
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
          setError(data.message || "No notifications found.");
        }
      } catch (err) {
        setError("Server error while loading notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, sessionLoading]);

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

  const markAllAsRead = async () => {
    try {
      const unreadItems = notifications.filter((n) => !n.isRead);
      for (const item of unreadItems) {
        await fetch(`http://localhost:5000/api/notifications/read/${item._id}`, {
          method: "PATCH",
        });
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read!");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to update notifications.");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "blood_request":
        return <FaExclamationCircle className="text-error" size={14} />;
      case "donation_success":
        return <FaCheckCircle className="text-emerald-500" size={14} />;
      case "nid_status":
        return <FaInfoCircle className="text-sky-500" size={14} />;
      default:
        return <FaBell className="text-gray-400" size={14} />;
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-md text-error"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-sm font-medium text-red-500">{error}</h3>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 md:py-6">
      {/* Responsive Header (Fixed for Mobile & Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white px-4 py-3.5 rounded-2xl shadow-2xs border border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-error flex items-center justify-center shrink-0 shadow-2xs">
            <FaBell size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
              Notifications
            </h2>
            <p className="text-[11px] text-gray-400">
              Stay updated with your activities.
            </p>
          </div>
        </div>

        {/* Action Badges/Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <span className="bg-red-50 text-error font-bold text-[11px] px-2.5 py-1 rounded-lg border border-red-100 shrink-0">
            {unreadCount} Unread
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border-none font-semibold text-[11px] h-7 px-2.5 transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <FaCheckDouble size={10} /> Read all
            </button>
          )}
        </div>
      </div>

      {/* Compact Notifications List */}
      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 px-4">
            <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <FaBell size={16} />
            </div>
            <p className="text-xs font-medium text-gray-400">
              You have no notifications right now.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-2.5 group ${
                notif.isRead
                  ? "bg-white/80 border-gray-100 shadow-2xs opacity-75 hover:opacity-100"
                  : "bg-white border-red-200 shadow-xs ring-1 ring-red-50 hover:border-red-300"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                  notif.isRead ? "bg-gray-100" : "bg-red-50 border border-red-100"
                }`}
              >
                {getIcon(notif.type)}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3
                    className={`text-xs md:text-sm font-bold truncate ${
                      notif.isRead ? "text-gray-700" : "text-gray-900"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p
                  className={`text-[11px] md:text-xs leading-relaxed ${
                    notif.isRead ? "text-gray-500" : "text-gray-600 font-medium"
                  }`}
                >
                  {notif.message}
                </p>
              </div>

              {/* Unread Indicator Dot */}
              {!notif.isRead && (
                <div className="shrink-0 self-center pl-0.5">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse shadow-2xs"></div>
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