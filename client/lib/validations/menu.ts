// @/lib/validations/menu.ts
import { z } from "zod";

export const menuItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(5, "Description is too short"),
  image: z.string().url("Please provide a valid image URL"),
  inStock: z.boolean().default(true),
});

export type MenuItemDetail = z.infer<typeof menuItemSchema>;

export interface RestaurantResponse {
  _id: string;
  name: string;
  menu: MenuItemDetail[];
  // ... other fields from your interface
}