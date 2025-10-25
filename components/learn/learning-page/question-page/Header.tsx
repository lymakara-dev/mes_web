"use client";

import { Maximize, Minimize } from "lucide-react";

interface HeaderProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  subjectName: string;
}

export default function Header({
  isFullscreen,
  onToggleFullscreen,
  subjectName,
}: HeaderProps) {
  return (
    <header className="w-full max-w-full p-5 box-border flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 rounded-2xl">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        ការសិក្សាមុខវិជ្ជា {subjectName}
      </h1>
      <div className="flex items-center">
        {isFullscreen ? (
          <Minimize
            className="w-5 h-5 text-gray-500 cursor-pointer dark:text-white/90"
            onClick={onToggleFullscreen}
          />
        ) : (
          <Maximize
            className="w-5 h-5 text-gray-500 cursor-pointer dark:text-white/90"
            onClick={onToggleFullscreen}
          />
        )}
      </div>
    </header>
  );
}
