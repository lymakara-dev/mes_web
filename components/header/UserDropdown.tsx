"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query"; // Import useMutation
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Button } from "@heroui/button";
import { User } from "@/types/user";

// ⚠️ ASSUME: A global API service is available here
import apiService from "@/service/api"; 

// ⭐️ ENDPOINTS ⭐️
const PROFILE_ENDPOINT = "/auth/profile";
const LOGOUT_ENDPOINT = "/auth/logout"; // Assuming standard logout endpoint

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // ---------------------------------------------------
  // 1. FETCH PROFILE (useQuery) - Replaces getProfile()
  // ---------------------------------------------------
  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: async () => {
      // Endpoint: GET /api/auth/profile
      const res = await apiService.get<User>(PROFILE_ENDPOINT);
      // Assuming res.data is the User object or the User object is nested
      return res.data; 
    },
    // Prevent the query from retrying/showing error if the user is unauthenticated
    retry: false, 
  });
  
  // ---------------------------------------------------
  // 2. LOGOUT MUTATION - Replaces logout()
  // ---------------------------------------------------
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Endpoint: POST /api/auth/logout (Assuming a POST to invalidate session)
      // This call might fail if the server is down, but we proceed with token removal anyway
      try {
        await apiService.post(LOGOUT_ENDPOINT, {});
      } catch (e) {
        console.warn("Server logout failed, proceeding with client-side token removal.");
      }
      
      // Client-side cleanup (Remove token/auth state, typically done in apiService or auth context)
      // Since the original logout() was simple, we replicate the side effect here:
      if (typeof window !== "undefined") {
          localStorage.removeItem("token"); // Placeholder for actual token storage
      }
      return true; // Return a success status regardless of server response
    },
    onSuccess: () => {
      router.push("/auth/login"); // Redirect after client/server cleanup
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(); // Trigger the mutation
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  
  // Handle loading and error states for profile data
  if (isLoading) {
      // You might return a skeleton or a disabled button here
      return (
          <div className="flex items-center space-x-2 animate-pulse">
              <div className="rounded-full bg-gray-300 h-11 w-11"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
      );
  }
  
  // If no data or an error occurred (e.g., user is unauthenticated), 
  // you might choose to show a fallback or redirect to login.
  if (isError || !data) {
      return (
          <Button onClick={() => router.push("/auth/login")}>
              Login
          </Button>
      );
  }

  // Use the fetched data for rendering
  return (
    <div className="relative">
      <button
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        onClick={toggleDropdown}
        // Disable button while logging out
        disabled={logoutMutation.isPending} 
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            alt="User"
            height={44}
            // Use optional chaining for safety
            src={data?.userInfo?.imageUrl?.trim() || "/images/user/owner.jpg"}
            width={44}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {data?.userInfo?.firstname}
        </span>
        {/* Dropdown arrow icon */}
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          height="20"
          viewBox="0 0 18 20"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      <Dropdown
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
        isOpen={isOpen}
        onClose={closeDropdown}
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {/* Display full name */}
            {`${data?.userInfo?.lastname || ""} ${data?.userInfo?.firstname || ""} `}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {data?.userInfo?.email || ""}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              href="/learn/profile"
              tag="a"
              onItemClick={closeDropdown}
            >
              {/* Profile Icon SVG */}
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                  fill=""
                  fillRule="evenodd"
                />
              </svg>
              Edit profile
            </DropdownItem>
          </li>
        </ul>
        <Button
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 disabled:opacity-50"
          onClick={handleLogout}
          // Disable button while logging out
          disabled={logoutMutation.isPending} 
        >
          {/* Sign out Icon SVG */}
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
              fillRule="evenodd"
            />
          </svg>
          {logoutMutation.isPending ? "Signing out..." : "Sign out"}
        </Button>
      </Dropdown>
    </div>
  );
}