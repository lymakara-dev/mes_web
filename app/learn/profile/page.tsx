"use client";

import ProfileCard from "@/components/learn/user-profile/ProfileTable";
import UserMetaCard from "@/components/learn/user-profile/UserMetaCard";
import { useApi } from "@/service/useApi";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { getProfile, updateProfile } = useApi();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  console.log("user info page", data);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Refetch the profile after successful update
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });

  const handleSave = (updatedUser: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    gender?: string;
  }) => {
    mutation.mutate(updatedUser);
  };

  return (
    <div className="flex flex-col gap-5">
      <UserMetaCard
        avatarUrl={data?.userInfo?.imageUrl || ""}
        email={data?.userInfo?.email || ""}
        firstname={data?.userInfo?.firstname || ""}
        lastname={data?.userInfo?.lastname || ""}
        phone={data?.userInfo?.phone || ""}
        role={data?.role || ""}
        username={data?.username || ""}
        onSave={handleSave}
      />

      <ProfileCard
        email={data?.userInfo?.email || ""}
        fullName={`${data?.userInfo?.lastname || ""} ${data?.userInfo?.firstname || ""}`}
        gender={data?.userInfo?.gender || ""}
        phone={data?.userInfo?.phone || ""}
      />
    </div>
  );
}
