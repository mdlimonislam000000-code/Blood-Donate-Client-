import AdminApprovalsPage from '@/components/AdminPendingApprovarlsPage';
import React from 'react';

export const metadata = {
  title: "MMJ - Admin Approvarls , Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const PendingRequest = () => {
 
  return (
    <div>
      <AdminApprovalsPage></AdminApprovalsPage>
    </div>
  );
};

export default PendingRequest;