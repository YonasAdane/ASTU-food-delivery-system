"use client"
import React from 'react'

type Order = {
  _id: string
  createdAt?: string
  total?: number
  status?: string
  customerName?: string
   customerId: {
        _id:string,
        email:string,
        phone:string
      },
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  if (!orders || orders.length === 0) {
    return <div className="p-6">No recent orders</div>
  }

  return (
    <table className="w-full text-left">
      {/* {JSON.stringify(orders)} */}
      <thead>
        <tr className="text-xs text-gray-500 uppercase tracking-tight">
          <th className="p-3">Order #</th>
          <th className="p-3">Customer</th>
          <th className="p-3">Total</th>
          <th className="p-3">Status</th>
          <th className="p-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o._id} className="border-t border-gray-100 dark:border-gray-800">
            <td className="p-3 text-sm">{o._id.slice(-6)}</td>
            <td className="p-3 text-sm">{o.customerId.email || '—'}</td>
            <td className="p-3 text-sm">${(o.total || 0).toFixed(2)}</td>
            <td className="p-3 text-sm">
              <span className="px-2 py-1 rounded-full text-[11px] bg-gray-100 dark:bg-gray-800">{o.status}</span>
            </td>
            <td className="p-3 text-sm">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
