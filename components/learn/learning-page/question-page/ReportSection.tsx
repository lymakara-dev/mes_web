"use client";

import { useState } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { addToast } from "@heroui/react";
import api from "@/service/api";

interface ReportSectionProps {
  questionId: number;
}

export default function ReportSection({ questionId }: ReportSectionProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    "Wrong answer or explanation",
    "Question is unclear",
    "Typo or grammatical error",
    "Duplicate question",
    "Other issue",
  ];

  const handleSubmit = async () => {
    if (!reason) {
      addToast({
        title: "Please select a reason",
        description:
          "You must choose at least one report reason before submitting.",
        color: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const payload = {
        questionId,
        reason,
        description,
      };

      await api.post("/reports", payload);

      addToast({
        title: "Report submitted ✅",
        description: "Thank you for helping us improve the questions.",
        color: "success",
      });

      // Reset fields
      setReason("");
      setDescription("");
    } catch (error: any) {
      addToast({
        title: "Submission failed ❌",
        description: error?.response?.data?.message || "Something went wrong.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-5 flex flex-col h-full shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-500" size={22} />
        <h2 className="text-lg font-semibold">Report an Issue</h2>
      </div>

      {/* Reason selection */}
      <div className="flex flex-col gap-2 mb-4">
        {reasons.map((r) => (
          <label
            key={r}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded-md border ${
              reason === r
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <input
              type="radio"
              name="reason"
              value={r}
              checked={reason === r}
              onChange={(e) => setReason(e.target.value)}
              className="accent-blue-600"
            />
            <span className="text-sm">{r}</span>
          </label>
        ))}
      </div>

      {/* Description box */}
      <textarea
        placeholder="Describe the issue (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Report"}
        {!loading && <Send size={16} />}
      </button>
    </div>
  );
}
