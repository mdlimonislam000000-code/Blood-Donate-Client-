import AdminDonationPage from '@/components/AdminDonationPage';
import React from 'react';

export const metadata = {
  title: "MMJ - Admin Donation , Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const Donations = () => {

  return (
    <div>
      <AdminDonationPage></AdminDonationPage>
    </div>
  );
};

export default Donations;