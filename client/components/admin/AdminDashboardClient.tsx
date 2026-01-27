"use client"
import React, { useEffect, useState } from 'react'
import KpiCard from '@/components/admin/KpiCard'
import OrdersTable from '@/components/admin/OrdersTable'
import TicketsTable from '@/components/admin/TicketsTable'
import DonutSummary from '@/components/admin/DonutSummary'
import RevenueBars from '@/components/admin/RevenueBars'

type DashboardPayload = any

export default function AdminDashboardClient({ initialData }: { initialData: DashboardPayload }) {
  const [data, setData] = useState<DashboardPayload>(initialData)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  async function fetchFor(daysCount: number | null) {
    setLoading(true)
    try {
      const url = daysCount ? `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard?days=${daysCount}` : `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`
      const res = await fetch(url, { credentials: 'include' })
      const json = await res.json()
      setData(json)
      setDays(daysCount)
    } catch (err) {
      console.error('Fetch dashboard failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-bold">Revenue Growth</h3>
        <div className="flex gap-2">
          <button onClick={() => fetchFor(7)} disabled={loading} className={`px-3 py-1 text-[10px] font-bold rounded border ${days===7? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-accent'}`}>
            7 Days
          </button>
          <button onClick={() => fetchFor(30)} disabled={loading} className={`px-3 py-1 text-[10px] font-bold rounded border ${days===30? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-accent'}`}>
            30 Days
          </button>
          {/* <button onClick={() => fetchFor(null)} disabled={loading} className={`px-3 py-1 text-[10px] font-bold rounded border ${days===null? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-accent'}`}>
            All Time
          </button> */}
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Users" value={data?.users?.total ?? 0} subtitle={`${data?.users?.customers ?? 0} customers`} />
        <KpiCard title="Active Restaurants" value={data?.restaurants?.total ?? 0} subtitle={`${data?.restaurants?.open ?? 0} open`} tone="warning" />
        <KpiCard title="Revenue" value={`$${(data?.orders?.revenue || 0).toFixed ? (data.orders.revenue).toFixed(2) : String(data?.orders?.revenue ?? 0)}`} subtitle={`Orders: ${data?.orders?.total ?? 0}`} tone="success" />
        <KpiCard title="Support Tickets" value={data?.tickets?.open ?? 0} subtitle={`${data?.tickets?.inProgress ?? 0} in-progress`} tone="danger" />
      </div> */}

      <div className="lg:col-span-2 bg-card border rounded-xl p-6 mb-8">
        <RevenueBars series={(data?.orders?.series && data.orders.series.length) ? data.orders.series : (data?.orders?.rawSeries && data.orders.rawSeries.length ? data.orders.rawSeries.map(v => Math.round((v / Math.max(...data.orders.rawSeries,1)) * 100)) : [40,55,45,70,65,85,95])} />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-card dark:border-border-dark/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-card dark:border-gray-800 flex justify-between items-center ">
            <h3 className="text-sm font-bold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <OrdersTable orders={data?.orders?.recent || []} />
          </div>
        </div>
        <div className="bg-card border border-card dark:border-border-dark/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-card dark:border-gray-800 flex justify-between items-center  ">
            <h3 className="text-sm font-bold">Active Support Tickets</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <TicketsTable tickets={(data?.tickets?.recent || []).map((t:any) => ({ _id: t._id, title: t.title, status: t.status, createdAt: t.createdAt }))} />
          </div>
        </div>
      </div> */}
    </div>
  )
}
