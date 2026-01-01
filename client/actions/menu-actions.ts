// @/actions/menu-actions.ts
"use server";

import { apiClient } from "@/lib/api-client";
import { MenuItemDetail, RestaurantResponse } from "@/lib/validations/menu";
import { revalidatePath } from "next/cache";

export async function getRestaurantData() {
  try {
    return await apiClient<RestaurantResponse[]>({
      method: "GET",
      endpoint: "/restaurants", // Adjust based on your actual endpoint
    });
  } catch (error) {
    return null;
  }
}

export async function addMenuItem(data: MenuItemDetail) {
  try {
    await apiClient({
      method: "POST",
      endpoint: "/restaurant/menu", 
      body: data,
    });
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to add item" };
  }
}

export async function updateMenuItem(id: string, data: Partial<MenuItemDetail>) {
  try {
    await apiClient({
      method: "PATCH",
      endpoint: `/restaurant/menu/${id}`,
      body: data,
    });
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `/restaurant/menu/${id}`,
    });
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}