"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QuestionHistoryEntry } from "@/types/learn-type"; // Your type definition
import { CheckCircle, XCircle, Clock } from "lucide-react";
import apiService from "@/service/api"; // Your ApiService instance

// --- API Function ---
// Fetches the current user's question history
const fetchMyQuestionHistory = async (): Promise<QuestionHistoryEntry[]> => {
  // Make sure this endpoint matches your NestJS route
  const response = await apiService.get<QuestionHistoryEntry[]>(
    "/user/user-question-history/me",
  );
  return response.data; // Return the data from the Axios response
};

// --- Helper Function ---
// Formats seconds into a "Xm Ys" or "Ys" string
const formatTime = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined || seconds < 0) return "N/A";
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

// --- Component ---
export default function DashboardPage() {
  // Define a unique query key for this data
  const queryKey = ["questionHistory", "me"];

  // Fetch data using React Query (TanStack Query)
  const {
    data: history, // Renamed data to history for clarity
    isLoading,
    isError,
    error, // Access the error object if needed
  } = useQuery<QuestionHistoryEntry[], AxiosError>({
    queryKey: queryKey,
    queryFn: fetchMyQuestionHistory, // Use the API function defined above
    // Optional: Configure caching behavior
    // staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    // refetchOnWindowFocus: false, // Prevent refetching just on window focus
  });

  // Calculate statistics (handle potential undefined 'history')
  const attemptedCount = history?.length ?? 0;
  const completedCount =
    history?.filter((entry) => entry.endTime !== null).length ?? 0;

  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
        {/* You could add a spinner component here */}
      </div>
    );
  }

  // Error State
  if (isError) {
    const errorMessage =
      (error?.response?.data as any)?.message || // Axios HTTP error message (cast to any to access message)
      error?.message || // General Error message
      "Failed to load history.";
    return (
      <div className="text-red-600 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 rounded-md bg-red-50 dark:bg-red-900/20">
        <p className="font-semibold">Error Loading History</p>
        <p>{errorMessage}</p>
      </div>
    );
  }

  // Success State (history is guaranteed to be an array here, possibly empty)
  return (
    <div className="space-y-6 p-4">
      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Progress Summary
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          You have completed{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {completedCount}
          </span>{" "}
          question{completedCount !== 1 ? "s" : ""} out of {attemptedCount}{" "}
          attempted.
        </p>
      </div>

      {/* History List Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Question History
        </h2>
        {attemptedCount === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You haven't attempted any questions yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {history?.map((entry) => (
              <li
                key={entry.id}
                className="py-3 flex justify-between items-center flex-wrap gap-2"
              >
                {/* Left Side: Question Info & Timings */}
                <div className="text-gray-900 dark:text-white">
                  {/* TODO: Fetch and display actual question content/title instead of just ID */}
                  <p className="font-medium">Question ID: {entry.questionId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Started: {new Date(entry.startTime).toLocaleString()}
                  </p>
                  {entry.endTime ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Time Taken: {formatTime(entry.timeTaken)}
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                      In Progress
                    </p>
                  )}
                </div>

                {/* Right Side: Status Icon */}
                <div className="flex items-center space-x-2">
                  {entry.endTime === null ? (
                    <Clock size={20} className="text-yellow-500">
                      <title>In Progress</title> {/* Accessible title */}
                    </Clock>
                  ) : entry.isCorrect === true ? (
                    <CheckCircle size={20} className="text-green-500">
                      <title>Correct</title> {/* Accessible title */}
                    </CheckCircle>
                  ) : entry.isCorrect === false ? (
                    <XCircle size={20} className="text-red-500">
                      <title>Incorrect</title> {/* Accessible title */}
                    </XCircle>
                  ) : (
                    // Render if endTime exists but isCorrect is null
                    <span
                      className="text-xs text-gray-400 dark:text-gray-500"
                      title="Result Not Recorded"
                    >
                      Completed
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
