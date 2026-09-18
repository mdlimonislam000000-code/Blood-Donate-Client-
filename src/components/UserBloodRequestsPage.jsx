"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaUserInjured,
  FaEdit,
  FaTimes,
  FaSave,
  FaKey,
  FaCopy,
} from "react-icons/fa";
import toast from "react-hot-toast";

const UserBloodRequestsPage = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Status management states
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const fetchMyRequests = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/blood-requests",
        );
        const data = await response.json();
        if (data.success) {
          const filtered = data.data.filter(
            (req) => req.userId === session.user.id,
          );
          setMyRequests(filtered);

          const initialStatuses = {};
          filtered.forEach((req) => {
            initialStatuses[req._id] = req.status || "Not Manage";
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

  // Filtering & Sorting logic
  const filteredRequests = myRequests
    .filter((item) => {
      const matchesSearch =
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospitalLocation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = selectedBloodGroup
        ? item.bloodGroup === selectedBloodGroup
        : true;

      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      if (sortOrder === "latest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const handleEditClick = (req) => {
    setCurrentEditItem(req);
    setIsEditing(true);
  };

  const handleDropdownChange = (id, value) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [id]: value,
    });
  };

  const handleSaveStatus = async (id) => {
    const newStatus = selectedStatuses[id];
    try {
      const response = await fetch(
        `http://localhost:5000/api/blood-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Status updated successfully!");
        fetchMyRequests();
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error saving status:", error);
      toast.error("Server connection error.");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Secret code copied to clipboard!");
  };

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
        disease: currentEditItem.disease || "",
        patientPhone: currentEditItem.patientPhone || "",
        additionalNotes: currentEditItem.additionalNotes || "",
      };

      const response = await fetch(
        `http://localhost:5000/api/blood-requests/${currentEditItem._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Blood request updated successfully!");
        setIsEditing(false);
        fetchMyRequests();
      } else {
        toast.error(data.message || "Failed to update request.");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Server connection error.");
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
      <div className="text-center py-20 px-4">
        <h3 className="text-xl font-bold text-gray-600">
          Please login first to view this page!
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 overflow-x-hidden">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-2 md:mb-3">
          My <span className="text-error">Blood Requests</span>
        </h2>
        <p className="text-xs md:text-base text-gray-500 leading-relaxed px-2">
          Easily track, manage, or update all the blood donation requests you have posted.
        </p>
      </div>

      {/* Search, Filter & Sorting Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 bg-white p-3.5 md:p-5 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <input
            type="text"
            placeholder="Search by patient, hospital, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full text-xs md:text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900"
          />
        </div>
        <div>
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="select select-bordered w-full text-xs md:text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900"
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
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-bordered w-full text-xs md:text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 px-4">
          <p className="text-base md:text-lg font-medium text-gray-400">
            No blood requests found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const currentSelectedStatus =
              selectedStatuses[req._id] || "Not Manage";

            const isManaged = req.status === "Manage Blood";

            return (
              <div
                key={req._id}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between overflow-hidden group"
              >
                {req.patientImage && (
                  <div className="h-48 overflow-hidden w-full relative rounded-t-3xl">
                    <img
                      src={req.patientImage}
                      alt="Patient"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-error flex items-center justify-center shrink-0">
                        <FaUserInjured size={18} />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-800 truncate">
                        {req.patientName}
                      </h3>
                    </div>
                    {/* Blood Group Badge */}
                    <span className="bg-red-600 text-white font-black px-3 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5 text-xs md:text-sm shrink-0 border border-red-500">
                      <FaTint size={12} className="text-red-200 animate-pulse" /> {req.bloodGroup}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs md:text-sm text-gray-600 mb-4 flex-grow">
                    <div className="flex items-center gap-2 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                      <FaHospital className="text-error shrink-0" size={14} />
                      <span className="font-semibold text-gray-800 truncate">
                        {req.hospitalName}
                      </span>
                      <span className="text-gray-300 font-light">|</span>
                      <FaMapMarkerAlt className="text-gray-400 shrink-0" size={13} />
                      <span className="text-gray-500 truncate">
                        {req.hospitalLocation}
                      </span>
                    </div>

                    <div className="pt-1 grid grid-cols-2 gap-2 border-t border-gray-50 mt-2">
                      <div>
                        <span className="font-semibold text-gray-700">Bags:</span> {req.bags}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Disease:</span>{" "}
                        <span className="truncate inline-block max-w-[110px] align-bottom">
                          {req.disease || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Patient Ph:</span>{" "}
                        {req.patientPhone || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Guardian:</span>{" "}
                        {req.guardianPhone}
                      </div>
                    </div>
                  </div>

                  {req.additionalNotes && (
                    <div className="text-xs bg-gray-50 p-3 rounded-2xl text-gray-500 mb-4 border border-gray-100">
                      <span className="font-semibold text-gray-700">Note:</span>{" "}
                      {req.additionalNotes}
                    </div>
                  )}

                  {req.donationCode && req.status === "Manage Blood" && (
                    <div className="mb-4 p-3 bg-red-50/80 border border-red-100 rounded-2xl flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <FaKey size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                            Secret Code
                          </p>
                          <p className="text-xs md:text-sm font-mono font-bold tracking-widest text-red-700 truncate">
                            {req.donationCode}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(req.donationCode)}
                        className="p-2 bg-white hover:bg-red-100 text-red-600 rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0 border border-red-100"
                        title="Copy Secret Code"
                      >
                        <FaCopy size={14} />
                      </button>
                    </div>
                  )}

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-gray-100 bg-gray-50/50 -mx-4 md:-mx-6 -mb-4 md:-mb-6 p-4 rounded-b-3xl mt-auto">
                    <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                      <button
                        onClick={() => handleEditClick(req)}
                        disabled={isManaged}
                        className={`btn btn-sm rounded-2xl w-full sm:flex-1 flex items-center justify-center gap-1.5 font-semibold shadow-2xs transition-all ${
                          isManaged
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white hover:bg-red-50 text-error border border-error/30"
                        }`}
                      >
                        <FaEdit /> Edit
                      </button>

                      <div className="w-full sm:flex-1">
                        <select
                          value={currentSelectedStatus}
                          onChange={(e) =>
                            handleDropdownChange(req._id, e.target.value)
                          }
                          disabled={isManaged}
                          className={`select rounded-2xl w-full text-xs font-bold border transition-all shadow-xs py-3 px-4 h-auto ${
                            isManaged
                              ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                              : currentSelectedStatus === "Manage Blood"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                              : "bg-gradient-to-r from-rose-500 to-red-600 text-white border-transparent hover:opacity-95 shadow-sm"
                          }`}
                        >
                          <option value="Not Manage" className="bg-white text-gray-900 font-medium py-2">
                            ⏳ Pending / Not Managed
                          </option>
                          <option value="Manage Blood" className="bg-white text-gray-900 font-medium py-2">
                            ✨ Successfully Managed
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Show Save Button ONLY when "Manage Blood" is selected from dropdown and not already managed in DB */}
                    {!isManaged && currentSelectedStatus === "Manage Blood" && (
                      <div className="mt-2.5 animate-fadeIn">
                        <button
                          onClick={() => handleSaveStatus(req._id)}
                          className="btn btn-sm rounded-2xl bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center gap-2 border-none shadow-md font-bold tracking-wide cursor-pointer"
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

      {/* Edit Modal */}
      {isEditing && currentEditItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="font-bold text-base md:text-lg flex items-center gap-2 text-white">
                  <FaEdit className="shrink-0" /> Edit Blood Request
                </h3>
                <p className="text-xs text-red-100 mt-0.5 truncate">
                  Patient: <span className="font-semibold">{currentEditItem.patientName}</span>
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-white hover:bg-red-700 p-2 rounded-full transition-colors cursor-pointer shrink-0"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-left"
            >
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={currentEditItem.patientName || ""}
                  onChange={(e) =>
                    setCurrentEditItem({
                      ...currentEditItem,
                      patientName: e.target.value,
                    })
                  }
                  className="input input-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={currentEditItem.bloodGroup || ""}
                    onChange={(e) =>
                      setCurrentEditItem({
                        ...currentEditItem,
                        bloodGroup: e.target.value,
                      })
                    }
                    className="select select-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
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
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                    Blood Bags
                  </label>
                  <input
                    type="number"
                    value={currentEditItem.bags || ""}
                    onChange={(e) =>
                      setCurrentEditItem({
                        ...currentEditItem,
                        bags: e.target.value,
                      })
                    }
                    className="input input-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={currentEditItem.hospitalName || ""}
                  onChange={(e) =>
                    setCurrentEditItem({
                      ...currentEditItem,
                      hospitalName: e.target.value,
                    })
                  }
                  className="input input-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                  Hospital Location
                </label>
                <input
                  type="text"
                  value={currentEditItem.hospitalLocation || ""}
                  onChange={(e) =>
                    setCurrentEditItem({
                      ...currentEditItem,
                      hospitalLocation: e.target.value,
                    })
                  }
                  className="input input-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                  Guardian Phone Number
                </label>
                <input
                  type="text"
                  value={currentEditItem.guardianPhone || ""}
                  onChange={(e) =>
                    setCurrentEditItem({
                      ...currentEditItem,
                      guardianPhone: e.target.value,
                    })
                  }
                  className="input input-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">
                  Disease Details
                </label>
                <input
                  type="text"
                  value={currentEditItem.disease || ""}
                  onChange={(e) =>
                    setCurrentEditItem({
                      ...currentEditItem,
                      disease: e.target.value,
                    })
                  }
                  className="input input-bordered w-full text-sm rounded-2xl bg-gray-50/50 focus:bg-white text-gray-900 border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost btn-sm md:btn-md rounded-2xl px-4 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm md:btn-md rounded-2xl bg-red-600 hover:bg-red-700 text-white px-6 border-none shadow-sm font-bold"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBloodRequestsPage;