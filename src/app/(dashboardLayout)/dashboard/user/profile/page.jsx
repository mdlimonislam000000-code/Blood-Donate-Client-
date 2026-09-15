import UserProfilePage from "@/components/UserProfilePage";
import React from "react";

export const metadata = {
  title: "MMJ - Profile | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const UserProfile = () => {

  return (
    <div>
      <UserProfilePage></UserProfilePage>
    </div>
  );
};

export default UserProfile;