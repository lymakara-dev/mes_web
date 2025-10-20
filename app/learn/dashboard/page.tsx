"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

import LeaderboardCard, {
  LeaderboardEntry,
} from "@/components/learn/LeaderboardCard";

const mockData: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "hakeny1712",
    score: 100,
    timestamp: "2025-04-29 05:45:28",
  },
  { rank: 2, username: "tal0312", score: 98, timestamp: "2025-04-29 15:32:51" },
  {
    rank: 3,
    username: "fisherman611",
    score: 95,
    timestamp: "2025-04-30 13:06:27",
  },
  {
    rank: 4,
    username: "ZeroTimo",
    score: 92,
    timestamp: "2025-04-30 14:27:56",
  },
  {
    rank: 5,
    username: "ZeroTimo",
    score: 92,
    timestamp: "2025-04-30 14:27:56",
  },
  {
    rank: 6,
    username: "ZeroTimo",
    score: 92,
    timestamp: "2025-04-30 14:27:56",
  },
  {
    rank: 7,
    username: "ZeroTimo",
    score: 92,
    timestamp: "2025-04-30 14:27:56",
  },
  {
    rank: 8,
    username: "ZeroTimo",
    score: 92,
    timestamp: "2025-04-30 14:27:56",
  },
  {
    rank: 9,
    username: "ZeroTimo",
    score: 92,
    timestamp: "2025-04-30 14:27:56",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api");

        setData(res.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearning();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* <pre className="text-sm text-wrap">{JSON.stringify(data, null, 2)}</pre> */}
      <LeaderboardCard
        data={mockData}
        loading={false}
        subtitle="Top students of the Agents Course Unit 4 Challenge"
        title="Student Scores Leaderboard"
        onView={(entry) => alert(`Viewing details of ${entry.username}`)}
      />
    </div>
  );
}
