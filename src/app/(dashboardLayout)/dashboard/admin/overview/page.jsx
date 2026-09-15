import AdminOverviewPage from '@/components/AdminOverviewPage';
import React from 'react';

export const metadata = {
  title: "MMJ - Admin Dashboad Overview | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const Overview = () => {
  return (
    <div>
      <AdminOverviewPage></AdminOverviewPage>
    </div>
  );
};

export default Overview;