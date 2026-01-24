"use server";

import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { PaginatedApi } from "@/types/api";
import { CreateUserFormValues, User } from "@/types/user";
import { refresh, revalidateTag } from "next/cache";

export async function getUsers(page = 1, search?: string, pageSize = 10, role?: string, isVerified?: string, status?: string, deleted?: string) {
  try {
    const data = await apiClient<PaginatedApi<User>>({
      method: "GET",
      endpoint: "/admin/users",
      query: { page, search, limit:pageSize, role, isVerified, status, deleted },
      next: { tags: ["users"] }
    });
    console.log(data)
	// <PaginatedApi<User>>
    return { success: true, message: "Users fetched successfully", data  };
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
      endpoint: `/admin/users/${id}`,
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

export async function restoreUser(id: number | string) {
  try {
    const response = await apiClient<User>({
      method: 'PATCH',
      endpoint: `/admin/users/${id}/restore`,
    });
    revalidateTag("users","max");
    refresh();
    return {
      success: true,
      message: "User restored successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}

export async function verifyUser(id: number | string, verify: boolean) {
  try {
    const response = await apiClient<User>({
      method: 'PATCH',
      endpoint: `/admin/users/${id}/verify`,
      body: { verify },
    });
    revalidateTag("users","max");
    refresh();
    return {
      success: true,
      message: verify ? "User verified successfully" : "User unverified successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}

export async function resetUserPassword(id: number | string) {
  try {
    const response = await apiClient<User>({
      method: 'POST',
      endpoint: `/admin/users/${id}/reset-password`,
      body: { email: "" }, // Placeholder for email
    });
    return {
      success: true,
      message: "Password reset initiated successfully",
      data: response
    };
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err)
    };
  }
}

export async function invalidateUserSessions(id: number | string) {
  try {
    const response = await apiClient<User>({
      method: 'PATCH',
      endpoint: `/admin/users/${id}/invalidate-sessions`,
    });
    return {
      success: true,
      message: "User sessions invalidated successfully",
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
