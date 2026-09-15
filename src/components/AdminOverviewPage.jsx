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
          throw new Error(data.message || "ওভারভিউ ডেটা ফেচ করতে সমস্যা হয়েছে!");
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-rose-600 dark:text-rose-500">
            MMJ
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-md mx-auto mt-20 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-rose-100 dark:border-rose-900/50 text-center">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-500 rounded-full mb-4">
          <FiAlertCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">দুঃখিত, সমস্যা হয়েছে</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 transition shadow-md shadow-rose-200 dark:shadow-rose-950"
        >
          পুনরায় চেষ্টা করুন
        </button>
      </div>
    );
  }

  const totalUsers = overviewData?.totalUsers || 0;
  const totalRequests = overviewData?.totalRequests || 0;
  const completedDonations = overviewData?.donationRecords || 0;
  const pendingRequests = overviewData?.pendingRequests || 0;

  const barChartData = {
    labels: ["মোট ব্যবহারকারী", "মোট রক্তের অনুরোধ", "সম্পন্ন ডোনেশন", "পেন্ডিং অনুরোধ"],
    datasets: [
      {
        label: "পরিমাণ",
        data: [totalUsers, totalRequests, completedDonations, pendingRequests],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(244, 63, 94, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: "#f1f5f9" }, 
        ticks: { color: "#64748b" } 
      },
      x: { 
        grid: { display: false },
        ticks: { color: "#64748b" } 
      },
    },
  };

  const doughnutData = {
    labels: ["সম্পন্ন ডোনেশন", "পেন্ডিং অনুরোধ"],
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
        labels: {
          color: "#334155"
        }
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/25 text-rose-200 border border-rose-500/30 mb-2">
            <FiShield size={12} /> অ্যাডমিন কন্ট্রোল প্যানেল
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">সিস্টেম ওভারভিউ ও স্ট্যাটাস চার্ট</h1>
          <p className="text-slate-300 text-sm mt-1">রক্তদান কার্যক্রমের ভিজ্যুয়াল অ্যানালিটিক্স এবং রিয়েল-টাইম ডেটা।</p>
        </div>
      </div>
      
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট ব্যবহারকারী</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{totalUsers}</h3>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <FiUsers size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট রক্তের অনুরোধ</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{totalRequests}</h3>
          </div>
          <div className="p-4 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl">
            <FiActivity size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">পেন্ডিং (বাকি)</p>
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{pendingRequests}</h3>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
            <FiClock size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">সম্পন্ন ডোনেশন</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{completedDonations}</h3>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <FiCheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">সিস্টেম স্ট্যাটিস্টিক্স গ্রাফ</h3>
            <p className="text-xs text-slate-400 mb-4">ব্যবহারকারী এবং রক্তদানের তুলনামূলক পরিসংখ্যান</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">ডোনেশন প্রোগ্রেস</h3>
            <p className="text-xs text-slate-400 mb-4">সম্পন্ন বনাম বাকি অনুরোধের অনুপাত</p>
          </div>
          <div className="h-60 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">সাম্প্রতিক রক্তের অনুরোধসমূহ</h2>
            <p className="text-xs text-slate-400 mt-0.5">সর্বশেষ প্রকাশিত জরুরি রক্তের আবেদনসমূহ</p>
          </div>
          <Link 
            href="/dashboard/admin/all-requests" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-xl transition duration-300"
          >
            সব দেখুন <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950/75">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">রোগীর নাম</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">রক্তের গ্রুপ</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">হাসপাতাল</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {overviewData?.recentRequests?.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200">{req.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-extrabold rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{req.hospitalName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
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