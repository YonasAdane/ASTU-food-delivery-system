/* ================= RESTAURANT ORDERS TYPES ================= */

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "picked"
  | "en_route"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  email: string;
  phone: string;
}

export interface RestaurantOrder {
  _id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerId: CustomerInfo;
}
