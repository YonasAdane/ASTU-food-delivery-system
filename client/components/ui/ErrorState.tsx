import React from 'react'

export default function ErrorState({ message }: { message?: string }) {
  return (
    <div className="p-6 text-center text-red-600">
      <div className="text-lg font-bold">Error</div>
      <div className="text-sm mt-2">{message || 'Something went wrong.'}</div>
    </div>
  )
}
