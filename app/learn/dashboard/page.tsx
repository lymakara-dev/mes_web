"use client";

import RecentOrders from "@/components/learn/RecentOrders";
import { useApi } from "@/service/useApi";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function page() {
  const api = useApi();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await axios.get("http://localhost:9000/learn");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearning();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <RecentOrders />
    </div>
  );
}
