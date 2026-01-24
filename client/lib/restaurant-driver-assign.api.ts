import axios from "axios";
import {
  Driver,
  Order,
  RestaurantMeResponse,
} from "@/types/restaurant-driver-assign.types";

/* ================= AXIOS ================= */
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

/* ================= HELPERS ================= */
export async function fetchMyRestaurantId(): Promise<string> {
  const res = await api.get<RestaurantMeResponse>("/restaurants/me");
  return res.data.restaurant._id;
}

/* ================= ORDERS ================= */
export async function fetchRestaurantOrders(
  restaurantId: string
): Promise<Order[]> {
  const res = await api.get(
    `/restaurants/${restaurantId}/orders`
  );
  return res.data.orders || [];
}

/* ================= DRIVERS ================= */
export async function fetchActiveDrivers(
  restaurantId: string
): Promise<Driver[]> {
  const res = await api.get(
    `/restaurants/${restaurantId}/active-drivers`
  );
  return res.data.drivers || [];
}

/* ================= ASSIGN DRIVER ================= */
export async function assignDriverToOrder(
  orderId: string,
  driverId: string
) {
  return api.post("/restaurants/assign-driver", {
    orderId,
    driverId,
  });
}

/* ================= INVITE DRIVER ================= */
export async function inviteDriver(phone: string) {
  return api.post("/restaurants/invite-driver", { phone });
}
