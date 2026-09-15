import UserNotificationsPage from '@/components/UserNotificationsPage';
import React from 'react';


export const metadata = {
  title: "MMJ - Notifications | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const Notifications = () => {

  return (
    <div>
      <UserNotificationsPage></UserNotificationsPage>
    </div>
  );
};

export default Notifications;