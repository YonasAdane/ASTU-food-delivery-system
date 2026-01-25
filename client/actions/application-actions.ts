"use server";

import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";

interface OwnerInfo {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface RestaurantApplication {
  _id: string;
  name: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  area: string;
  deliveryTime: string;
  image: string;
  coverImage: string;
  menu: any[];
  ownerId: string | OwnerInfo;
  verified: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed properties from populated owner
  firstName?: string;
  lastName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

export interface RestaurantApplicationResponse {
  data: RestaurantApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export async function getRestaurantApplications(params: ApplicationQueryParams) {
  try {
    const queryParams = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      // Note: The backend doesn't currently support status filtering for pending restaurants
      // We only fetch pending restaurants (verified: false)
    };

    const response = await apiClient<{ 
      status: string; 
      data:  RestaurantApplication[]; 
      meta: { total: number; page: number; limit: number; pages: number } 
    }>({
      method: "GET",
      endpoint: "/admin/restaurants/pending",
      query: queryParams,
    });

    console.log(response);
    // Extract pending restaurants from the response
    // const pendingRestaurants = response.data || [];
    
    return {
      data: response.data,
      meta: {
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        pages: response.meta.pages,
      }
    };
  } catch (error) {
    console.error("Error fetching restaurant applications:", error);
    return { error: true, message: getErrorMessage(error) };
  }
}

export async function verifyRestaurant(restaurantId: string) {
  try {
    const response = await apiClient<any>({
      method: "PATCH",
      endpoint: `/admin/restaurants/${restaurantId}/verify`,
    });

    return response;
  } catch (error) {
    console.error("Error verifying restaurant:", error);
    return { error: true, message: getErrorMessage(error) };
  }
}

export async function rejectRestaurant(restaurantId: string) {
  try {
    const response = await apiClient<any>({
      method: "PATCH",
      endpoint: `/admin/restaurants/${restaurantId}/reject`,
    });

    return response;
  } catch (error) {
    console.error("Error rejecting restaurant:", error);
    return { error: true, message: getErrorMessage(error) };
  }
}

export async function getRestaurantApplicationDetails(restaurantId: string) {
  try {
    const response = await apiClient<{ data: RestaurantApplication }>({
      method: "GET",
      endpoint: `/admin/restaurants/${restaurantId}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant application details:", error);
    return { error: true, message: getErrorMessage(error) };
  }
}