
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
        const response = await fetch('http://localhost:5000/api/blood-requests');
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* হেডার সেকশন */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-danger mb-2">সকল রক্তের অনুরোধসমূহ</h2>
        <p className="text-default-500">প্লাটফর্মে আসা সকল রক্তের অনুরোধ এবং সেগুলোর বর্তমান স্ট্যাটাস একনজরে দেখে নিন।</p>
      </div>

      {/* স্ট্যাটাস কাউন্টার এবং ফিল্টারিং ট্যাব */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
            statusFilter === 'all' 
              ? 'bg-content2 text-default-foreground border-danger shadow-md scale-[1.02]' 
              : 'bg-content1 hover:bg-content2 border-default-200 text-default-700'
          }`}
        >
          <div>
            <p className="text-sm font-medium text-default-500">Total Request</p>
            <h3 className="text-2xl font-extrabold mt-1 text-default-foreground">{totalCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-danger/10 text-danger">
            <FaTint className="text-xl" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Not Manage')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
            statusFilter === 'Not Manage' 
              ? 'bg-content2 text-default-foreground border-warning shadow-md scale-[1.02]' 
              : 'bg-content1 hover:bg-content2 border-default-200 text-default-700'
          }`}
        >
          <div>
            <p className="text-sm font-medium text-default-500">Not Manage</p>
            <h3 className="text-2xl font-extrabold mt-1 text-default-foreground">{notManageCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-warning/10 text-warning">
            <FaClock className="text-xl" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Manage Blood')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
            statusFilter === 'Manage Blood' 
              ? 'bg-content2 text-default-foreground border-success shadow-md scale-[1.02]' 
              : 'bg-content1 hover:bg-content2 border-default-200 text-default-700'
          }`}
        >
          <div>
            <p className="text-sm font-medium text-default-500">Managed</p>
            <h3 className="text-2xl font-extrabold mt-1 text-default-foreground">{managedCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-success/10 text-success">
            <FaCheckCircle className="text-xl" />
          </div>
        </div>
      </div>

      {/* সার্চ এবং ড্রপডাউন মেনু */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-content2 p-4 rounded-xl shadow-inner border border-default-200">
        <div className="w-full md:w-2/3 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-default-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="রোগীর নাম, হাসপাতাল বা লোকেশন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-default-300 bg-content1 text-white font-medium focus:outline-none focus:border-danger transition-colors"
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-default-300 bg-[#18181b] text-white font-semibold focus:outline-none focus:border-danger transition-colors cursor-pointer"
          >
            <option value="" className="bg-[#18181b] text-white py-2">সকল রক্তের গ্রুপ</option>
            <option value="A+" className="bg-[#18181b] text-white py-2">A+</option>
            <option value="A-" className="bg-[#18181b] text-white py-2">A-</option>
            <option value="B+" className="bg-[#18181b] text-white py-2">B+</option>
            <option value="B-" className="bg-[#18181b] text-white py-2">B-</option>
            <option value="AB+" className="bg-[#18181b] text-white py-2">AB+</option>
            <option value="AB-" className="bg-[#18181b] text-white py-2">AB-</option>
            <option value="O+" className="bg-[#18181b] text-white py-2">O+</option>
            <option value="O-" className="bg-[#18181b] text-white py-2">O-</option>
          </select>
        </div>
      </div>

      {/* কার্ড লিস্ট */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-content1 rounded-2xl border border-dashed border-default-300 shadow-sm">
          <p className="text-lg text-default-400 font-medium"> কোনো রক্তের অনুরোধ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const itemStatus = req.status ? req.status.toLowerCase().trim() : 'not manage';
            const isManaged = itemStatus === 'manage blood' || itemStatus === 'completed' || itemStatus === 'success';

            return (
              <Card key={req._id} shadow="sm" className="border border-default-200 flex flex-col justify-between p-0">
                {req.patientImage && (
                  <div className="h-48 overflow-hidden bg-default-100">
                    <img src={req.patientImage} alt="Patient" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-default-foreground">
                      <span className="text-danger"><FaUserInjured /></span> {req.patientName}
                    </h3>
                    <div className="bg-danger text-white px-3 py-1 rounded-full font-extrabold text-sm flex items-center gap-1.5 shadow-sm">
                      <FaTint className="text-white" /> {req.bloodGroup}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-default-600 my-3">
                    <p className="flex items-center gap-2"><FaHospital className="text-default-400" /> <span className="font-semibold text-default-700">হাসপাতাল:</span> {req.hospitalName}</p>
                    <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-default-400" /> <span className="font-semibold text-default-700">লোকেশন:</span> {req.hospitalLocation}</p>
                    <p><span className="font-semibold text-default-700">রক্তের ব্যাগ:</span> {req.bags} ব্যাগ</p>
                    <p><span className="font-semibold text-default-700">রোগের বিবরণ:</span> {req.disease || 'প্রযোজ্য নয়'}</p>
                    <p><span className="font-semibold text-default-700">অভিভাবক:</span> {req.guardianPhone}</p>
                  </div>

                  {/* স্ট্যাটাস ব্যাজ */}
                  <div className="mt-4 pt-3 border-t border-default-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-default-400">স্ট্যাটাস:</span>
                    <Chip 
                      color={isManaged ? "success" : "warning"} 
                      variant="flat" 
                      size="sm"
                      className="font-bold"
                    >
                      <span className="flex items-center gap-1.5">
                        {isManaged ? <FaCheckCircle /> : <FaClock />}
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