import AdminProfilePage from "@/components/AdminProfilePage";
import React from "react";


export const metadata = {
  title: "MMJ - Admin Profile, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const AdminProfile = () => {
  return (
    <div>
      <AdminProfilePage></AdminProfilePage>
    </div>
  );
};

export default AdminProfile;