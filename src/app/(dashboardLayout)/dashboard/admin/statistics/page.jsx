import AdminStatisticsPage from '@/components/AdminStatisticsPage';
import React from 'react';


export const metadata = {
  title: "MMJ - Admin Statistics, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const ImpactStats = () => {


  return (
    <div>
      <AdminStatisticsPage></AdminStatisticsPage>
    </div>
  );
};

export default ImpactStats;