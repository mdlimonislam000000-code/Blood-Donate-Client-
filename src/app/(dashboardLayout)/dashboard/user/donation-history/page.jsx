import UserDonationHistoryPage from "@/components/UserDonationHistoryPage";
import React from "react";


export const metadata = {
  title: "MMJ - My Donation History | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};
const DonationHistory = () => {

  return (
  <div>
    <UserDonationHistoryPage></UserDonationHistoryPage>
  </div>
  );
};

export default DonationHistory;