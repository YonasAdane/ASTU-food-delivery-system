import React from 'react'

export default function Header() {
  return (
    <header className="flex justify-between items-end mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight">Admin Operations Overview</h2>
        <p className="text-gray-500 dark:text-gray-400">Data-driven summary of system performance</p>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800">
          <span className="size-2 rounded-full bg-accent-green" />
          System Live
        </div>
      </div>
    </header>
  )
}
