"use server"
import { apiClient } from '@/lib/api-client'
import { getErrorMessage } from '@/lib/get-error-message'

export async function getDashboardFromBackend(days?: number) {
  try {
    const query = days ? { days } : undefined;
    const data = await apiClient<any>({ method: 'GET', endpoint: '/admin/dashboard', query })
    console.log(data)
    return data
  } catch (err: unknown) {
    return { error: true, message: getErrorMessage(err) }
  }
}
