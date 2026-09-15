import UserBloodRequestsPage from '@/components/UserBloodRequestsPage';
import React from 'react';

export const metadata = {
  title: "MMJ - My blood requests | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};


const MyRequest = () => {

  return (
    <div>
      <UserBloodRequestsPage></UserBloodRequestsPage>
    </div>
  );
};

export default MyRequest;