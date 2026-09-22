'use client';
import React, { useState, useEffect } from 'react';
import { FaIdCard, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { uploadImageToImgBB } from '@/lib/imageUpload';
import { authClient } from '@/lib/auth-client';

const VarificationUser = ({ 
  isOpen, 
  onClose,
  onStatusChange 
}) => {
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;

  const [nidForm, setNidForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    bloodGroup: '',
    nidNumber: '',
    lastDonationDate: '',
    presentAddress: { division: '', district: '', upazila: '' },
    permanentAddress: { division: '', district: '', upazila: '' },
    nidFrontImage: null,
    nidBackImage: null,
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      setNidForm(prev => ({
        ...prev,
        fullName: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        bloodGroup: currentUser.bloodGroup || '',
        lastDonationDate: currentUser.lastDonationDate || '',
        presentAddress: { 
          division: currentUser.presentAddress?.division || '', 
          district: currentUser.presentAddress?.district || '', 
          upazila: currentUser.presentAddress?.upazila || '' 
        },
        permanentAddress: { 
          division: currentUser.permanentAddress?.division || '', 
          district: currentUser.permanentAddress?.district || '', 
          upazila: currentUser.permanentAddress?.upazila || '' 
        },
      }));
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    toast.loading('Wating few seconds', { id: 'uploading' });

    try {
      const frontImageUrl = await uploadImageToImgBB(nidForm.nidFrontImage);
      const backImageUrl = await uploadImageToImgBB(nidForm.nidBackImage);

      if (!frontImageUrl || !backImageUrl) {
        toast.dismiss('uploading');
        toast.error('Failed to upload one or more images!');
        setLoading(false);
        return;
      }

      const finalVerificationData = {
        userId: currentUser?._id || currentUser?.id, 
        fullName: nidForm.fullName,
        phone: nidForm.phone,
        email: nidForm.email,
        bloodGroup: nidForm.bloodGroup,
        nidNumber: nidForm.nidNumber,
        lastDonationDate: nidForm.lastDonationDate || null, // অপশনাল হ্যান্ডলিং
        presentAddress: nidForm.presentAddress,
        permanentAddress: nidForm.permanentAddress,
        userImage: currentUser?.image || '',
        nidFrontImage: frontImageUrl,
        nidBackImage: backImageUrl,
      };

      toast.loading('Submitting verification data...', { id: 'uploading' });

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-nid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalVerificationData),
      });

      const result = await response.json();

      toast.dismiss('uploading');

      if (response.ok && result.success) {
        toast.success(result.message || 'Verification request submitted successfully!');
        
        if (onStatusChange) {
          onStatusChange('pending');
        }

        onClose();
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to submit verification request.');
      }

    } catch (error) {
      toast.dismiss('uploading');
      toast.error('Something went wrong!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaIdCard className="text-red-600" /> NID Verification Form
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-center">
            <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">
              সঠিক তথ্য দিন, একটি জীবন বাঁচান। আপনার দেওয়া সঠিক তথ্য একজন মানুষের জীবন বাঁচাতে পারে! ❤️
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={nidForm.fullName || ''}
                onChange={(e) => setNidForm({...nidForm, fullName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Phone Number</label>
              <input 
                type="text" 
                value={nidForm.phone || ''}
                onChange={(e) => setNidForm({...nidForm, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                value={nidForm.email || ''}
                onChange={(e) => setNidForm({...nidForm, email: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Blood Group</label>
              <select 
                value={nidForm.bloodGroup || ''}
                onChange={(e) => setNidForm({...nidForm, bloodGroup: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                required
              >
                <option value="">Select Blood Group</option>
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

            {/* NID Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">NID Number (10, 13 or 17 digits)</label>
              <input 
                type="text" 
                placeholder="Enter your NID number"
                value={nidForm.nidNumber || ''}
                onChange={(e) => setNidForm({...nidForm, nidNumber: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Last Donation Date (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                Last Donation Date <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <input 
                type="date" 
                value={nidForm.lastDonationDate || ''}
                onChange={(e) => setNidForm({...nidForm, lastDonationDate: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Present Address Fields */}
            <div className="sm:col-span-2 pt-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Present Address</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input 
                  type="text" 
                  placeholder="Division"
                  value={nidForm.presentAddress.division || ''}
                  onChange={(e) => setNidForm({
                    ...nidForm, 
                    presentAddress: {...nidForm.presentAddress, division: e.target.value}
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-red-500"
                  required
                />
                <input 
                  type="text" 
                  placeholder="District"
                  value={nidForm.presentAddress.district || ''}
                  onChange={(e) => setNidForm({
                    ...nidForm, 
                    presentAddress: {...nidForm.presentAddress, district: e.target.value}
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-red-500"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Upazila"
                  value={nidForm.presentAddress.upazila || ''}
                  onChange={(e) => setNidForm({
                    ...nidForm, 
                    presentAddress: {...nidForm.presentAddress, upazila: e.target.value}
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>

            {/* Permanent Address Fields */}
            <div className="sm:col-span-2 pt-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Permanent Address</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input 
                  type="text" 
                  placeholder="Division"
                  value={nidForm.permanentAddress.division || ''}
                  onChange={(e) => setNidForm({
                    ...nidForm, 
                    permanentAddress: {...nidForm.permanentAddress, division: e.target.value}
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-red-500"
                  required
                />
                <input 
                  type="text" 
                  placeholder="District"
                  value={nidForm.permanentAddress.district || ''}
                  onChange={(e) => setNidForm({
                    ...nidForm, 
                    permanentAddress: {...nidForm.permanentAddress, district: e.target.value}
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-red-500"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Upazila"
                  value={nidForm.permanentAddress.upazila || ''}
                  onChange={(e) => setNidForm({
                    ...nidForm, 
                    permanentAddress: {...nidForm.permanentAddress, upazila: e.target.value}
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>

            {/* NID Front Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">NID Card (Front Side)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setNidForm({...nidForm, nidFrontImage: e.target.files[0]})}
                className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 dark:file:bg-gray-700 dark:file:text-red-400 cursor-pointer"
                required
              />
            </div>

            {/* NID Back Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">NID Card (Back Side)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setNidForm({...nidForm, nidBackImage: e.target.files[0]})}
                className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 dark:file:bg-gray-700 dark:file:text-red-400 cursor-pointer"
                required
              />
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isPending}
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Verification'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default VarificationUser;