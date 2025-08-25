"use client";
import React, { useState } from "react";
import Image from "next/image";

import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import Select from "@/components/form/Select";

type UserMetaCardProps = {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  email: string;
  phone: string;
  gender?: string;
  genderOptions?: { value: string; label: string }[];
  onSave?: (updatedUser: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone: string;
    gender?: string;
  }) => void;
};

export default function UserMetaCard({
  avatarUrl,
  firstName,
  lastName,
  userName,
  gender,
  role,
  email,
  phone,
  genderOptions = [
    { value: "male", label: "ប្រុស" },
    { value: "female", label: "ស្រី" },
  ],
  onSave,
}: UserMetaCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    userName,
    email,
    phone,
    gender,
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
    closeModal();
  };

  const fields = [
    { key: "firstName", label: "First Name", type: "text" },
    { key: "lastName", label: "Last Name", type: "text" },
    { key: "userName", label: "Username", type: "text" },
    { key: "email", label: "Email Address", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
  ];

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-gray-900 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center justify-between w-full gap-6 xl:flex-row">
            {/* Avatar + Info */}
            <div className="flex flex-row max-xl:flex-col items-center gap-5">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                <Image alt="user" height={80} src={avatarUrl} width={80} />
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                  {lastName} {firstName}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              onClick={openModal}
            >
              <svg
                className="fill-current"
                fill="none"
                height="18"
                viewBox="0 0 18 18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
                  fillRule="evenodd"
                />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
      <Modal className="max-w-[700px] m-4" isOpen={isOpen} onClose={closeModal}>
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  {fields.map(({ key, label, type }) => (
                    <div key={key}>
                      <Label>{label}</Label>
                      <Input
                        defaultValue={
                          formData[key as keyof typeof formData] || ""
                        }
                        type={type}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                  <div>
                    <Label>Select Gender</Label>
                    <Select
                      defaultValue={formData.gender}
                      options={genderOptions}
                      onChange={(value) => handleChange("gender", value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                size="sm"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
