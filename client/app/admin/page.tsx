
import React from 'react'
// Use the API route for dashboard data to avoid direct DB calls from the client bundle
import KpiCard from '@/components/admin/KpiCard'
import OrdersTable from '@/components/admin/OrdersTable'
import TicketsTable from '@/components/admin/TicketsTable'
import DonutSummary from '@/components/admin/DonutSummary'
import RevenueBars from '@/components/admin/RevenueBars'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import { getDashboardFromBackend } from './actions/getDashboard'
import ErrorState from '@/components/ui/ErrorState'
export default async function AdminPage() {
	// Use server action to call backend API (avoids DB calls on client)
		const payload = await getDashboardFromBackend();
		if (payload?.error) {
			return <ErrorState message={payload.message} />
		}

		const data = payload?.data || payload || { users: {}, restaurants: {}, orders: { byStatus: {} }, tickets: {} }

	return (
		<div className="min-w-4xl p-8">
			<header className="flex justify-between items-end mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight">
              Admin Operations Overview
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Data-driven summary of system performance
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-3 py-2 rounded-lg border border-card dark:border-gray-800">
              <span className="size-2 rounded-full bg-accent-green"></span>
              System Live
            </div>
          </div>
        </header>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<KpiCard title="Total Users" value={data.users.total} subtitle={`${data.users.customers} customers`} />
				<KpiCard title="Active Restaurants" value={data.restaurants.total} subtitle={`${data.restaurants.open} open`} tone="warning" />
				<KpiCard title="Revenue" value={`$${(data.orders.revenue || 0).toFixed(2)}`} subtitle={`Orders: ${data.orders.total}`} tone="success" />
				<KpiCard title="Support Tickets" value={data.tickets.open} subtitle={`${data.tickets.inProgress} in-progress`} tone="danger" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				<div className="lg:col-span-1 bg-card border rounded-xl p-6">
					<h3 className="text-sm font-bold mb-6">Orders by Status</h3>
					<DonutSummary 
						totalCount={`${(data.orders.total / 1000).toFixed(1)}k`}
						data={[
							{ label: 'Delivered', value: Math.round((data.orders.byStatus?.delivered || 0) / Math.max(1, data.orders.total) * 100) },
							{ label: 'Preparing', value: Math.round((data.orders.byStatus?.preparing || 0) / Math.max(1, data.orders.total) * 100) },
							{ label: 'En Route', value: Math.round((data.orders.byStatus?.en_route || 0) / Math.max(1, data.orders.total) * 100) },
							{ label: 'Pending', value: Math.round((data.orders.byStatus?.pending || 0) / Math.max(1, data.orders.total) * 100) },
							{ label: 'Canceled', value: Math.round((data.orders.byStatus?.canceled || 0) / Math.max(1, data.orders.total) * 100) },
						]} 
					/>
				</div>

				<div className="lg:col-span-2 bg-card border rounded-xl p-6">
					<AdminDashboardClient initialData={data} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-card border border-card dark:border-border-dark/30 rounded-xl overflow-hidden">
					<div className="p-4 border-b border-card dark:border-gray-800 flex justify-between items-center ">
						<h3 className="text-sm font-bold">Recent Orders</h3>
					</div>
					<div className="overflow-x-auto p-4">
						<OrdersTable orders={data.orders.recent || []} />
					</div>
				</div>
				<div className="bg-card border border-card dark:border-border-dark/30 rounded-xl overflow-hidden">
					<div className="p-4 border-b border-card dark:border-gray-800 flex justify-between items-center  ">
						<h3 className="text-sm font-bold">Active Support Tickets</h3>
					</div>
					<div className="overflow-x-auto p-4">
						<TicketsTable tickets={(data.tickets.recent || []).map((t:any) => ({ _id: t._id, title: t.title, status: t.status, createdAt: t.createdAt }))} />
					</div>
				</div>
			</div>
		</div>
	)
}
