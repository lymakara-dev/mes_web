"use client";

import React from "react";
import { Button, Spinner, addToast } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  School,
  Book,
  FileText,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import apiService from "@/service/api";

// --- 1. Data Interface (Matches your API response) ---
interface AdminStats {
  totalUsers: number;
  totalSchools: number;
  totalSubjects: number;
  totalQuestions: number;
  totalReports: number;
}
// ---------------------------------------------------

// Helper component for a single stat card (StatCardProps and StatCard component are unchanged)
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.02] ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-white mt-1">
          {value.toLocaleString()}
        </p>
      </div>
      <div className="p-3 bg-white bg-opacity-30 rounded-full text-white shadow-md">
        {icon}
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  const queryKey = ["admin-stats"];

  // --- Data Fetching using React Query (FIX APPLIED) ---
  const {
    data: stats,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<AdminStats, Error, AdminStats | null>({
    // 👈 FIX 1: Allow the final resolved data type to be AdminStats OR null
    queryKey: queryKey,
    queryFn: async () => {
      const res = await apiService.get("/dashboard/stats");
      // Assuming your API service returns res.data which is AdminStats
      return res.data;
    },
    // 👈 FIX 2: initialData should be undefined when using the
    // AdminStats | null generic pattern, or null if using a select function.
    // Given the structure, setting it to undefined is cleaner for no data yet.
    initialData: undefined,

    // Optional: Use a select function to explicitly guarantee the shape if needed
    select: (data) => data || null,

    staleTime: 60000,
  });

  const handleManualRefetch = () => {
    refetch()
      .then(() => {
        addToast({
          title: "Success",
          description: "Dashboard data refreshed.",
          color: "success",
        });
      })
      .catch((err) => {
        console.error("Refetch Error:", err);
        addToast({
          title: "Error",
          description: "Failed to refresh dashboard data.",
          color: "danger",
        });
      });
  };

  // Define the stat cards array. This check is correct for stats being AdminStats | null.
  const statCards: StatCardProps[] = stats
    ? [
        {
          title: "Total Users",
          value: stats.totalUsers,
          icon: <User size={24} />,
          color: "bg-indigo-600",
        },
        {
          title: "Total Schools",
          value: stats.totalSchools,
          icon: <School size={24} />,
          color: "bg-green-600",
        },
        {
          title: "Total Subjects",
          value: stats.totalSubjects,
          icon: <Book size={24} />,
          color: "bg-yellow-600",
        },
        {
          title: "Total Questions",
          value: stats.totalQuestions,
          icon: <FileText size={24} />,
          color: "bg-red-600",
        },
        {
          title: "Pending Reports",
          value: stats.totalReports,
          icon: <BarChart2 size={24} />,
          color: "bg-blue-600",
        },
      ]
    : [];

  const now = new Date();
  // Ensure we don't try to call toLocaleTimeString() if stats is null on load
  const lastUpdatedTime = isFetching
    ? "Updating..."
    : stats
      ? `Last Updated: ${now.toLocaleTimeString()}`
      : "Not yet loaded";

  return (
    <main className="min-h-screen p-8 dark:bg-gray-900 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Page Header Area (Unchanged) */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <Button
            onClick={handleManualRefetch}
            variant="ghost"
            isLoading={isFetching}
            endContent={
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
            }
          >
            {lastUpdatedTime}
          </Button>
        </header>

        {/* Main Content Area (Unchanged logic) */}
        <div className="space-y-8">
          {/* Loading State */}
          {isLoading && !stats ? ( // Check ensures spinner only shows on first load or while refetching if stats is null
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg text-center text-gray-500 dark:text-gray-400">
              <Spinner size="lg" className="mx-auto mb-3" />
              <p>Loading key statistics...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-red-100 dark:bg-red-900 p-8 rounded-xl shadow-lg text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700">
              <h2 className="text-xl font-semibold mb-2">
                Error Loading Dashboard
              </h2>
              <p>
                Could not fetch data from the server. Please check the API
                endpoint.
              </p>
              <p className="mt-2 text-sm">
                Error Details:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {/* stats is guaranteed to be AdminStats here */}
                {statCards.map((card) => (
                  <StatCard key={card.title} {...card} />
                ))}
              </div>

              {/* 4. Additional Dashboard Sections (Placeholders) */}

              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">
                  Recent Activity and Reports
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Placeholder 1: Recent Reports */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-80 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Latest Reports ({stats?.totalReports || 0})
                    </h3>
                    <div className="flex-grow flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-gray-400 dark:text-gray-600">
                        Placeholder for a recent reports list/table.
                      </p>
                    </div>
                  </div>

                  {/* Placeholder 2: User Trends Chart */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-80 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      User Growth Trend
                    </h3>
                    <div className="flex-grow flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-gray-400 dark:text-gray-600">
                        Placeholder for a Line Chart (e.g., using Recharts or
                        Chart.js).
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
