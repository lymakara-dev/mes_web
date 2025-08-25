"use client";

import ProfileCard from "@/components/learn/user-profile/ProfileTable";
import UserMetaCard from "@/components/learn/user-profile/UserMetaCard";
import React from "react";

export default function Profile() {
  const [user, setUser] = React.useState({
    avatarUrl: "https://i.pravatar.cc/40",
    firstName: "មករា",
    lastName: "លី",
    userName: "lymakara07",
    role: "អភិបាលប្រព័ន្ធ",
    email: "lymakara123@gmail.com",
    phone: "089251867",
  });

  const handleSave = (updatedUser: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone: string;
    gender?: string;
  }) => {
    setUser({ ...user, ...updatedUser });
    console.log("Saved user:", updatedUser);
  };

  return (
    <div className="flex flex-col gap-5">
      <UserMetaCard
        avatarUrl={user.avatarUrl}
        firstName={user.firstName}
        lastName={user.lastName}
        userName={user.userName}
        role={user.role}
        email={user.email}
        phone={user.phone}
        onSave={handleSave}
      />

      <ProfileCard
        fullName={`${user.lastName} ${user.firstName}`}
        gender="ប្រុស"
        phone={user.phone}
        email={user.email}
      />
    </div>
  );
}
