"use client"
import { UserProfile } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="profile-page">
      <UserProfile routing="hash" />
    </div>
  );
};

export default page;