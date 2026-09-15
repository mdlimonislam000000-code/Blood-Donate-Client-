
'use client'
import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaHospital, FaMapMarkerAlt, FaTint, FaUserInjured } from 'react-icons/fa';


const BloodRequestsPage = () => {
     const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  // ব্যাকএন্ড থেকে ব্লাড রিকোয়েস্ট ফেচ করা
  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blood-requests');
        const data = await response.json();
        if (data.success) {
          // যেগুলোর স্ট্যাটাস 'completed', 'Success' বা 'Manage Blood' হয়েছে সেগুলো ফিল্টার করে বাদ দেওয়া
          // শুধুমাত্র 'Not Manage' বা যেসব রিকোয়েস্টের স্ট্যাটাস এখনো পেন্ডিং/ফাঁকা আছে সেগুলো দেখাবে
          const activeRequests = data.data.filter((req) => {
            const status = req.status ? req.status.toLowerCase().trim() : 'not manage';
            return status !== 'manage blood' && status !== 'completed' && status !== 'success';
          });
          setBloodRequests(activeRequests);
        }
      } catch (error) {
        console.error("Error fetching blood requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodRequests();
  }, []);

  // সার্চ এবং ব্লাড গ্রুপ ফিল্টার করার লজিক
  const filteredRequests = bloodRequests.filter((item) => {
    const matchesSearch = 
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hospitalLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedBloodGroup ? item.bloodGroup === selectedBloodGroup : true;

    return matchesSearch && matchesGroup;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-error mb-2">
          জরুরি রক্তের প্রয়োজন
        </h2>
        <p className="text-gray-600">
          রোগী পক্ষের দেওয়া রক্তের অনুরোধগুলো দেখুন। কোনো ডোনার রক্ত দিতে চাইলে
          সরাসরি যোগাযোগ করতে পারেন।
        </p>
      </div>

      {/* সার্চ এবং ফিল্টার সেকশন */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-base-200 p-4 rounded-xl shadow-sm">
        {/* সার্চ ইনপুট */}
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="রোগীর নাম, হাসপাতাল বা লোকেশন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* ব্লাড গ্রুপ ফিল্টার ড্রপডাউন */}
        <div className="w-full md:w-1/4">
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
      </div>

      {/* কার্ড লিস্ট */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-xl border">
          <p className="text-lg text-gray-500">
            কোনো জরুরি রক্তের অনুরোধ পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="card bg-base-100 shadow-xl border border-error/20 flex flex-col justify-between"
            >
              {req.patientImage && (
                <figure className="h-48 overflow-hidden">
                  <img
                    src={req.patientImage}
                    alt="Patient"
                    className="w-full h-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="card-title text-xl font-bold flex items-center gap-2">
                    <span className="text-error">
                      <FaUserInjured />
                    </span>{" "}
                    {req.patientName}
                  </h3>
                  <span className="bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 text-sm shrink-0">
                    <FaTint /> {req.bloodGroup}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600 my-2">
                  <p className="flex items-center gap-2">
                    <FaHospital className="text-gray-400" />{" "}
                    <span className="font-semibold">হাসপাতাল:</span>{" "}
                    {req.hospitalName}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />{" "}
                    <span className="font-semibold">লোকেশন:</span>{" "}
                    {req.hospitalLocation}
                  </p>
                  <p>
                    <span className="font-semibold">রক্তের ব্যাগ:</span>{" "}
                    {req.bags} ব্যাগ
                  </p>
                  <p>
                    <span className="font-semibold">রোগের বিবরণ:</span>{" "}
                    {req.disease || "প্রযোজ্য নয়"}
                  </p>
                  <p>
                    <span className="font-semibold">রোগীর যোগাযোগ:</span>{" "}
                    {req.patientPhone || "দেওয়া হয়নি"}
                  </p>
                  <p>
                    <span className="font-semibold">অভিভাবক:</span>{" "}
                    {req.guardianPhone}
                  </p>
                </div>

                {req.additionalNotes && (
                  <p className="text-xs bg-base-200 p-2 rounded text-gray-500 mb-2">
                    <span className="font-semibold">নোট:</span>{" "}
                    {req.additionalNotes}
                  </p>
                )}

                <div className="card-actions justify-end mt-4">
                  <a
                    href={`tel:${req.guardianPhone}`}
                    className="btn bg-red-600 hover:bg-red-700 text-white font-bold w-full rounded-full flex items-center justify-center gap-2 shadow-md border-none"
                  >
                    <FaPhoneAlt /> Call Guardian
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodRequestsPage;
