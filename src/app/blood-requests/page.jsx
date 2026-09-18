import BloodRequestsPage from "@/components/BloodRequestsPage";
import React from "react";

// পেজটিকে ডায়নামিক রেন্ডার করার জন্য নিশ্চিত করা হলো যাতে বিল্ডের সময় এরর না আসে
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "MMJ - Blood Requests | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const EmergencyBlood = async () => {
  let initialRequests = [];

  try {
    // সার্ভার ইউআরএল ফলব্যাকসহ সেট করা হলো যাতে লোকাল বা প্রোডাকশনে ক্র্যাশ না করে
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://mmj-server-kohl.vercel.app";
    
    const response = await fetch(`${serverUrl}/api/blood-requests`, {
      cache: "no-store", // সবসময় লেটেস্ট ডেটা পাওয়ার জন্য
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      // স্ট্যাটাস ফিল্টারিংয়ের লজিক
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