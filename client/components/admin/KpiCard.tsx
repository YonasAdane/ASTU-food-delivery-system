"use client"
import React from 'react'
import StatusBadge from './StatusBadge'
import { Card } from '../ui/card'

type Props = {
  title: string
  value: React.ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  subtitle?: React.ReactNode
}

export default function KpiCard({ title, value, tone = 'neutral', subtitle }: Props) {
  return (
    <div className="p-6 bg-card border hover:border-primary/50 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <span className="p-2 bg-[color:var(--primary)]/10 rounded-lg text-[color:var(--primary)]">
          <span className="material-symbols-outlined">insights</span>
        </span>
        <StatusBadge tone={tone} label={subtitle ? String(subtitle) : ''} />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <div className="flex items-end justify-between mt-1">
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  )
}
