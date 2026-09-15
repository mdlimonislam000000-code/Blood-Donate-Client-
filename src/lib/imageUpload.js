'use client';
import React, { useState, useEffect } from 'react';
import { FaUser, FaSave, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

// ImgBB Upload Helper Function
export const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const apiKey = process.env.NEXT_PUBLIC_IMAGE_BB_API_KEY;
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("Image upload failed!");
  }
};

const GeneralInfo = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null); // নতুন ছবি স্টোর করার জন্য
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "", 
    presentAddress: {
      division: "",
      district: "",
      upazila: ""
    },
    permanentAddress: {
      division: "",
      district: "",
      upazila: ""
    }
  });

  // সেশন থেকে ইউজার ডেটা ফর্মে সেট করা
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        image: currentUser.image || "",
        presentAddress: currentUser.presentAddress || { division: "", district: "", upazila: "" },
        permanentAddress: currentUser.permanentAddress || { division: "", district: "", upazila: "" }
      });
      setImagePreview(currentUser.image || "");
    }
  }, [currentUser]);

  // ইনপুট হ্যান্ডলার (টেক্সট এবং নেস্টেড অবজেক্টের জন্য)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ইমেজ ফাইল সিলেক্ট করার হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // ডেটা আপডেট সাবমিট হ্যান্ডলার
  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) {
      toast.error("User not found!");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.image;

      // নতুন ফাইল থাকলে ImgBB-তে আপলোড করা হবে
      if (selectedImageFile) {
        toast.loading("Uploading profile image...", { id: "uploading" });
        imageUrl = await uploadImageToImgBB(selectedImageFile);
        toast.dismiss("uploading");
      }

      const updatedPayload = {
        ...formData,
        image: imageUrl
      };

      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("General information updated successfully!");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to update information.");
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaUser className="text-red-600" /> General Information
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Update your personal details, profile picture, and address information.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        
        {/* প্রোফাইল পিকচার সেকশন */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-red-500 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-3xl text-gray-400" />
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Profile Picture</label>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs font-medium rounded-lg cursor-pointer transition">
              <FaCamera className="text-red-600" /> Change Photo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, or WEBP (Max 2MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* নাম */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder={currentUser?.name || "Enter your full name"}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* ইমেইল */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              disabled
              placeholder={currentUser?.email || "Email address"}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm cursor-not-allowed"
            />
          </div>

          {/* ফোন নম্বর */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder={currentUser?.phone || "Enter your phone number"}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>

        </div>

        {/* বর্তমান ঠিকানা */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Present Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Division</label>
              <input 
                type="text" 
                name="presentAddress.division" 
                value={formData.presentAddress.division} 
                onChange={handleChange}
                placeholder={currentUser?.presentAddress?.division || "Division"}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">District</label>
              <input 
                type="text" 
                name="presentAddress.district" 
                value={formData.presentAddress.district} 
                onChange={handleChange}
                placeholder={currentUser?.presentAddress?.district || "District"}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Upazila</label>
              <input 
                type="text" 
                name="presentAddress.upazila" 
                value={formData.presentAddress.upazila} 
                onChange={handleChange}
                placeholder={currentUser?.presentAddress?.upazila || "Upazila"}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* স্থায়ী ঠিকানা */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Permanent Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Division</label>
              <input 
                type="text" 
                name="permanentAddress.division" 
                value={formData.permanentAddress.division} 
                onChange={handleChange}
                placeholder={currentUser?.permanentAddress?.division || "Division"}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">District</label>
              <input 
                type="text" 
                name="permanentAddress.district" 
                value={formData.permanentAddress.district} 
                onChange={handleChange}
                placeholder={currentUser?.permanentAddress?.district || "District"}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Upazila</label>
              <input 
                type="text" 
                name="permanentAddress.upazila"
                value={formData.permanentAddress.upazila} 
                onChange={handleChange}
                placeholder={currentUser?.permanentAddress?.upazila || "Upazila"}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default GeneralInfo;