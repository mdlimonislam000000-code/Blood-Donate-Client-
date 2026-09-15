import BloodRequestsPage from "@/components/BloodRequestsPage";
import React from "react";


export const metadata = {
  title: "MMJ - Blood Requests | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const EmergencyBlood = () => {
 
  return (
   <div>
    <BloodRequestsPage></BloodRequestsPage>
   </div>
  );
};

export default EmergencyBlood;