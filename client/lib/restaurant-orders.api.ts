import { api } from "@/lib/api";
import type { RestaurantOrder } from "@/types/restaurant-orders.types";

/* ================= API ================= */

export async function fetchRestaurantOrders(): Promise<RestaurantOrder[]> {
  const me = await api.get("/restaurants/me");
  const restaurantId = me.data.restaurant._id;

  const res = await api.get(
    `/restaurants/${restaurantId}/orders`
  );

  return res.data.orders || [];
}
