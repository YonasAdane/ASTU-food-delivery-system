/* ================= DASHBOARD TYPES ================= */

export type DashboardOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "picked"
  | "en_route"
  | "completed"
  | "cancelled";

export interface DashboardOrderItem {
  name: string;
  quantity: number;
}

export interface DashboardOrderUser {
  email?: string;
}

export interface DashboardOrder {
  _id: string;
  items: DashboardOrderItem[];
  status: DashboardOrderStatus;
  total: number;
  user?: DashboardOrderUser;
}
