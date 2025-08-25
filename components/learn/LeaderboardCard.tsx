"use client";
import React from "react";

import Button from "@/components/ui/button/Button";

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  timestamp: string;
};

interface LeaderboardCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  data: LeaderboardEntry[];
  onView?: (entry: LeaderboardEntry) => void;
}

export default function LeaderboardCard({
  title,
  subtitle,
  loading = false,
  data,
  onView,
}: LeaderboardCardProps) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-center p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-900">
          🏆 {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-700">{subtitle}</p>}
        {loading && <p className="text-xs mt-1 animate-pulse">Updating...</p>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                Rank
              </th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                Username
              </th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                Score
              </th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                Timestamp
              </th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.rank}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                {/* Rank */}
                <td className="p-3 font-bold">
                  {entry.rank === 1 ? (
                    <span className="text-yellow-500">#{entry.rank}</span>
                  ) : entry.rank === 2 ? (
                    <span className="text-gray-400">#{entry.rank}</span>
                  ) : entry.rank === 3 ? (
                    <span className="text-orange-500">#{entry.rank}</span>
                  ) : (
                    <span>#{entry.rank}</span>
                  )}
                </td>

                {/* Username */}
                <td className="p-3">{entry.username}</td>

                {/* Score */}
                <td className="p-3 text-teal-500">{entry.score} pts</td>

                {/* Timestamp */}
                <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                  {entry.timestamp}
                </td>

                {/* Button */}
                <td className="p-3">
                  <Button
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    size="sm"
                    onClick={() => onView?.(entry)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
