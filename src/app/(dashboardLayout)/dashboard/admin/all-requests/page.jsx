import AdminAllRequest from '@/components/AdminAllRequestsPage';
import React from 'react';


export const metadata = {
  title: "MMJ - Admin | All Requests, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};


const AllRequest = () => {
 
  return (
    <div>
      <AdminAllRequest></AdminAllRequest>
    </div>
  );
};

export default AllRequest;