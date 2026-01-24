import { api } from "@/lib/api";
import type { Order } from "@/types/analytics.types"

/* -------- RESTAURANT -------- */
export async function fetchMyRestaurant() {
  const res = await api.get("/restaurants/me");
  return res.data.restaurant;
}

/* -------- STATS -------- */
export async function fetchRestaurantStats(restaurantId: string) {
  const res = await api.get(`/restaurants/${restaurantId}/stats`);
  return res.data;
}

/* -------- ORDERS -------- */
export async function fetchRestaurantOrders(
  restaurantId: string
): Promise<Order[]> {
  const res = await api.get(`/restaurants/${restaurantId}/orders`);
  return res.data.orders || [];
}
