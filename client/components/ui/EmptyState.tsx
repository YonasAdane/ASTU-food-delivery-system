import React from 'react'

export default function EmptyState({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="p-6 text-center text-gray-500">
      <div className="text-lg font-bold">{title || 'No data'}</div>
      <div className="text-sm mt-2">{subtitle || 'Nothing to display right now.'}</div>
    </div>
  )
}
