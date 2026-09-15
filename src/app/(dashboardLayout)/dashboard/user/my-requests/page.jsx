'use client'
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { FaHospital, FaMapMarkerAlt, FaTint, FaUserInjured, FaEdit, FaTimes, FaSave, FaKey, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyRequest = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  // এডিটিং এর জন্য স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // প্রতিটি কার্ডের টেম্পোরারি স্ট্যাটাস ট্র্যাক করার জন্য স্টেট
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const fetchMyRequests = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch('http://localhost:5000/api/blood-requests');
        const data = await response.json();
        if (data.success) {
          const filtered = data.data.filter(
            (req) => req.userId === session.user.id
          );
          setMyRequests(filtered);
          
          // ইনিশিয়ালি ডাটাবেজের স্ট্যাটাসগুলো সেট করে নেওয়া
          const initialStatuses = {};
          filtered.forEach(req => {
            initialStatuses[req._id] = req.status || 'Not Manage';
          });
          setSelectedStatuses(initialStatuses);
        }
      } catch (error) {
        console.error("Error fetching my requests:", error);
      } finally {
        setLoading(false);
      }
    } else if (!sessionLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [session, sessionLoading]);

  // ফিল্টারিং এবং সোর্টিং লজিক
  const filteredRequests = myRequests
    .filter((item) => {
      const matchesSearch = 
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospitalLocation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = selectedBloodGroup ? item.bloodGroup === selectedBloodGroup : true;

      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      if (sortOrder === 'latest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  // এডিট হ্যান্ডলার (মডাল ওপেন করা)
  const handleEditClick = (req) => {
    setCurrentEditItem(req);
    setIsEditing(true);
  };

  // ড্রপডাউন চেঞ্জ হ্যান্ডলার
  const handleDropdownChange = (id, value) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [id]: value
    });
  };

  // সেভ বাটনে ক্লিক করলে ডাটাবেজে স্ট্যাটাস আপডেট করার ফাংশন
  const handleSaveStatus = async (id) => {
    const newStatus = selectedStatuses[id];
    try {
      const response = await fetch(`http://localhost:5000/api/blood-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("স্ট্যাটাস সফলভাবে সেভ করা হয়েছে!");
        fetchMyRequests();
      } else {
        toast.error(data.message || "স্ট্যাটাস সেভ করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Error saving status:", error);
      toast.error("সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।");
    }
  };

  // সিক্রেট কোড কপি করার ফাংশন
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Secret code copied to clipboard!");
  };

  // এডিট ফর্ম সাবমিট করার ফাংশন
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPayload = {
        patientName: currentEditItem.patientName,
        bloodGroup: currentEditItem.bloodGroup,
        bags: Number(currentEditItem.bags),
        hospitalName: currentEditItem.hospitalName,
        hospitalLocation: currentEditItem.hospitalLocation,
        guardianPhone: currentEditItem.guardianPhone,
        disease: currentEditItem.disease || '',
        patientPhone: currentEditItem.patientPhone || '',
        additionalNotes: currentEditItem.additionalNotes || ''
      };

      const response = await fetch(`http://localhost:5000/api/blood-requests/${currentEditItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("অনুরোধ সফলভাবে আপডেট করা হয়েছে!");
        setIsEditing(false);
        fetchMyRequests();
      } else {
        toast.error(data.message || "আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।");
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-gray-600">দয়া করে প্রথমে লগইন করুন!</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-error mb-2">আমার রক্তের অনুরোধসমূহ</h2>
        <p className="text-gray-600">আপনি যে রক্তের অনুরোধগুলো পোস্ট করেছেন তা এখানে দেখতে এবং ম্যানেজ করতে পারবেন।</p>
      </div>

      {/* সার্চ, ফিল্টার এবং সোর্টিং সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-base-200 p-4 rounded-xl shadow-sm">
        <div>
          <input
            type="text"
            placeholder="রোগীর নাম, হাসপাতাল বা লোকেশন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">সকল রক্তের গ্রুপ</option>
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
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="latest">নতুন থেকে পুরানো (Latest first)</option>
            <option value="oldest">পুরানো থেকে নতুন (Oldest first)</option>
          </select>
        </div>
      </div>

      {/* কার্ড লিস্ট */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-xl border">
          <p className="text-lg text-gray-500">কোনো রক্তের অনুরোধ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const currentSelectedStatus = selectedStatuses[req._id] || 'Not Manage';
            const originalStatus = req.status || 'Not Manage';
            const isStatusChanged = currentSelectedStatus !== originalStatus;
            
            const isManaged = req.status === 'Manage Blood' || currentSelectedStatus === 'Manage Blood';

            return (
              <div key={req._id} className="card bg-base-100 shadow-xl border border-error/20 flex flex-col justify-between">
                {req.patientImage && (
                  <figure className="h-48 overflow-hidden">
                    <img src={req.patientImage} alt="Patient" className="w-full h-full object-cover" />
                  </figure>
                )}
                <div className="card-body">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="card-title text-xl font-bold flex items-center gap-2">
                      <span className="text-error"><FaUserInjured /></span> {req.patientName}
                    </h3>
                    <span className="bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 text-sm shrink-0">
                      <FaTint /> {req.bloodGroup}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600 my-2">
                    <p className="flex items-center gap-2"><FaHospital className="text-gray-400" /> <span className="font-semibold">হাসপাতাল:</span> {req.hospitalName}</p>
                    <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> <span className="font-semibold">লোকেশন:</span> {req.hospitalLocation}</p>
                    <p><span className="font-semibold">রক্তের ব্যাগ:</span> {req.bags} ব্যাগ</p>
                    <p><span className="font-semibold">রোগের বিবরণ:</span> {req.disease || 'প্রযোজ্য নয়'}</p>
                    <p><span className="font-semibold">রোগীর যোগাযোগ:</span> {req.patientPhone || 'দেওয়া হয়নি'}</p>
                    <p><span className="font-semibold">অভিভাবক:</span> {req.guardianPhone}</p>
                  </div>

                  {req.additionalNotes && (
                    <p className="text-xs bg-base-200 p-2 rounded text-gray-500 mb-2">
                      <span className="font-semibold">নোট:</span> {req.additionalNotes}
                    </p>
                  )}

                  {/* 🔑 সিক্রেট কোড (শুধুমাত্র ডাটাবেজে 'Manage Blood' সেভ হওয়ার পরই দেখাবে) */}
                  {req.donationCode && req.status === 'Manage Blood' && (
                    <div className="my-3 p-3 bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <FaKey className="text-red-600" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500">Secret Donation Code</p>
                          <p className="text-sm font-mono font-bold tracking-widest text-red-600 dark:text-red-400">{req.donationCode}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopyCode(req.donationCode)}
                        className="p-2 bg-white dark:bg-gray-700 hover:bg-red-100 text-red-600 rounded-lg shadow-xs transition-colors cursor-pointer"
                        title="Copy Code"
                      >
                        <FaCopy size={14} />
                      </button>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 bg-gray-50 p-3 rounded-xl shadow-inner space-y-2.5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(req)}
                        disabled={isManaged}
                        className={`btn btn-sm flex-1 flex items-center justify-center gap-1.5 font-semibold shadow-sm transition-all ${
                          isManaged 
                            ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' 
                            : 'bg-white hover:bg-red-50 text-error border border-error/40'
                        }`}
                      >
                        <FaEdit /> Edit
                      </button>

                      <div className="flex-1">
                        <select
                          value={currentSelectedStatus}
                          onChange={(e) => handleDropdownChange(req._id, e.target.value)}
                          disabled={req.status === 'Manage Blood'}
                          className={`select select-sm w-full text-xs font-bold border transition-all ${
                            req.status === 'Manage Blood'
                              ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed' 
                              : currentSelectedStatus === 'Manage Blood'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="Not Manage" className="bg-white text-gray-800">⏳ Not Manage</option>
                          <option value="Manage Blood" className="bg-white text-gray-800">✅ Manage Blood</option>
                        </select>
                      </div>
                    </div>

                    {isStatusChanged && req.status !== 'Manage Blood' && (
                      <div className="animate-fadeIn pt-1">
                        <button 
                          onClick={() => handleSaveStatus(req._id)}
                          className="btn btn-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white w-full flex items-center justify-center gap-2 border-none shadow-md font-bold tracking-wide"
                        >
                          <FaSave /> Save Status
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* এডিট মডাল */}
      {isEditing && currentEditItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 transform transition-all scale-100">
            
            <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FaEdit /> রক্তের অনুরোধ এডিট করুন
                </h3>
                <p className="text-xs text-red-100 mt-0.5">
                  রোগী: <span className="font-semibold">{currentEditItem.patientName}</span> | হাসপাতাল: <span className="font-semibold">{currentEditItem.hospitalName}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsEditing(false)} 
                className="text-white hover:bg-red-700 p-2 rounded-full transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">রোগীর নাম</label>
                <input
                  type="text"
                  value={currentEditItem.patientName || ''}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, patientName: e.target.value})}
                  className="input input-bordered w-full focus:input-error"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={currentEditItem.bloodGroup || ''}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, bloodGroup: e.target.value})}
                    className="select select-bordered w-full focus:select-error"
                  >
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">রক্তের ব্যাগ</label>
                  <input
                    type="number"
                    value={currentEditItem.bags || ''}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, bags: e.target.value})}
                    className="input input-bordered w-full focus:input-error"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">হাসপাতালের নাম</label>
                <input
                  type="text"
                  value={currentEditItem.hospitalName || ''}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, hospitalName: e.target.value})}
                  className="input input-bordered w-full focus:input-error"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">হাসপাতালের লোকেশন</label>
                <input
                  type="text"
                  value={currentEditItem.hospitalLocation || ''}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, hospitalLocation: e.target.value})}
                  className="input input-bordered w-full focus:input-error"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">অভিভাবকের ফোন নম্বর</label>
                <input
                  type="text"
                  value={currentEditItem.guardianPhone || ''}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, guardianPhone: e.target.value})}
                  className="input input-bordered w-full focus:input-error"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">রোগের বিবরণ</label>
                <input
                  type="text"
                  value={currentEditItem.disease || ''}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, disease: e.target.value})}
                  className="input input-bordered w-full focus:input-error"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn btn-ghost px-5"
                >
                  বাতিল
                </button>
                <button 
                  type="submit" 
                  className="btn bg-red-600 hover:bg-red-700 text-white px-6 border-none"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequest;