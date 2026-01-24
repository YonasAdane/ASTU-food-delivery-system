export interface Restaurant {
  _id: string;
  name: string;
  area: string;
  deliveryTime: number;
}

export interface Stats {
  totalOrders: number;
  totalRevenue: number;
}

export interface Order {
  _id: string;
  status: string;
  total: number;
}

export interface StatusChartData {
  status: string;
  count: number;
}

export interface DailyData {
  day: string;
  orders: number;
  revenue: number;
}
