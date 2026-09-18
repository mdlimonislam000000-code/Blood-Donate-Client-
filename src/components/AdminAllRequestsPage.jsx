'use client'
import React, { useState, useEffect } from 'react';
import { Card, Spinner, Chip } from "@heroui/react";
import { FaHospital, FaMapMarkerAlt, FaTint, FaUserInjured, FaCheckCircle, FaClock, FaSearch } from 'react-icons/fa';

const AdminAllRequest = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blood-requests`);
        const data = await response.json();
        if (data.success) {
          setBloodRequests(data.data);
        }
      } catch (error) {
        console.error("Error fetching all blood requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, []);

  const totalCount = bloodRequests.length;
  const managedCount = bloodRequests.filter(req => {
    const status = req.status ? req.status.toLowerCase().trim() : '';
    return status === 'manage blood' || status === 'completed' || status === 'success';
  }).length;
  const notManageCount = totalCount - managedCount;

  const filteredRequests = bloodRequests.filter((item) => {
    const matchesSearch = 
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hospitalLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedBloodGroup ? item.bloodGroup === selectedBloodGroup : true;

    const itemStatus = item.status ? item.status.toLowerCase().trim() : 'not manage';
    const isManaged = itemStatus === 'manage blood' || itemStatus === 'completed' || itemStatus === 'success';

    let matchesStatus = true;
    if (statusFilter === 'Not Manage') {
      matchesStatus = !isManaged;
    } else if (statusFilter === 'Manage Blood') {
      matchesStatus = isManaged;
    }

    return matchesSearch && matchesGroup && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mb-1.5">All Blood Requests</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Review and monitor all blood requests submitted to the platform and their current statuses at a glance.
        </p>
      </div>

      {/* Status Counters & Filtering Tabs (2 items per row) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
            statusFilter === 'all' 
              ? 'bg-slate-50 dark:bg-slate-900 border-rose-500 shadow-md scale-[1.01]' 
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">Total Requests</p>
            <h3 className="text-lg sm:text-2xl font-extrabold mt-0.5 text-slate-900 dark:text-white">{totalCount}</h3>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
            <FaTint size={16} />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Not Manage')}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
            statusFilter === 'Not Manage' 
              ? 'bg-slate-50 dark:bg-slate-900 border-amber-500 shadow-md scale-[1.01]' 
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">Not Managed</p>
            <h3 className="text-lg sm:text-2xl font-extrabold mt-0.5 text-slate-900 dark:text-white">{notManageCount}</h3>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <FaClock size={16} />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Manage Blood')}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm col-span-2 lg:col-span-1 ${
            statusFilter === 'Manage Blood' 
              ? 'bg-slate-50 dark:bg-slate-900 border-emerald-500 shadow-md scale-[1.01]' 
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">Managed</p>
            <h3 className="text-lg sm:text-2xl font-extrabold mt-0.5 text-slate-900 dark:text-white">{managedCount}</h3>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <FaCheckCircle size={16} />
          </div>
        </div>
      </div>

      {/* Search Bar & Dropdown Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="w-full md:w-2/3 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by patient name, hospital, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 transition-all"
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm text-slate-400 font-medium">No blood requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => {
            const itemStatus = req.status ? req.status.toLowerCase().trim() : 'not manage';
            const isManaged = itemStatus === 'manage blood' || itemStatus === 'completed' || itemStatus === 'success';

            return (
              <Card key={req._id} shadow="sm" className="border border-slate-100 dark:border-slate-800 p-0 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-row">
                {/* Left Side: Image (if available) */}
                {req.patientImage && (
                  <div className="w-28 sm:w-32 shrink-0 bg-slate-100 dark:bg-slate-800">
                    <img src={req.patientImage} alt="Patient" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Right Side: Details Content */}
                <div className="p-3.5 flex flex-col justify-between flex-grow min-w-0">
                  <div>
                    <div className="flex justify-between items-center gap-1.5 mb-1.5">
                      <h3 className="text-sm font-bold flex items-center gap-1 text-slate-900 dark:text-slate-100 truncate">
                        <span className="text-rose-600 shrink-0"><FaUserInjured size={12} /></span> 
                        <span className="truncate">{req.patientName}</span>
                      </h3>
                      <div className="bg-rose-600 text-white px-2 py-0.5 rounded-full font-extrabold text-[10px] flex items-center gap-1 shadow-sm shrink-0">
                        <FaTint className="text-white" size={8} /> {req.bloodGroup}
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      <p className="flex items-center gap-1.5 truncate">
                        <FaHospital className="text-slate-400 shrink-0" size={10} /> 
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Hospital:</span> 
                        <span className="truncate">{req.hospitalName}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <FaMapMarkerAlt className="text-slate-400 shrink-0" size={10} /> 
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span> 
                        <span className="truncate">{req.hospitalLocation}</span>
                      </p>
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">Blood Bags:</span> {req.bags} Bag(s)</p>
                      <p className="truncate"><span className="font-semibold text-slate-700 dark:text-slate-300">Disease Info:</span> {req.disease || 'N/A'}</p>
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">Contact:</span> {req.guardianPhone}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400">Status:</span>
                    <Chip 
                      color={isManaged ? "success" : "warning"} 
                      variant="flat" 
                      size="sm"
                      className="font-bold text-[10px] h-5 px-1.5"
                    >
                      <span className="flex items-center gap-1">
                        {isManaged ? <FaCheckCircle size={9} /> : <FaClock size={9} />}
                        {isManaged ? 'Manage Blood' : 'Not Manage'}
                      </span>
                    </Chip>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminAllRequest;