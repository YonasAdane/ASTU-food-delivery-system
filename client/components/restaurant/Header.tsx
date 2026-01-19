'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from '../common/modeToggle'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur
      border-b border-slate-200 dark:border-slate-700 px-4 md:px-10 py-3 shadow-sm"
    >
      <div className="max-w-360 mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center text-primary bg-primary/10 rounded-full" />
          <h2 className="text-xl font-bold hidden sm:block">ASTU Food</h2>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <input
            placeholder="Search for restaurants..."
            className="w-full h-11 rounded-full px-4 bg-gray-100 dark:bg-gray-800 outline-none"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6">
          <Link href="#" className="text-primary font-bold text-sm">
            Home
          </Link>
          <Link href="#" className="text-sm">
            Orders
          </Link>
          <Link href="#" className="text-sm">
            Wallet
          </Link>
          <Link href="#" className="text-sm">
            Meal Plan
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gray-300" />
            <span className="hidden sm:block text-sm font-bold">Jane Doe</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden mt-4 px-4 pb-6 space-y-4">
          {/* Mobile Search */}
          <input
            placeholder="Search for restaurants..."
            className="w-full h-11 rounded-full px-4 bg-gray-100 dark:bg-gray-800 outline-none"
          />

          {/* Mobile Nav */}
          <nav className="flex flex-col gap-3">
            <Link
              href="#"
              onClick={() => setOpen(false)}
              className="font-bold text-primary"
            >
              Home
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              Orders
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              Wallet
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              Meal Plan
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
