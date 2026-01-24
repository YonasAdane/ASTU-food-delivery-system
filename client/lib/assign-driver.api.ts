// lib/assign-driver.api.ts

import { api } from "@/lib/api";
import { Driver, Order } from "@/types/assign-driver";

/* ================= ORDERS ================= */
export async function getRestaurantOrders(
  restaurantId: string
): Promise<Order[]> {
  const res = await api.get(`/restaurants/${restaurantId}/orders`);
  return res.data.orders;
}

/* ================= DRIVERS ================= */
export async function getActiveDrivers(
  restaurantId: string
): Promise<Driver[]> {
  const res = await api.get(
    `/restaurants/${restaurantId}/active-drivers`
  );
  return res.data.drivers;
}

/* ================= ASSIGN DRIVER ================= */
export async function assignDriverToOrder(
  orderId: string,
  driverId: string
) {
  await api.post("/restaurants/assign-driver", {
    orderId,
    driverId,
  });
}

/* ================= INVITE DRIVER ================= */
export async function inviteDriver(phone: string) {
  await api.post("/restaurants/invite-driver", { phone });
}
