'use client';
import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaBan, FaEye, FaIdCard, FaPhone, FaEnvelope, FaTint } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminApprovalsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch pending verification requests
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/nid-verifications?status=pending');
      const data = await res.json();
      if (data.success || Array.isArray(data)) {
        setRequests(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Status update handler (Accept / Suspend)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/nid-verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Request ${newStatus} successfully!`);
        setSelectedUser(null);
        fetchPendingRequests();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong!');
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/nid-verifications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Request deleted successfully!');
        setSelectedUser(null);
        fetchPendingRequests();
      } else {
        toast.error('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Something went wrong!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Header Section */}
      <div className="flex justify-between items-center gap-4 mb-8 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
            <FaIdCard size={22} />
          </div>
          <div>
            {/* মাঝখানের বড় বিবরণ বাদ দিয়ে শুধু টাইটেল এক লাইনে রাখা হলো */}
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide">
              NID Verification Requests
            </h2>
          </div>
        </div>
        {/* Pending Counter */}
        <div className="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs px-4 py-2 rounded-xl border border-rose-100 dark:border-rose-900/50 shrink-0">
          Pending: {requests.length}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <FaIdCard className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={40} />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No pending verification requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((item) => {
            const userProfilePic = item.profileImage || item.image || item.photo || 'https://i.ibb.co/5GzXkwq/user-placeholder.png';
            
            return (
              <div 
                key={item._id} 
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* User Profile Info */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={userProfilePic} 
                        alt={item.fullName} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shrink-0 shadow-sm"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">{item.fullName}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                          <FaTint size={10} /> {item.bloodGroup}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 shrink-0">
                      {item.status}
                    </span>
                  </div>

                  {/* Contact Info List */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-5 bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <p className="flex items-center gap-2 truncate"><FaPhone className="text-slate-400 shrink-0" size={11} /> <span className="truncate">{item.phone}</span></p>
                    <p className="flex items-center gap-2 truncate"><FaEnvelope className="text-slate-400 shrink-0" size={11} /> <span className="truncate">{item.email}</span></p>
                    <p className="flex items-center gap-2 truncate"><FaIdCard className="text-slate-400 shrink-0" size={11} /> <span className="font-semibold text-slate-700 dark:text-slate-300">NID:</span> {item.nidNumber}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedUser(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <FaEye size={12} /> View Details
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'accepted')}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer border border-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/40"
                    title="Accept Request"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'suspended')}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition cursor-pointer border border-amber-100 dark:border-amber-900/30 dark:bg-amber-950/40"
                    title="Suspend Request"
                  >
                    <FaBan size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details & Image Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedUser.profileImage || selectedUser.image || selectedUser.photo || 'https://i.ibb.co/5GzXkwq/user-placeholder.png'} 
                  alt={selectedUser.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-500 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verification Inspection Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="flex items-center justify-between"><strong className="text-slate-400">Phone:</strong> <span className="font-medium text-slate-700 dark:text-slate-300">{selectedUser.phone}</span></p>
                  <p className="flex items-center justify-between"><strong className="text-slate-400">Email:</strong> <span className="font-medium text-slate-700 dark:text-slate-300">{selectedUser.email}</span></p>
                  <p className="flex items-center justify-between"><strong className="text-slate-400">NID Number:</strong> <span className="font-medium text-slate-700 dark:text-slate-300">{selectedUser.nidNumber}</span></p>
                  <p className="flex items-center justify-between"><strong className="text-slate-400">Blood Group:</strong> <span className="font-bold text-rose-600">{selectedUser.bloodGroup}</span></p>
                </div>
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="flex items-center justify-between"><strong className="text-slate-400">Last Donation:</strong> <span className="font-medium text-slate-700 dark:text-slate-300">{selectedUser.lastDonationDate || 'N/A'}</span></p>
                  <p className="flex items-start justify-between gap-2"><strong className="text-slate-400 shrink-0">Present Address:</strong> <span className="font-medium text-right text-slate-700 dark:text-slate-300">{`${selectedUser.presentAddress?.upazila || ''}, ${selectedUser.presentAddress?.district || ''}`}</span></p>
                  <p className="flex items-start justify-between gap-2"><strong className="text-slate-400 shrink-0">Permanent Address:</strong> <span className="font-medium text-right text-slate-700 dark:text-slate-300">{`${selectedUser.permanentAddress?.upazila || ''}, ${selectedUser.permanentAddress?.district || ''}`}</span></p>
                </div>
              </div>

              {/* NID Images Section */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">NID Verification Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Front Side</p>
                    <a href={selectedUser.nidFrontImage} target="_blank" rel="noopener noreferrer" className="block group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                      <img 
                        src={selectedUser.nidFrontImage} 
                        alt="NID Front" 
                        className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                      />
                    </a>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Back Side</p>
                    <a href={selectedUser.nidBackImage} target="_blank" rel="noopener noreferrer" className="block group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                      <img 
                        src={selectedUser.nidBackImage} 
                        alt="NID Back" 
                        className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition cursor-pointer border border-rose-100 dark:border-rose-900/30 dark:bg-rose-950/30"
              >
                Delete Request
              </button>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleUpdateStatus(selectedUser._id, 'suspended')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold transition cursor-pointer border border-amber-100 dark:border-amber-900/30 dark:bg-amber-950/30"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedUser._id, 'accepted')}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                >
                  Accept Request
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalsPage;