import { Loader } from "lucide-react";
import React, { Suspense } from "react";

const LoadingFallback = () => (
  <div className="flex h-96 w-full items-center justify-center rounded-lg bg-white dark:bg-gray-800">
    <Loader className="h-12 w-12 animate-spin text-indigo-500" />
  </div>
);

export default function AdminDashboardPage() {
  <main className="min-h-screen p-8 dark:bg-gray-900">
    <div className="mx-auto max-w-7xl">
      <Suspense fallback={<LoadingFallback />}>admin dashboard</Suspense>
    </div>
  </main>;
}
