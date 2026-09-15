'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaClock, FaIdCard, FaSpinner, FaArrowLeft, FaShieldAlt, FaTint, FaUpload, FaHeartbeat } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

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

const CreateRequest = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); 
  const [currentUserName, setCurrentUserName] = useState('');
  const [activeNotManageCount, setActiveNotManageCount] = useState(0);

  // ফর্মের স্টেট
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    bags: '',
    disease: '',
    hospitalName: '',
    hospitalLocation: '',
    patientPhone: '',
    guardianPhone: '',
    additionalNotes: ''
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // BetterAuth সেশন, NID ভেরিফিকেশন এবং পেন্ডিং রিকোয়েস্ট চেক করা
  useEffect(() => {
    const checkUserRestrictions = async () => {
      try {
        const session = await authClient.getSession();
        const currentUserId = session?.data?.user?.id;
        
        if (session?.data?.user?.name) {
          setCurrentUserName(session.data.user.name);
        }

        if (!currentUserId) {
          setLoading(false);
          return;
        }

        // ১. NID স্ট্যাটাস চেক
        const verifyRes = await fetch(`http://localhost:5000/api/verify-nid/status/${currentUserId}`);
        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData?.verification) {
          setVerificationStatus(verifyData.verification.status);
        }

        // ২. ইউজারের রক্তদানের রিকোয়েস্টগুলো ফেচ করে 'Not Manage' স্ট্যাটাস কাউন্ট করা
        const reqRes = await fetch('http://localhost:5000/api/blood-requests');
        const reqData = await reqRes.json();

        if (reqData.success) {
          const userRequests = reqData.data.filter(req => req.userId === currentUserId);
          const notManageCount = userRequests.filter(req => !req.status || req.status === 'Not Manage').length;
          setActiveNotManageCount(notManageCount);
        }

      } catch (error) {
        console.error('Error checking user restrictions:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRestrictions();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'patientImage') {
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
        userId: userId || '',
        authorName: userName || 'Anonymous',
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

      const response = await fetch('http://localhost:5000/api/blood-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('রক্তের অনুরোধ সফলভাবে পোস্ট করা হয়েছে!');
        router.push('/dashboard/user/my-requests');
      } else {
        toast.error(result.message || 'রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-red-600 text-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 relative space-y-6">
      
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit cursor-pointer"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Emergency Blood Request</h1>

      {verificationStatus === 'pending' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-5 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
              <FaClock className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verification Pending!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                আপনার NID ভেরিফিকেশন রিকোয়েস্টটি বর্তমানে পেন্ডিং আছে। দয়া করে অপেক্ষা করুন, অ্যাডমিন আপনার তথ্য যাচাই করে খুব শীঘ্রই তা গ্রহণ (Accept) করবেন।
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => router.back()}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      ) : verificationStatus !== 'accepted' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-5 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
              <FaShieldAlt />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">NID Verification Required!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Emergency রক্তের অনুরোধ পোস্ট করার পূর্বে যেকোনো প্রকার স্ক্যাম বা প্রতারণা এড়িয়ে চলার জন্য নিরাপত্তার স্বার্থে আমরা NID ভেরিফিকেশন নিয়ে থাকি। দয়া করে অ্যাকাউন্টটি স্ক্যাম এড়াতে ভেরিফাই করুন।
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => router.push('/dashboard/user/profile')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-red-600/25 cursor-pointer"
              >
                <FaIdCard /> Go to Profile for Verification
              </button>
              <button
                onClick={() => router.back()}
                className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      ) : activeNotManageCount >= 3 ? (
        // যদি ইউজারের 'Not Manage' স্ট্যাটাসের রিকোয়েস্ট ৩টি বা তার বেশি হয়ে যায়
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-red-100 dark:border-red-900/40 text-center space-y-5">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            <FaExclamationTriangle />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">নতুন রিকোয়েস্ট পোস্ট করার সীমা পূর্ণ হয়েছে!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              আপনার বর্তমানে <span className="font-bold text-red-600">{activeNotManageCount}টি</span> রক্তের অনুরোধ <span className="font-bold text-amber-600">Not Manage</span> অবস্থায় রয়েছে। একসাথে সর্বোচ্চ ৩টি পর্যন্ত পেন্ডিং বা 'Not Manage' রিকোয়েস্ট রাখা যায়। নতুন পোস্ট করতে চাইলে পূর্বের রিকোয়েস্টগুলোর রক্ত ম্যানেজ করে স্ট্যাটাস আপডেট করুন।
            </p>
          </div>
          <div>
            <button
              onClick={() => router.push('/dashboard/user/my-requests')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              আমার রিকোয়েস্টগুলো ম্যানেজ করুন
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          
          {/* জীবন বাঁচানোর আহ্বান সংক্রান্ত নোটিশ ব্যানার */}
          <div className="bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/10 dark:from-red-950/40 dark:to-rose-950/40 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-xl shadow-sm mt-0.5">
              <FaHeartbeat size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-700 dark:text-red-400">সঠিক তথ্য দিন, রোগীর জীবন বাঁচান!</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                জরুরি মুহূর্তে সঠিক তথ্য দিয়ে রক্তদাতাদের সহযোগিতা করুন। আপনার একটি সঠিক তথ্য মুমূর্ষু রোগীর জীবন বাঁচাতে পারে। বিভ্রান্তিকর তথ্য প্রদান থেকে বিরত থাকুন।
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-green-600 dark:text-green-400 font-medium text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2">
              <FaTint /> Your account is verified. You can post an emergency blood request securely.
            </div>
            <div className="text-xs bg-green-100 dark:bg-green-800/40 px-2.5 py-1 rounded-lg">
              Not Manage: <span className="font-bold">{activeNotManageCount}/3</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Patient Name</label>
                <input 
                  type="text" 
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="রোগীর নাম লিখুন" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Blood Group</label>
                <select 
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Required Bags (কত ব্যাগ)</label>
                <input 
                  type="number" 
                  name="bags"
                  value={formData.bags}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="যেমন: ২ ব্যাগ" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Disease / Medical Condition (কী রোগ)</label>
                <input 
                  type="text" 
                  name="disease"
                  value={formData.disease}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: থ্যালাসেমিয়া / অপারেশন" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hospital Name (হাসপাতালের নাম)</label>
                <input 
                  type="text" 
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  placeholder="যে হাসপাতালে ভর্তি আছে" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hospital Location / Address (ঠিকানা)</label>
                <input 
                  type="text" 
                  name="hospitalLocation"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  required
                  placeholder="এলাকা ও শহরের নাম" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Patient Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input 
                  type="tel" 
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  placeholder="রোগীর বা যোগাযোগের নম্বর" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Guardian Phone Number (অভিভাবক)</label>
                <input 
                  type="tel" 
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  required
                  placeholder="অভিভাবকের মোবাইল নম্বর" 
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600" 
                />
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Patient Image (রোগীর ছবি)</label>
              <div className="flex items-center gap-3">
                <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-500 hover:border-red-600 cursor-pointer transition-colors">
                  <FaUpload className="text-red-600" />
                  <span>{selectedImageFile ? selectedImageFile.name : 'রোগীর ছবি সিলেক্ট করুন'}</span>
                  <input 
                    type="file" 
                    name="patientImage"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes / Details <span className="text-gray-400 text-xs">(Optional)</span></label>
              <textarea 
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows="3"
                placeholder="প্রয়োজনীয় অন্যান্য বিবরণ এখানে লিখতে পারেন (ঐচ্ছিক)..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-red-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <FaSpinner className="animate-spin text-lg" /> : 'Post Emergency Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateRequest;