"use server";

import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { PaginatedApiResponse } from "@/types/api";
import { CreateUserFormValues, User } from "@/types/user";
import { refresh, revalidateTag } from "next/cache";

export async function getUsers(page = 1, search?: string, pageSize = 10, role?: string) {
  try {
    const data:{data:User[]} = await apiClient({
      method: "GET",
      endpoint: "/users",
      query: { page, search, limit:pageSize,role },
      next: { tags: ["users"] }
    });
	// <PaginatedApi<User>>
    return { success: true, message: "Users fetched successfully", data:{
		data:data.data,
		meta: {
			total: 21,
			page: 1,
			limit: 10,
			pages: 3
		}
}  } as PaginatedApiResponse<User>;
    // return { success: true, message: "Users fetched successfully", data };
  } catch (err) {
    console.error("error", err);
    return { error: true, message: getErrorMessage(err) };
  }
}

export async function createUser(data: CreateUserFormValues) {
  try {
    console.log({data});
    const response = await apiClient<User>({
      method: "POST",
      endpoint: "/auth/register",
      body: data
    });
    revalidateTag("users","max");
    refresh();
    return {
      success: true,
      message: "User created successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}

export async function updateUser(id: number | string, data: Partial<CreateUserFormValues>) {
  try {
    const response = await apiClient<User>({
      method: 'PATCH',
      endpoint: `/auth/register/${id}`,
      body: data,
    });
    revalidateTag("users","max");
    refresh();
    return {
      success: true,
      message: "User updated successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}
export async function UserDetais(id: number | string) {
  try {
    const response = await apiClient<User>({
      method: 'GET',
      endpoint: `/users/${id}`,
    });
    return {
      success: true,
      message: "User fetched successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}

export async function deleteUser(id: number | string) {
  try {
    const response = await apiClient({
      method: 'DELETE',
      endpoint: `/users/${id}`,
    });
    revalidateTag("users","max");
    refresh();
    return {
      success: true,
      message: "User deleted successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}
