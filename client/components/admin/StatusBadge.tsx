import React from 'react'

export default function StatusBadge({ tone = 'neutral', label = '' }: { tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'; label?: string }) {
  const base = 'text-[10px] font-bold px-2 py-0.5 rounded-full'
  const classes = {
    neutral: 'text-gray-600 bg-gray-100 dark:bg-gray-800',
    success: 'text-accent-green bg-accent-green/10',
    warning: 'text-accent-gold bg-accent-gold/10',
    danger: 'text-accent-red bg-accent-red/10',
    info: 'text-accent-blue bg-accent-blue/10',
  }
  return <span className={`${base} ${classes[tone]}`}>{label}</span>
}
