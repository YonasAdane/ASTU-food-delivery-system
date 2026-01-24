"use client";

import { useEffect, useMemo, useState } from "react";

import {
  assignDriverToOrder,
  getActiveDrivers,
  getRestaurantOrders,
  inviteDriver,
} from "@/lib/assign-driver.api";

import { Driver, Order } from "@/types/assign-driver";

export function useAssignDrivers(restaurantId: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  async function loadData() {
    try {
      setLoading(true);
      const [ordersData, driversData] = await Promise.all([
        getRestaurantOrders(restaurantId),
        getActiveDrivers(restaurantId),
      ]);
      setOrders(ordersData);
      setDrivers(driversData);
    } finally {
      setLoading(false);
    }
  }

  /* ================= DERIVED ================= */
  const activeOrders = useMemo(
    () => orders.filter(o => o.status !== "delivered"),
    [orders]
  );

  /* ================= ACTIONS ================= */
  async function assignDriver(orderId: string, driverId: string) {
    await assignDriverToOrder(orderId, driverId);
    setActiveOrderId(null);
    loadData();
  }

  async function invite(phone: string) {
    await inviteDriver(phone);
    loadData();
  }

  return {
    /* state */
    loading,
    orders,
    drivers,
    activeOrders,
    activeOrderId,
    inviteOpen,

    /* setters */
    setActiveOrderId,
    setInviteOpen,

    /* actions */
    assignDriver,
    invite,
  };
}
