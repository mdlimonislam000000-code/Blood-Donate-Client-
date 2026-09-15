import AdminManageUserPage from '@/components/AdminManageUserPage';
import React from 'react';


export const metadata = {
  title: "MMJ - Admin Manage User, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const ManageUser = () => {
  return (
    <div>
      <AdminManageUserPage></AdminManageUserPage>
    </div>
  );
};

export default ManageUser;