export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "picked"
  | "en_route"
  | "completed"
  | "cancelled";

export interface Order {
  _id: string;
  items: { name: string; quantity: number }[];
  status: OrderStatus;
  total: number;
  user?: { email?: string };
}
