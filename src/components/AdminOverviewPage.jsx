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

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-slate-50 dark:bg-slate-950">
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
      <div className="p-4 max-w-sm mx-auto mt-16 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-rose-100 dark:border-rose-900/50 text-center">
        <div className="inline-flex p-2.5 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-full mb-3">
          <FiAlertCircle size={22} />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">An Error Occurred</h3>
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
        grid: { color: "rgba(100, 116, 139, 0.08)" }, 
        ticks: { color: "#94a3b8", font: { size: 9 } } 
      },
      x: { 
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 9 } } 
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
          boxWidth: 10,
          font: { size: 10 },
          color: "#94a3b8"
        }
      }
    }
  };

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 overflow-hidden">
      
      {/* Top Header Banner */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 p-4 sm:p-5 rounded-xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-200 border border-rose-500/30 mb-1.5">
            <FiShield size={10} /> Control Panel
          </span>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">System Overview</h1>
          <p className="text-slate-300 text-xs mt-0.5">Real-time statistics of blood donation activities.</p>
        </div>
      </div>
      
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{totalUsers}</h3>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <FiUsers size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Requests</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{totalRequests}</h3>
          </div>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
            <FiActivity size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Pending</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{pendingRequests}</h3>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <FiClock size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Completed</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{completedDonations}</h3>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <FiCheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 lg:col-span-2 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">Statistics Graph</h3>
          </div>
          <div className="h-48 sm:h-56 w-full flex items-center justify-center">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">Donation Progress</h3>
          </div>
          <div className="h-44 sm:h-52 w-full flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">Recent Requests</h2>
          </div>
          <Link 
            href="/dashboard/admin/all-requests" 
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-[11px] font-bold rounded-lg transition shrink-0"
          >
            View All <FiArrowRight size={12} />
          </Link>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[480px] divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60">
              <tr>
                <th className="px-3.5 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Group</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Hospital</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {overviewData?.recentRequests?.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">{req.patientName}</td>
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 inline-flex text-[10px] font-extrabold rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">{req.hospitalName}</td>
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-[10px] font-semibold rounded-full ${
                      req.status === 'completed' || req.status === 'Success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900' 
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}