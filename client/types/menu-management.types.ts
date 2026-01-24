/* ================= MENU MANAGEMENT TYPES ================= */

export interface MenuItem {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  inStock: boolean;
}

export interface Restaurant {
  _id: string;
  name: string;
  menu: MenuItem[];
}
