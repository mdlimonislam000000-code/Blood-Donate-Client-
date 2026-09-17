"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaExclamationTriangle,
  FaClock,
  FaIdCard,
  FaSpinner,
  FaArrowLeft,
  FaShieldAlt,
  FaTint,
  FaUpload,
  FaHospital,
  FaUserInjured,
  FaPhoneAlt,
  FaNotesMedical,
  FaCheckCircle
} from "react-icons/fa";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// ImgBB Upload Helper Function
export const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const apiKey = process.env.NEXT_PUBLIC_IMAGE_BB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing in environment variables!");
  }

  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    console.error("ImgBB Error Response:", data);
    throw new Error(data.error?.message || "Image upload failed!");
  }
};

const UserCreateRequestPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [activeNotManageCount, setActiveNotManageCount] = useState(0);

  // ফর্মের স্টেট
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    bags: "",
    disease: "",
    hospitalName: "",
    hospitalLocation: "",
    patientPhone: "",
    guardianPhone: "",
    additionalNotes: "",
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // সেশন ও রেস্ট্রিকশন চেক (isMounted সহ)
  useEffect(() => {
    let isMounted = true;

    const checkUserRestrictions = async () => {
      try {
        const session = await authClient.getSession();
        const currentUserId = session?.data?.user?.id;

        if (!isMounted) return;

        if (session?.data?.user?.name) {
          setCurrentUserName(session.data.user.name);
        }

        if (!currentUserId) {
          if (isMounted) setLoading(false);
          return;
        }

        // ১. NID স্ট্যাটাস চেক
        const verifyRes = await fetch(
          `http://localhost:5000/api/verify-nid/status/${currentUserId}`
        );
        const verifyData = await verifyRes.json();

        if (!isMounted) return;

        if (verifyRes.ok && verifyData?.verification) {
          setVerificationStatus(verifyData.verification.status);
        }

        // ২. ইউজারের রক্তদানের রিকোয়েস্ট কাউন্ট চেক
        const reqRes = await fetch("http://localhost:5000/api/blood-requests");
        const reqData = await reqRes.json();

        if (!isMounted) return;

        if (reqData.success) {
          const userRequests = reqData.data.filter(
            (req) => req.userId === currentUserId
          );
          const notManageCount = userRequests.filter(
            (req) => !req.status || req.status === "Not Manage"
          ).length;
          setActiveNotManageCount(notManageCount);
        }
      } catch (error) {
        console.error("Error checking user restrictions:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUserRestrictions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "patientImage") {
      if (files && files[0]) {
        setSelectedImageFile(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const session = await authClient.getSession();
      const userId = session?.data?.user?.id;
      const userName = session?.data?.user?.name || currentUserName;

      let imageUrl = "";

      if (selectedImageFile) {
        toast.loading("Uploading patient image...", { id: "imageUpload" });
        try {
          imageUrl = await uploadImageToImgBB(selectedImageFile);
          toast.dismiss("imageUpload");
        } catch (uploadErr) {
          toast.dismiss("imageUpload");
          toast.error("ছবি আপলোড করতে ব্যর্থ হয়েছে!");
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        userId: userId || "",
        authorName: userName || "Anonymous",
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        bags: Number(formData.bags),
        disease: formData.disease,
        hospitalName: formData.hospitalName,
        hospitalLocation: formData.hospitalLocation,
        patientPhone: formData.patientPhone,
        guardianPhone: formData.guardianPhone,
        additionalNotes: formData.additionalNotes,
        patientImage: imageUrl,
      };

      const response = await fetch("http://localhost:5000/api/blood-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("রক্তের অনুরোধ সফলভাবে পোস্ট করা হয়েছে!");
        router.push("/dashboard/user/my-requests");
      } else {
        toast.error(result.message || "রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaTint className="text-red-600 animate-pulse text-xs" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-3 relative space-y-4">
      
      {/* Top Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all bg-white dark:bg-gray-800 px-3.5 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit cursor-pointer group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="p-1.5 bg-red-500/10 text-red-600 rounded-lg text-sm">
              <FaTint />
            </span>
            Create Emergency Blood Request
          </h1>
        </div>
      </div>

      {/* Verification / Limit Restrictions Modals & Banners */}
      {verificationStatus === "pending" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner border border-amber-500/20">
              <FaClock className="animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Verification Pending!
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                আপনার NID ভেরিফিকেশন রিকোয়েস্টটি বর্তমানে পেন্ডিং আছে। অ্যাডমিন যাচাই করার পর আপনি খুব শীঘ্রই রক্তের অনুরোধ পোস্ট করতে পারবেন।
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : verificationStatus !== "accepted" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner border border-red-500/20">
              <FaShieldAlt />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                NID Verification Required!
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                নিরাপত্তা ও স্ক্যাম এড়াতে জরুরি রক্তের অনুরোধ পোস্ট করার পূর্বে আপনার অ্যাকাউন্টটি NID দিয়ে ভেরিফাই করা বাধ্যতামূলক।
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => router.push("/dashboard/user/profile")}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/25 cursor-pointer"
              >
                <FaIdCard /> Go to Profile for Verification
              </button>
              <button
                onClick={() => router.back()}
                className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      ) : activeNotManageCount >= 3 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-red-100 dark:border-red-900/40 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner border border-red-500/20">
            <FaExclamationTriangle />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              নতুন রিকোয়েস্ট পোস্ট করার সীমা পূর্ণ!
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              আপনার বর্তমানে <span className="font-bold text-red-600">{activeNotManageCount}টি</span> রক্তের অনুরোধ <span className="font-bold text-amber-600">Not Manage</span> অবস্থায় রয়েছে। একসাথে সর্বোচ্চ ৩টি পেন্ডিং রিকোয়েস্ট রাখা যায়। নতুন পোস্ট করতে পূর্বেরগুলোর স্ট্যাটাস আপডেট করুন।
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/user/my-requests")}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
          >
            আমার রিকোয়েস্টগুলো ম্যানেজ করুন
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-4 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* স্লাইডিং নোটিশ বক্স */}
          <div className="bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border border-red-500/20 p-2.5 rounded-xl flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-red-600 text-white rounded-lg shadow-sm shadow-red-600/30 shrink-0 text-xs">
              <FaTint />
            </div>
            <div className="overflow-hidden whitespace-nowrap w-full">
              <div className="inline-block animate-[marquee_18s_linear_infinite] text-xs font-bold text-red-600 dark:text-red-400">
                সঠিক তথ্য দিয়ে রক্তদানের রিকোয়েস্ট পোস্ট করুন। আপনার একটি সঠিক তথ্য কোনো মুমূর্ষু রোগীর জীবন বাঁচাতে সাহায্য করতে পারে।
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 shrink-0 text-xs" /> 
              <span>Account verified successfully. You can post requests securely.</span>
            </div>
            <div className="text-[11px] bg-emerald-100 dark:bg-emerald-800/40 px-2.5 py-0.5 rounded-lg font-bold tracking-wide">
              Not Managed: <span className="text-red-600 dark:text-red-400">{activeNotManageCount}/3</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Patient Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaUserInjured className="text-red-500 text-xs" /> Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="রোগীর নাম লিখুন"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaTint className="text-red-500 text-xs" /> Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
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

              {/* Required Bags */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaTint className="text-red-500 text-xs" /> Required Bags (কত ব্যাগ)
                </label>
                <input
                  type="number"
                  name="bags"
                  value={formData.bags}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="যেমন: ২ ব্যাগ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Disease */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaNotesMedical className="text-red-500 text-xs" /> Disease / Medical Condition
                </label>
                <input
                  type="text"
                  name="disease"
                  value={formData.disease}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: থ্যালাসেমিয়া / অপারেশন"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaHospital className="text-red-500 text-xs" /> Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  placeholder="যে হাসপাতালে ভর্তি আছে"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Hospital Location */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaHospital className="text-red-500 text-xs" /> Hospital Location / Address
                </label>
                <input
                  type="text"
                  name="hospitalLocation"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  required
                  placeholder="এলাকা ও শহরের নাম"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Patient Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaPhoneAlt className="text-red-500 text-xs" /> Patient Phone Number <span className="text-gray-400 lowercase font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  placeholder="রোগীর বা যোগাযোগের নম্বর"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Guardian Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FaPhoneAlt className="text-red-500 text-xs" /> Guardian Phone Number
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  required
                  placeholder="অভিভাবকের মোবাইল নম্বর"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Patient Image Upload */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <FaUpload className="text-red-500 text-xs" /> Patient Image (রোগীর প্রেসক্রিপশন বা ছবি)
              </label>
              <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-900 text-xs text-gray-500 hover:border-red-500 cursor-pointer transition-all group">
                <div className="p-1.5 bg-red-500/10 text-red-600 rounded-lg group-hover:scale-110 transition-transform text-xs">
                  <FaUpload />
                </div>
                <span className="font-medium truncate">
                  {selectedImageFile ? selectedImageFile.name : "রোগীর ছবি বা প্রেসক্রিপশন সিলেক্ট করুন"}
                </span>
                <input
                  type="file"
                  name="patientImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <FaNotesMedical className="text-red-500 text-xs" /> Additional Notes <span className="text-gray-400 lowercase font-normal">(Optional)</span>
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows="2"
                placeholder="প্রয়োজনীয় অন্যান্য বিবরণ এখানে লিখতে পারেন..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-red-500 transition-colors resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 tracking-wider uppercase mt-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" /> Posting Request...
                </>
              ) : (
                "Post Emergency Request"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tailwind Marquee Animation Style */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default UserCreateRequestPage;