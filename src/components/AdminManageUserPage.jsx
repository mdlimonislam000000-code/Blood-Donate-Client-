'use client'
import React, { useState, useEffect } from 'react';
import { Card, Spinner, Chip, Button } from "@heroui/react";
import { FaUser, FaEnvelope, FaTrash, FaSearch, FaHourglassHalf, FaShieldAlt, FaUnlock, FaBan, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user status (Block, Suspend, or Active/Unsuspend)
  const handleUpdateStatus = async (userId, statusType) => {
    let bodyData = {};
    if (statusType === 'block') {
      bodyData = { status: 'blocked' };
    } else if (statusType === 'suspend') {
      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspend for 7 days
      bodyData = { status: 'suspended', suspendUntil: suspendUntil.toISOString() };
    } else if (statusType === 'active') {
      bodyData = { status: 'active', suspendUntil: null };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      if (data.success) {
        const successMessage = 
          statusType === 'block' ? 'User successfully blocked!' :
          statusType === 'suspend' ? 'User successfully suspended for 7 days!' :
          'User successfully unsuspended (activated)!';

        toast.success(successMessage);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Server error!");
    }
  };

  const openDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${selectedUserId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        toast.success("User permanently deleted successfully!");
        setUsers(users.filter(user => user._id !== selectedUserId));
        setIsOpen(false);
      } else {
        toast.error(data.message || "Failed to delete user!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Server error!");
    }
  };

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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 relative text-slate-800 dark:text-slate-100">
      
      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mb-1.5">User Management</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Professionally manage all registered users and their account statuses on the platform.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="w-full relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 transition-all"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm text-slate-400 font-medium">No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl bg-white dark:bg-slate-900 rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">User Info</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                    {filteredUsers.map((user) => {
                      const userStatus = user.status || 'active';
                      return (
                        <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {user.image ? (
                                <img 
                                  src={user.image} 
                                  alt={user.name || 'User'} 
                                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/30 shrink-0 shadow-sm"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0 border border-rose-200 dark:border-rose-900">
                                  {user.name ? user.name.charAt(0).toUpperCase() : <FaUser size={12} />}
                                </div>
                              )}
                              <div className="overflow-hidden">
                                <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{user.name || 'Unnamed'}</p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                  <FaEnvelope size={10} className="shrink-0" /> {user.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <Chip 
                              color={user.role === 'admin' ? "danger" : "primary"} 
                              variant="flat" 
                              size="sm"
                              className="font-bold capitalize text-[11px]"
                            >
                              <span className="flex items-center gap-1">
                                <FaShieldAlt size={10} />
                                {user.role || 'user'}
                              </span>
                            </Chip>
                          </td>

                          <td className="p-4">
                            <Chip 
                              color={userStatus === 'active' ? "success" : userStatus === 'blocked' ? "danger" : "warning"} 
                              variant="flat" 
                              size="sm"
                              className="font-bold capitalize text-[11px]"
                            >
                              {userStatus}
                            </Chip>
                            {userStatus === 'suspended' && user.suspendUntil && (
                              <p className="text-[10px] text-amber-500 mt-0.5 font-medium">
                                Unlocks: {new Date(user.suspendUntil).toLocaleDateString()}
                              </p>
                            )}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {userStatus === 'active' ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-amber-500 text-black text-xs font-semibold h-8"
                                    onPress={() => handleUpdateStatus(user._id, 'suspend')}
                                  >
                                    <FaHourglassHalf size={11} /> Suspend (7d)
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-zinc-600 text-white text-xs font-semibold h-8"
                                    onPress={() => handleUpdateStatus(user._id, 'block')}
                                  >
                                    <FaBan size={11} /> Block
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="bg-emerald-600 text-white text-xs font-semibold h-8"
                                  onPress={() => handleUpdateStatus(user._id, 'active')}
                                >
                                  <FaUnlock size={11} /> Unsuspend
                                </Button>
                              )}

                              <Button 
                                size="sm" 
                                className="bg-rose-600 text-white text-xs font-semibold h-8"
                                onPress={() => openDeleteModal(user._id)}
                              >
                                <FaTrash size={11} /> Delete
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
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredUsers.map((user) => {
              const userStatus = user.status || 'active';
              return (
                <div key={user._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || 'User'} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/30 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-200">
                          {user.name ? user.name.charAt(0).toUpperCase() : <FaUser size={12} />}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{user.name || 'Unnamed'}</p>
                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <FaEnvelope size={9} className="shrink-0" /> {user.email}
                        </p>
                      </div>
                    </div>
                    <Chip 
                      color={user.role === 'admin' ? "danger" : "primary"} 
                      variant="flat" 
                      size="sm"
                      className="font-bold capitalize text-[10px] shrink-0"
                    >
                      {user.role || 'user'}
                    </Chip>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="text-slate-400 text-[11px]">Status:</span>
                    <div className="text-right">
                      <Chip 
                        color={userStatus === 'active' ? "success" : userStatus === 'blocked' ? "danger" : "warning"} 
                        variant="flat" 
                        size="sm"
                        className="font-bold capitalize text-[10px]"
                      >
                        {userStatus}
                      </Chip>
                      {userStatus === 'suspended' && user.suspendUntil && (
                        <p className="text-[9px] text-amber-500 mt-0.5">
                          Unlocks: {new Date(user.suspendUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {userStatus === 'active' ? (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(user._id, 'suspend')}
                          className="px-2.5 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold rounded-lg hover:bg-amber-500/20 transition"
                        >
                          Suspend
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(user._id, 'block')}
                          className="px-2.5 py-1.5 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold rounded-lg hover:bg-zinc-500/20 transition"
                        >
                          Block
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(user._id, 'active')}
                        className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold rounded-lg hover:bg-emerald-500/20 transition"
                      >
                        Unsuspend
                      </button>
                    )}

                    <button 
                      onClick={() => openDeleteModal(user._id)}
                      className="px-2.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-semibold rounded-lg hover:bg-rose-500/20 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-5 relative">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full"
            >
              <FaTimes size={12} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 shrink-0">
                <FaTrash size={14} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirm User Deletion
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
              Are you sure you want to permanently delete this user? All data associated with this user will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition"
              >
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUserPage;