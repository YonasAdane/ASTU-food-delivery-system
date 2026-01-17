import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { PaginatedApi } from "@/types/api";
import { Order } from "@/types/order";

export interface UpdateOrderStatusRequest {
  status: string;
}

export async function getAdminOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  restaurantId?: string;
  driverId?: string;
  customerId?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  hasComplaints?: string;
}) {
	try{
  const data= await apiClient<PaginatedApi<Order>>({
    method: 'GET',
    endpoint: '/admin/orders',
    query: params,
  });
		console.log({data})
		return { success: true, message: "orders fetched successfully", data  };

			// return { success: true, message: "Users fetched successfully", data };
		} catch (err) {
			console.error("error", err);
			return { error: true, message: getErrorMessage(err) };
		}
}

export async function updateOrderStatus(orderId: string, status: string) {
  return await apiClient<Order>({
    method: 'PATCH',
    endpoint: `/admin/orders/${orderId}/status`,
    body: { status },
  });
}
