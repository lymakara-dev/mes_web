import React, { useState, useEffect } from "react";
import { User, School, Book, FileText, BarChart2 } from "lucide-react"; // Example icons
import { AdminStats } from "@/types/type";

// Helper component for a single stat card
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.02] ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {value.toLocaleString()}
        </p>
      </div>
      <div className="p-3 bg-white bg-opacity-30 rounded-full text-white shadow-md">
        {icon}
      </div>
    </div>
  </div>
);

const API_URL = "http://localhost:3000/dashboard/stats"; // <<< IMPORTANT: Update with your actual backend URL

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AdminStats = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError(
          "Failed to load dashboard data. Check the API URL and status.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 border border-red-300 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Define the stat cards array
  const statCards = stats
    ? [
        {
          title: "Total Users",
          value: stats.totalUsers,
          icon: <User size={24} />,
          color: "bg-indigo-500 text-white",
        },
        {
          title: "Total Schools",
          value: stats.totalSchools,
          icon: <School size={24} />,
          color: "bg-green-500 text-white",
        },
        {
          title: "Total Subjects",
          value: stats.totalSubjects,
          icon: <Book size={24} />,
          color: "bg-yellow-500 text-white",
        },
        {
          title: "Total Questions",
          value: stats.totalQuestions,
          icon: <FileText size={24} />,
          color: "bg-red-500 text-white",
        },
        {
          title: "Pending Reports",
          value: stats.totalReports,
          icon: <BarChart2 size={24} />,
          color: "bg-blue-500 text-white",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-2">
          Admin Dashboard Overview
        </h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Recent Activity
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-gray-500">
            *Add components here for tables of recent users, latest reports, or
            charts.*
          </p>
          {/* Example: A simple table or chart */}
          <div className="h-64 mt-4 bg-gray-50 rounded-lg border border-dashed flex items-center justify-center">
            <p className="text-gray-400">Placeholder for Chart/Table</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
