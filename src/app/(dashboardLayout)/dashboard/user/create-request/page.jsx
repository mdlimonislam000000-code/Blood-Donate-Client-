import UserCreateRequestPage from "@/components/UserCreateRequestPage";
import React from "react";

export const metadata = {
  title: "MMJ - Create Request | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

const CreateRequest = () => {
 
  return (
   <div>
    <UserCreateRequestPage></UserCreateRequestPage>
   </div>
  );
};

export default CreateRequest;