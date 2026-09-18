import BloodRequestsPage from "@/components/BloodRequestsPage";
import React from "react";

export const metadata = {
  title: "MMJ - Blood Requests | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const EmergencyBlood = async () => {
  let initialRequests = [];

  try {
    // সার্ভার সাইড থেকে API কল করা হলো
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blood-requests`, {
      cache: "no-store", // সবসময় লেটেস্ট ডেটা পাওয়ার জন্য
    });
    const data = await response.json();

    if (data.success) {
      // স্ট্যাটাস ফিল্টারিংয়ের লজিকটি সার্ভার বা পেজ লেভেলেও করে দিতে পারেন
      initialRequests = data.data.filter((req) => {
        const status = req.status ? req.status.toLowerCase().trim() : "not manage";
        return status !== "manage blood" && status !== "completed" && status !== "success";
      });
    }
  } catch (error) {
    console.error("Error fetching blood requests on server:", error);
  }

  return (
    <div>
      {/* ফেচ করা ডেটা প্রপস হিসেবে পাস করা হলো */}
      <BloodRequestsPage initialRequests={initialRequests} />
    </div>
  );
};

export default EmergencyBlood;