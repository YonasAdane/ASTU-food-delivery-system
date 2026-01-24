"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  DashboardOrder,
  DashboardOrderStatus,
} from "@/types/dashboard.types";

import {
  fetchMyRestaurantId,
  fetchRestaurantOrders,
  changeOrderStatus,
} from "@/lib/dashboard.api";

/* ================= CONSTANTS ================= */
const DISPLAY_STATUSES: DashboardOrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "cancelled",
];

const ALLOWED_UPDATE_STATUSES: DashboardOrderStatus[] = [
  "accepted",
  "preparing",
  "ready",
  "cancelled",
];

const ORDERS_PER_PAGE = 8;

export function useDashboard() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] =
    useState<DashboardOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const restaurantId = await fetchMyRestaurantId();
      const ordersData = await fetchRestaurantOrders(restaurantId);
      setOrders(ordersData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= FILTER ================= */
  const visibleOrders = useMemo(
    () => orders.filter(o => DISPLAY_STATUSES.includes(o.status)),
    [orders]
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(visibleOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ORDERS_PER_PAGE;
    return visibleOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [visibleOrders, page]);

  /* ================= KPIs ================= */
  const activeOrders = visibleOrders.filter(
    o => o.status !== "cancelled"
  );

  const deliveringOrders = orders.filter(
    o => o.status === "picked" || o.status === "en_route"
  ).length;

  const completedOrders = orders.filter(
    o => o.status === "completed"
  ).length;

  const dailyRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  /* ================= STATUS UPDATE ================= */
  async function updateOrderStatus(status: DashboardOrderStatus) {
    if (!selectedOrder) return;
    if (!ALLOWED_UPDATE_STATUSES.includes(status)) return;

    try {
      setUpdating(true);
      await changeOrderStatus(selectedOrder._id, status);

      setOrders(prev =>
        prev.map(o =>
          o._id === selectedOrder._id ? { ...o, status } : o
        )
      );

      setSelectedOrder(null);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdating(false);
    }
  }

  return {
    /* state */
    loading,
    updating,
    page,
    totalPages,
    selectedOrder,

    /* data */
    paginatedOrders,
    activeOrders,
    deliveringOrders,
    completedOrders,
    dailyRevenue,

    /* actions */
    setPage,
    setSelectedOrder,
    updateOrderStatus,
  };
}
