"use client";

import { useEffect, useState } from "react";

/* -------- API -------- */
import {
  fetchMyRestaurant,
  fetchRestaurantStats,
  fetchRestaurantOrders,
} from "@/lib/analytics.api";

/* -------- TYPES -------- */
import type {
  Restaurant,
  Stats,
  StatusChartData,
  DailyData,
} from "@/types/analytics.types";

export function useRestaurantAnalytics() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusData, setStatusData] = useState<StatusChartData[]>([]);
  const [daily, setDaily] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);

      /* 1️⃣ RESTAURANT */
      const restaurantData = await fetchMyRestaurant();
      setRestaurant(restaurantData);

      /* 2️⃣ STATS */
      const statsData = await fetchRestaurantStats(restaurantData._id);
      setStats(statsData);

      /* 3️⃣ ORDERS → STATUS COUNT */
      const orders = await fetchRestaurantOrders(restaurantData._id);

      const statusMap: Record<string, number> = {
        pending: 0,
        accepted: 0,
        preparing: 0,
        ready: 0,
        delivered: 0,
      };

      orders.forEach(order => {
        if (statusMap[order.status] !== undefined) {
          statusMap[order.status]++;
        }
      });

      setStatusData(
        Object.entries(statusMap).map(([status, count]) => ({
          status,
          count,
        }))
      );

      /* 4️⃣ DAILY (STATIC FOR NOW) */
      setDaily([
        { day: "Mon", orders: 0, revenue: 0 },
        { day: "Tue", orders: 0, revenue: 0 },
        { day: "Wed", orders: 0, revenue: 0 },
        { day: "Thu", orders: 0, revenue: 0 },
        { day: "Fri", orders: 0, revenue: 0 },
        { day: "Sat", orders: 0, revenue: 0 },
        { day: "Sun", orders: 0, revenue: 0 },
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  return {
    restaurant,
    stats,
    statusData,
    daily,
    loading,
    error,
  };
}
