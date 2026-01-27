"use client"
import React from 'react'

type Ticket = {
  _id: string
  title?: string
  status?: string
  createdAt?: string
}

export default function TicketsTable({ tickets }: { tickets: Ticket[] }) {
  if (!tickets || tickets.length === 0) return <div className="p-6">No active tickets</div>

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-xs text-gray-500 uppercase tracking-tight">
          <th className="p-3">Ticket</th>
          <th className="p-3">Status</th>
          <th className="p-3">Created</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t._id} className="border-t border-gray-100 dark:border-gray-800">
            <td className="p-3 text-sm">{t.title}</td>
            <td className="p-3 text-sm">{t.status}</td>
            <td className="p-3 text-sm">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
