"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiUsers, 
  FiActivity, 
  FiClock, 
  FiCheckCircle, 
  FiArrowRight, 
  FiShield,
  FiAlertCircle
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminOverviewPage() {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/overview");
        const data = await res.json();

        if (data.success) {
          setOverviewData(data);
        } else {
          throw new Error(data.message || "Failed to fetch overview data!");
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center h-[80vh] min-h-screen"
        style={{
          backgroundColor: isDarkMode ? "#020617" : "#f8fafc",
          color: isDarkMode ? "#ffffff" : "#0f172a"
        }}
      >
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold text-rose-600">
            MMJ
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="p-4 max-w-sm mx-auto mt-16 rounded-xl shadow-lg border text-center"
        style={{
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          borderColor: isDarkMode ? "#334155" : "#e2e8f0",
          color: isDarkMode ? "#ffffff" : "#0f172a"
        }}
      >
        <div className="inline-flex p-2.5 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-full mb-3">
          <FiAlertCircle size={22} />
        </div>
        <h3 className="text-base font-bold mb-1">An Error Occurred</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalUsers = overviewData?.totalUsers || 0;
  const totalRequests = overviewData?.totalRequests || 0;
  const completedDonations = overviewData?.donationRecords || 0;
  const pendingRequests = overviewData?.pendingRequests || 0;

  const barChartData = {
    labels: ["Users", "Requests", "Completed", "Pending"],
    datasets: [
      {
        label: "Amount",
        data: [totalUsers, totalRequests, completedDonations, pendingRequests],
        backgroundColor: [
          "rgba(99, 102, 241, 0.85)",
          "rgba(244, 63, 94, 0.85)",
          "rgba(16, 185, 129, 0.85)",
          "rgba(245, 158, 11, 0.85)",
        ],
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" }, 
        ticks: { color: isDarkMode ? "#94a3b8" : "#334155", font: { size: 11, weight: '700' } } 
      },
      x: { 
        grid: { display: false },
        ticks: { color: isDarkMode ? "#94a3b8" : "#334155", font: { size: 11, weight: '700' } } 
      },
    },
  };

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completedDonations, pendingRequests],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 11, weight: '700' },
          color: isDarkMode ? "#94a3b8" : "#334155"
        }
      }
    }
  };

  return (
    <div 
      className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto min-h-screen transition-colors"
      style={{
        backgroundColor: isDarkMode ? "#020617" : "#f8fafc",
        color: isDarkMode ? "#f8fafc" : "#0f172a"
      }}
    >
      
      {/* Top Header Banner */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 p-4 sm:p-5 rounded-xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-200 border border-rose-500/30 mb-1.5">
            <FiShield size={10} /> Control Panel
          </span>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-slate-200 text-xs mt-0.5">Real-time statistics of blood donation activities.</p>
        </div>
      </div>
      
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-6">
        <div 
          className="p-3.5 sm:p-4 rounded-xl shadow-sm border flex items-center justify-between transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>{totalUsers}</h3>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <FiUsers size={18} />
          </div>
        </div>

        <div 
          className="p-3.5 sm:p-4 rounded-xl shadow-sm border flex items-center justify-between transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Requests</p>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>{totalRequests}</h3>
          </div>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
            <FiActivity size={18} />
          </div>
        </div>

        <div 
          className="p-3.5 sm:p-4 rounded-xl shadow-sm border flex items-center justify-between transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Pending</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-500 mt-0.5">{pendingRequests}</h3>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <FiClock size={18} />
          </div>
        </div>

        <div 
          className="p-3.5 sm:p-4 rounded-xl shadow-sm border flex items-center justify-between transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Completed</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-500 mt-0.5">{completedDonations}</h3>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <FiCheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
        <div 
          className="p-4 sm:p-5 rounded-xl shadow-sm border lg:col-span-2 flex flex-col justify-between transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div className="mb-2">
            <h3 className="text-xs sm:text-sm font-bold" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>Statistics Graph</h3>
          </div>
          <div className="h-48 sm:h-56 w-full flex items-center justify-center">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div 
          className="p-4 sm:p-5 rounded-xl shadow-sm border flex flex-col justify-between transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div className="mb-2">
            <h3 className="text-xs sm:text-sm font-bold" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>Donation Progress</h3>
          </div>
          <div className="h-44 sm:h-52 w-full flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div 
        className="rounded-xl shadow-sm border overflow-hidden transition-colors"
        style={{
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
        }}
      >
        <div 
          className="p-3.5 sm:p-4 border-b flex items-center justify-between gap-2"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0"
          }}
        >
          <div>
            <h2 className="text-sm sm:text-base font-bold" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>Recent Requests</h2>
          </div>
          <Link 
            href="/dashboard/admin/all-requests" 
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-[11px] font-bold rounded-lg transition shrink-0"
          >
            View All <FiArrowRight size={12} />
          </Link>
        </div>

        <div 
          className="w-full overflow-x-auto"
          style={{
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff"
          }}
        >
          <table className="w-full min-w-[480px] text-left text-xs border-collapse">
            <thead>
              <tr 
                style={{
                  backgroundColor: isDarkMode ? "#020617" : "#f1f5f9",
                  borderBottom: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`
                }}
              >
                <th className="px-4 py-3 font-extrabold uppercase tracking-wider" style={{ color: isDarkMode ? "#cbd5e1" : "#0f172a" }}>Patient</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-wider" style={{ color: isDarkMode ? "#cbd5e1" : "#0f172a" }}>Group</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-wider" style={{ color: isDarkMode ? "#cbd5e1" : "#0f172a" }}>Hospital</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-wider" style={{ color: isDarkMode ? "#cbd5e1" : "#0f172a" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {overviewData?.recentRequests && overviewData.recentRequests.length > 0 ? (
                overviewData.recentRequests.map((req) => (
                  <tr 
                    key={req._id} 
                    className="transition-colors"
                    style={{
                      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                      borderBottom: `1px solid ${isDarkMode ? "#1e293b" : "#f1f5f9"}`
                    }}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>
                      {req.patientName}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-[11px] font-black rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold" style={{ color: isDarkMode ? "#ffffff" : "#0f172a" }}>
                      {req.hospitalName}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md ${
                        req.status === 'completed' || req.status === 'Success' 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan="4" 
                    className="px-4 py-6 text-center font-semibold"
                    style={{
                      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                      color: isDarkMode ? "#94a3b8" : "#64748b"
                    }}
                  >
                    No recent requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}