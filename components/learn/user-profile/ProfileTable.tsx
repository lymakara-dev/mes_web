"use client";

import React from "react";

type ProfileCardProps = {
  fullName: string;
  gender: string;
  phone: string;
  email: string;
};

export default function ProfileCard({
  fullName,
  gender,
  phone,
  email,
}: ProfileCardProps) {
  return (
    <div className="w-full mx-auto border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        ពត៌មានផ្ទាល់ខ្លួន
      </h3>

      {/* Divider */}
      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Info list */}
      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-center justify-start px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-400 font-medium w-20">
            ឈ្មោះ
          </span>
          <span>៖&nbsp;</span>
          <span className="text-gray-800 dark:text-white/90 font-semibold">
            {fullName}
          </span>
        </div>

        {/* Gender */}
        <div className="flex items-center justify-start px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-400 font-medium w-20">
            ភេទ
          </span>
          <span>៖&nbsp;</span>
          <span className="text-gray-800 dark:text-white/90 font-semibold">
            {gender}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-start px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-400 font-medium w-20">
            លេខទូរស័ព្ទ
          </span>
          <span>៖&nbsp;</span>
          <span className="text-gray-800 dark:text-white/90 font-semibold break-all">
            {phone}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center justify-start px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-400 font-medium w-20">
            អ៊ីមែល
          </span>
          <span>៖&nbsp;</span>
          <span className="text-gray-800 dark:text-white/90 font-semibold break-all">
            {email}
          </span>
        </div>
      </div>
    </div>
  );
}
