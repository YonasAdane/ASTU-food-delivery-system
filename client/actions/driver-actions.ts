"use server";

import { apiClient } from "@/lib/api-client";

export interface DriverQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehicle?: string;
  isVerified?: string;
}

export interface Driver {
  _id: string;
  email: string;
  phone: string;
  role: "admin" | "restaurant" | "customer" | "driver";
  restaurantId?: string;
  status: "available" | "unavailable";
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  deleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  trips?: number;
  onTimeRate?: number;
  rating?: number;
}

export interface DriverResponse {
  data: Driver[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export async function getDrivers(params: DriverQueryParams): Promise<DriverResponse> {
  try {
    const queryParams = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      vehicle: params.vehicle,
      isVerified: params.isVerified,
    };

    const response = await apiClient<DriverResponse>({
      method: "GET",
      endpoint: "/admin/users",
      query: { ...queryParams, role: "driver" },
    });

    return response;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw new Error(`Failed to fetch drivers: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function getDriverStats() {
  try {
    const response = await apiClient<{ 
      totalFleet: number; 
      activeNow: number; 
      avgDeliveryTime: number; 
      avgRating: number 
    }>({
      method: "GET",
      endpoint: "/admin/drivers/stats",
    });

    return response;
  } catch (error) {
    console.error("Error fetching driver stats:", error);
    throw new Error(`Failed to fetch driver stats: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function updateDriverStatus(driverId: string, status: "available" | "unavailable") {
  try {
    const response = await apiClient<any>({
      method: "PATCH",
      endpoint: `/admin/users/${driverId}`,
      body: { status },
    });

    return response;
  } catch (error) {
    console.error("Error updating driver status:", error);
    throw new Error(`Failed to update driver status: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function suspendDriver(driverId: string) {
  try {
    const response = await apiClient<any>({
      method: "PATCH",
      endpoint: `/admin/users/${driverId}/suspend`,
    });

    return response;
  } catch (error) {
    console.error("Error suspending driver:", error);
    throw new Error(`Failed to suspend driver: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function restoreDriver(driverId: string) {
  try {
    const response = await apiClient<any>({
      method: "PATCH",
      endpoint: `/admin/users/${driverId}/restore`,
    });

    return response;
  } catch (error) {
    console.error("Error restoring driver:", error);
    throw new Error(`Failed to restore driver: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}