"use client";

import Image from "next/image";
import React from "react";
import { Progress } from "@heroui/react";

import Button from "@/components/ui/button/Button";

interface SubjectCardProps {
  title: string;
  questions: number;
  progress: number;
  image: string;
  buttonLabel?: string;
  onClickButton?: () => void;
}

export default function SubjectCard({
  title,
  questions,
  progress,
  image,
  buttonLabel = "ចាប់ផ្ដើម",
  onClickButton,
}: SubjectCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {/* Subject Image */}
      <div className="items-center w-full rounded-full max-w-24">
        <Image
          alt={title}
          className="w-full"
          height={48}
          src={image}
          width={48}
          priority
        />
      </div>

      {/* Subject Info */}
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <div>
          <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
            {title}
          </p>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            {questions.toLocaleString()} Questions
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex w-full justify-center items-center gap-3">
          <Progress
            aria-label={`${title} progress`}
            classNames={{
              indicator:
                "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
              track: "bg-gray-200 dark:bg-gray-700",
            }}
            value={progress}
          />
          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div>
        <Button
          onClick={onClickButton}
          className="w-20"
          size="sm"
          variant="outline"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
