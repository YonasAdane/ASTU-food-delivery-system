import { api } from "@/lib/api";
import type { MenuItem, Restaurant } from "@/types/menu-management.types";

/* ================= API ================= */

export async function fetchMyRestaurant(): Promise<Restaurant> {
  const res = await api.get("/restaurants/me");
  return res.data.restaurant;
}

export async function toggleMenuAvailability(
  restaurantId: string,
  item: MenuItem
) {
  return api.put(
    `/restaurants/${restaurantId}/menu/${item._id}`,
    { inStock: !item.inStock }
  );
}

export async function deleteMenuItem(
  restaurantId: string,
  itemId: string
) {
  return api.delete(
    `/restaurants/${restaurantId}/menu/${itemId}`
  );
}

export async function updateMenuItem(
  restaurantId: string,
  item: MenuItem
) {
  return api.put(
    `/restaurants/${restaurantId}/menu/${item._id}`,
    item
  );
}

export async function createMenuItem(
  restaurantId: string,
  item: MenuItem
) {
  const res = await api.post(
    `/restaurants/${restaurantId}/menu`,
    item
  );
  return res.data.menuItem;
}
