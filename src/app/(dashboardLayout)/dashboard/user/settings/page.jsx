import UserSettingsPage from '@/components/UserSettingsPage';
import React from 'react';


export const metadata = {
  title: "MMJ - All Donor | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const UserSettings = () => {

  return (
 <div>
  <UserSettingsPage></UserSettingsPage>
 </div>
  );
};

export default UserSettings;