"use client";

import { useEffect, useMemo, useState } from "react";

/* ================= API ================= */
import { fetchRestaurantOrders } from "@/lib/restaurant-orders.api";

/* ================= TYPES ================= */
import type {
  RestaurantOrder,
  OrderStatus,
} from "@/types/restaurant-orders.types";

export type OrdersFilter = "all" | "pending" | "preparing" | "ready";

export function useRestaurantOrders() {
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [filter, setFilter] = useState<OrdersFilter>("all");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRestaurantOrders();
        setOrders(data);
      } catch (err) {
        console.error("Orders fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ================= STATS ================= */
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    delivering: orders.filter(
      o => o.status === "picked" || o.status === "en_route"
    ).length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }), [orders]);

  /* ================= FILTER ================= */
  const displayedOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  return {
    orders,
    loading,

    filter,
    setFilter,

    stats,
    displayedOrders,
  };
}
