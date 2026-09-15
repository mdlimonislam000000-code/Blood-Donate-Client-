'use client'
import React, { useState, useEffect } from 'react';
import { Card, Spinner, Chip, Button } from "@heroui/react";
import { FaUser, FaEnvelope, FaTrash, FaSearch, FaHourglassHalf, FaShieldAlt, FaUnlock, FaBan, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // কাস্টম মোডাল স্টেট
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // সকল ইউজার ফেচ করা
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("ইউজার ডেটা লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ইউজার স্ট্যাটাস আপডেট (Block, Suspend বা Active/Unsuspend করার জন্য)
  const handleUpdateStatus = async (userId, statusType) => {
    let bodyData = {};
    if (statusType === 'block') {
      bodyData = { status: 'blocked' };
    } else if (statusType === 'suspend') {
      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + 7); // সুনির্দিষ্ট ৭ দিনের জন্য সাসপেন্ড
      bodyData = { status: 'suspended', suspendUntil: suspendUntil.toISOString() };
    } else if (statusType === 'active') {
      bodyData = { status: 'active', suspendUntil: null };
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      if (data.success) {
        const successMessage = 
          statusType === 'block' ? 'ইউজার সফলভাবে ব্লক করা হয়েছে!' :
          statusType === 'suspend' ? 'ইউজার সফলভাবে ৭ দিনের জন্য সাসপেন্ড করা হয়েছে!' :
          'ইউজার সফলভাবে আনসাসপেন্ড (সক্রিয়) করা হয়েছে!';

        toast.success(successMessage);
        fetchUsers();
      } else {
        toast.error(data.message || "স্ট্যাটাস আপডেট করা যায়নি!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("সার্ভার ত্রুটি!");
    }
  };

  // ডিলিট করার জন্য মোডাল ওপেন এবং আইডি সেট করা
  const openDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setIsOpen(true);
  };

  // পাকাপাকিভাবে ইউজার ডিলিট করা (Confirm করার পর)
  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUserId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        toast.success("ইউজার সফলভাবে পার্মানেন্টলি ডিলিট করা হয়েছে!");
        setUsers(users.filter(user => user._id !== selectedUserId));
        setIsOpen(false);
      } else {
        toast.error(data.message || "ইউজার ডিলিট করা যায়নি!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("সার্ভার ত্রুটি!");
    }
  };

  // সার্চ লজিক (নাম বা ইমেল দিয়ে সার্চ করার জন্য)
  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* হেডার সেকশন */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-danger mb-2">ইউজার ম্যানেজমেন্ট</h2>
        <p className="text-default-500 text-sm md:text-base">প্লাটফর্মে নিবন্ধিত সকল ব্যবহারকারী এবং তাদের স্ট্যাটাস পেশাদারভাবে পরিচালনা করুন।</p>
      </div>

      {/* সার্চ বার */}
      <div className="mb-8 bg-content2/60 p-5 rounded-2xl shadow-sm border border-default-200">
        <div className="w-full relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-default-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="নাম বা ইমেল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-default-300 bg-content1 text-default-900 font-medium focus:outline-none focus:border-danger transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ইউজার টেবিল */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-content1 rounded-2xl border border-dashed border-default-300 shadow-sm">
          <p className="text-lg text-default-400 font-medium">কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
        </div>
      ) : (
        <Card className="border border-default-200 overflow-hidden shadow-lg bg-content1 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-default-200 bg-content2/80 text-default-700 text-sm uppercase tracking-wider">
                  <th className="p-4.5 font-bold">ইউজার ইনফো</th>
                  <th className="p-4.5 font-bold">রোল</th>
                  <th className="p-4.5 font-bold">স্ট্যাটাস</th>
                  <th className="p-4.5 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100 text-sm">
                {filteredUsers.map((user) => {
                  const userStatus = user.status || 'active';
                  return (
                    <tr key={user._id} className="hover:bg-content2/40 transition-colors">
                      {/* ইউজার ইমেজ, নাম ও ইমেল */}
                      <td className="p-4.5">
                        <div className="flex items-center gap-3.5">
                          {user.image ? (
                            <img 
                              src={user.image} 
                              alt={user.name || 'User'} 
                              className="w-11 h-11 rounded-full object-cover border-2 border-danger shrink-0 shadow-sm"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold text-base shrink-0 shadow-sm border-2 border-danger/20">
                              {user.name ? user.name.charAt(0).toUpperCase() : <FaUser className="w-4 h-4" />}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-default-900 text-base">{user.name || 'নামহীন'}</p>
                            <p className="text-xs text-default-500 flex items-center gap-1.5 mt-0.5">
                              <FaEnvelope className="w-3 h-3 text-default-400" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* রোল */}
                      <td className="p-4.5">
                        <Chip 
                          color={user.role === 'admin' ? "danger" : "primary"} 
                          variant="flat" 
                          size="sm"
                          className="font-bold capitalize px-3"
                        >
                          <span className="flex items-center gap-1">
                            <FaShieldAlt className="text-xs" />
                            {user.role || 'user'}
                          </span>
                        </Chip>
                      </td>

                      {/* স্ট্যাটাস */}
                      <td className="p-4.5">
                        <Chip 
                          color={userStatus === 'active' ? "success" : userStatus === 'blocked' ? "danger" : "warning"} 
                          variant="flat" 
                          size="sm"
                          className="font-bold capitalize px-3"
                        >
                          {userStatus}
                        </Chip>
                        {userStatus === 'suspended' && user.suspendUntil && (
                          <p className="text-[11px] text-warning-600 mt-1 font-medium">
                            খুলবে: {new Date(user.suspendUntil).toLocaleDateString()}
                          </p>
                        )}
                      </td>

                      {/* অ্যাকশন বাটনগুলো */}
                      <td className="p-4.5">
                        <div className="flex items-center justify-center gap-2">
                          {userStatus === 'active' ? (
                            <>
                              {/* Suspend বাটন (৭ দিন) */}
                              <Button 
                                size="sm" 
                                style={{ backgroundColor: '#eab308', color: '#000' }} 
                                variant="solid"
                                onPress={() => handleUpdateStatus(user._id, 'suspend')}
                                className="font-semibold shadow-sm hover:opacity-90"
                              >
                                <FaHourglassHalf /> Suspend (7d)
                              </Button>

                              {/* Block বাটন */}
                              <Button 
                                size="sm" 
                                style={{ backgroundColor: '#71717a', color: '#fff' }} 
                                variant="solid"
                                onPress={() => handleUpdateStatus(user._id, 'block')}
                                className="font-semibold shadow-sm hover:opacity-90"
                              >
                                <FaBan /> Block
                              </Button>
                            </>
                          ) : (
                            /* Unsuspend বাটন */
                            <Button 
                              size="sm" 
                              color="success" 
                              variant="solid"
                              onPress={() => handleUpdateStatus(user._id, 'active')}
                              className="font-semibold text-white shadow-sm bg-green-600 hover:bg-green-700"
                            >
                              <FaUnlock /> Unsuspend
                            </Button>
                          )}

                          {/* Delete বাটন */}
                          <Button 
                            size="sm" 
                            color="danger" 
                            variant="solid"
                            onPress={() => openDeleteModal(user._id)}
                            className="font-semibold text-white shadow-sm bg-red-600 hover:bg-red-700"
                          >
                            <FaTrash /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* উন্নত এবং আকর্ষণীয় ক্লিন মোডাল ডিজাইন */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative transform transition-all scale-100">
            
            {/* ক্লোজ বাটন */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* মোডাল হেডার */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 shrink-0">
                <FaTrash className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                ইউজার ডিলিট নিশ্চিতকরণ
              </h3>
            </div>

            {/* মোডাল বডি */}
            <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base mb-6 leading-relaxed">
              আপনি কি নিশ্চিতভাবে এই ইউজারকে পার্মানেন্টলি ডিলিট করতে চান? এর সাথে এই ইউজারের সমস্ত ডাটা, পোস্ট এবং রেকর্ড চিরতরে মুছে যাবে।
            </p>

            {/* মোডাল ফুটার বাটন */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                বাতিল
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all"
              >
                হ্যাঁ, ডিলিট করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;