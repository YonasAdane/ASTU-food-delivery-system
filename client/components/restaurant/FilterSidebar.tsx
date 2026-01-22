'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import LogoutAlert from '../common/logoutAlert'

const AREAS = ['Bole', 'Geda', 'Kereyu', 'Fresh', '04', 'Posta', 'Mebrat', 'Other']

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  // Local State: This allows users to pick options without triggering a refresh immediately
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [area, setArea] = useState(searchParams.get('area') || '')
  const [minDelivery, setMinDelivery] = useState(searchParams.get('minDelivery') || '')
  const [maxDelivery, setMaxDelivery] = useState(searchParams.get('maxDelivery') || '')
  const [isOpen, setIsOpen] = useState(searchParams.get('isOpen') || '')

  // Function to push state to URL
  const applyFilters = () => {
    const params = new URLSearchParams()
    params.set('page', '1')

    if (sort) params.set('sort', sort)
    if (search) params.set('search', search)
    if (area) params.set('area', area)
    if (minDelivery) params.set('minDelivery', minDelivery)
    if (maxDelivery) params.set('maxDelivery', maxDelivery)
    if (isOpen) params.set('isOpen', isOpen)

    router.push(`/customer/restaurant?${params.toString()}`)
    setOpen(false) // Close mobile drawer if open
  }

  const resetFilters = () => {
    setSort('recommended')
    setSearch('')
    setArea('')
    setMinDelivery('')
    setMaxDelivery('')
    setIsOpen('')
    router.push('/customer/restaurant')
  }

  // Only the search remains "auto-applying" with a debounce for UX
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== (searchParams.get('search') || '')) {
        applyFilters()
      }
    }, 600)
    return () => clearTimeout(t)
  }, [search])

  const FilterContent = (
    <div className="space-y-8 bg-white dark:bg-slate-900 p-1 lg:p-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-white">Filters</h2>
        <button onClick={resetFilters} className="text-sm font-semibold text-orange-500 hover:text-orange-600">
          Reset All
        </button>
      </div>

      {/* SEARCH */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Restaurant name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      {/* SORT */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort By</h4>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Recommended', value: 'recommended' },
            { label: 'Highest Rated', value: 'rating' },
            { label: 'Fastest Delivery', value: 'delivery_time' },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                checked={sort === item.value}
                onChange={() => setSort(item.value)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* AREA */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location (Area)</h4>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
        >
          <option value="">All Areas</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* DELIVERY TIME */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Time (mins)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minDelivery}
            onChange={(e) => setMinDelivery(e.target.value)}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={maxDelivery}
            onChange={(e) => setMaxDelivery(e.target.value)}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800 text-sm"
          />
        </div>
      </div>

      {/* STATUS */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</h4>
        <div className="flex gap-2">
          {[
            { label: 'Open', value: 'true' },
            { label: 'Closed', value: 'false' },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => setIsOpen(isOpen === o.value ? '' : o.value)}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                isOpen === o.value
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-orange-200'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-orange-100 dark:shadow-none"
      >
        Apply Filters
      </button>

      <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
         <LogoutAlert />
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-72 sticky top-24 h-fit pr-8 scroll-auto">
        {FilterContent}
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-orange-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl active:scale-95 transition-transform"
      >
        <SlidersHorizontal size={20} />
        <span className="font-bold">Filters</span>
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            {FilterContent}
          </div>
        </div>
      )}
    </>
  )
}