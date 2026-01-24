import { api } from "@/lib/api";
import type { DashboardOrderStatus } from "@/types/dashboard.types";

/* ================= DASHBOARD API ================= */

export async function fetchMyRestaurantId(): Promise<string> {
  const res = await api.get("/restaurants/me");
  return res.data.restaurant._id;
}

export async function fetchRestaurantOrders(restaurantId: string) {
  const res = await api.get(
    `/restaurants/${restaurantId}/orders`
  );
  return res.data.orders;
}

export async function changeOrderStatus(
  orderId: string,
  status: DashboardOrderStatus
) {
  return api.post(
    `/orders/${orderId}/status`,
    { status }
  );
}
