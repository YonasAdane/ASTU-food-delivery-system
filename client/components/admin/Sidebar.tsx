"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const nav = [
  { href: '/admin', label: 'Overview', icon: 'grid_view' },
  { href: '/admin/orders', label: 'Orders', icon: 'shopping_bag' },
  { href: '/admin/restaurants', label: 'Restaurants', icon: 'storefront' },
  { href: '/admin/users', label: 'Users & Drivers', icon: 'group' },
  { href: '/admin/support', label: 'Support Tickets', icon: 'support_agent' },
]

export default function Sidebar() {
  const pathname = usePathname() || '/admin'

  return (
    <aside className="w-64 bg-background-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 rounded-full bg-[color:var(--primary)] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">dashboard_customize</span>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-none">AdminOps</h1>
          <p className="text-[10px] text-gray-500 dark:text-primary/70 uppercase tracking-widest mt-1">Global Control</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {nav.map((n) => {
          const active = pathname === n.href || (n.href === '/admin' && pathname === '/admin')
          return (
            <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${active ? 'bg-[color:var(--primary)]/10 text-[color:var(--primary)] border border-[color:var(--primary)]/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'}`}>
              <span className="material-symbols-outlined">{n.icon}</span>
              <span className="text-sm font-medium">{n.label}</span>
            </Link>
          )
        })}

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
