
'use client';
import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaBan, FaEye, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminApprovalsPage = () => {
     const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Modal-এর জন্য

  // পেন্ডিং রিকোয়েস্ট ফেচ করা
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

  // স্ট্যাটাস আপডেট হ্যান্ডলার (Accept / Suspend / Delete)
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
        fetchPendingRequests(); // লিস্ট রিফ্রেশ করা
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong!');
    }
  };

  // ডিলিট হ্যান্ডলার
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
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FaIdCard className="text-red-600" /> NID Verification Requests ({requests.length})
        </h2>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No pending verification requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((item) => {
            const userProfilePic = item.profileImage || item.image || item.photo || 'https://i.ibb.co/5GzXkwq/user-placeholder.png';
            
            return (
              <div 
                key={item._id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* User Info with Profile Picture */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={userProfilePic} 
                        alt={item.fullName} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-xs"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.fullName}</h3>
                        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Blood Group: {item.bloodGroup}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <p className="flex items-center gap-2"><FaPhone className="text-gray-400 text-xs" /> {item.phone}</p>
                    <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400 text-xs" /> {item.email}</p>
                    <p className="flex items-center gap-2"><FaIdCard className="text-gray-400 text-xs" /> NID: {item.nidNumber}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedUser(item)}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <FaEye /> View Details
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'accepted')}
                    className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition cursor-pointer"
                    title="Accept"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'suspended')}
                    className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition cursor-pointer"
                    title="Suspend"
                  >
                    <FaBan />
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedUser.profileImage || selectedUser.image || selectedUser.photo || 'https://i.ibb.co/5GzXkwq/user-placeholder.png'} 
                  alt={selectedUser.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-red-500"
                />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Verification Details: {selectedUser.fullName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                  <p><strong className="text-gray-500">Phone:</strong> {selectedUser.phone}</p>
                  <p><strong className="text-gray-500">Email:</strong> {selectedUser.email}</p>
                  <p><strong className="text-gray-500">NID Number:</strong> {selectedUser.nidNumber}</p>
                  <p><strong className="text-gray-500">Blood Group:</strong> {selectedUser.bloodGroup}</p>
                </div>
                <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                  <p><strong className="text-gray-500">Last Donation:</strong> {selectedUser.lastDonationDate || 'N/A'}</p>
                  <p><strong className="text-gray-500">Present Address:</strong> {`${selectedUser.presentAddress?.upazila || ''}, ${selectedUser.presentAddress?.district || ''}`}</p>
                  <p><strong className="text-gray-500">Permanent Address:</strong> {`${selectedUser.permanentAddress?.upazila || ''}, ${selectedUser.permanentAddress?.district || ''}`}</p>
                </div>
              </div>

              {/* NID Images Section */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">NID Card Images</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Front Side</p>
                    <a href={selectedUser.nidFrontImage} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={selectedUser.nidFrontImage} 
                        alt="NID Front" 
                        className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 hover:opacity-90 transition shadow-sm"
                      />
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Back Side</p>
                    <a href={selectedUser.nidBackImage} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={selectedUser.nidBackImage} 
                        alt="NID Back" 
                        className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 hover:opacity-90 transition shadow-sm"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Delete Request
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedUser._id, 'suspended')}
                  className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedUser._id, 'accepted')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
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