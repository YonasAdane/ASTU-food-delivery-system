'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import LogoutAlert from '../common/logoutAlert'

const AREAS = [
  { label: 'Downtown', value: 'downtown' },
  { label: 'Midtown', value: 'midtown' },
  { label: 'Uptown', value: 'uptown' },
  { label: 'East Side', value: 'east_side' },
  { label: 'West Side', value: 'west_side' },
  { label: 'North End', value: 'north_end' },
  { label: 'South End', value: 'south_end' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const initialSort = searchParams.get('sort') || 'recommended'
  const initialSearch = searchParams.get('search') || ''
  const initialArea = searchParams.get('area') || ''
  const initialMinDelivery = searchParams.get('minDelivery') || ''
  const initialMaxDelivery = searchParams.get('maxDelivery') || ''
  const initialIsOpen = searchParams.get('isOpen') || ''

  const [sort, setSort] = useState(initialSort)
  const [search, setSearch] = useState(initialSearch)
  const [area, setArea] = useState(initialArea)
  const [minDeliveryTime, setMinDeliveryTime] = useState(initialMinDelivery)
  const [maxDeliveryTime, setMaxDeliveryTime] = useState(initialMaxDelivery)
  const [isOpen, setIsOpen] = useState(initialIsOpen)

  const applyFilters = () => {
    const params = new URLSearchParams()
    params.set('page', '1')

    if (sort) params.set('sort', sort)
    if (search) params.set('search', search)
    if (area) params.set('area', area)
    if (minDeliveryTime) params.set('minDelivery', minDeliveryTime)
    if (maxDeliveryTime) params.set('maxDelivery', maxDeliveryTime)
    if (isOpen) params.set('isOpen', isOpen)

    router.push(`/customer/restaurant?${params.toString()}`)
    setOpen(false)
  }

  const resetFilters = () => {
    router.push('/customer/restaurant')
    setSort('recommended')
    setSearch('')
    setArea('')
    setMinDeliveryTime('')
    setMaxDeliveryTime('')
    setIsOpen('')
  }

  useEffect(() => {
    if (search !== initialSearch) {
      const t = setTimeout(applyFilters, 500)
      return () => clearTimeout(t)
    }
  }, [search])

  useEffect(() => {
    applyFilters()
  }, [sort, area, minDeliveryTime, maxDeliveryTime, isOpen])

  /* ================= FILTER CONTENT ================= */
  const FilterContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm font-semibold text-orange-500 hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* SEARCH */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-600">SEARCH</h4>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants..."
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* SORT */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-600">SORT BY</h4>
        {[
          { label: 'Recommended', value: 'recommended' },
          { label: 'Highest Rated', value: 'rating' },
          { label: 'Most Reviews', value: 'reviews' },
          { label: 'Fastest Delivery', value: 'delivery_time' },
          { label: 'Newest First', value: 'newest' },
        ].map((item) => (
          <label key={item.value} className="flex items-center gap-3">
            <input
              type="radio"
              checked={sort === item.value}
              onChange={() => setSort(item.value)}
              className="accent-orange-500"
            />
            {item.label}
          </label>
        ))}
      </div>

      {/* AREA */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-600">AREA</h4>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Areas</option>
          {AREAS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* DELIVERY TIME */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-600">DELIVERY TIME</h4>
        <input
          type="number"
          value={minDeliveryTime}
          onChange={(e) => setMinDeliveryTime(e.target.value)}
          placeholder="Min"
          className="w-full px-4 py-2 rounded-lg border mb-2"
        />
        <input
          type="number"
          value={maxDeliveryTime}
          onChange={(e) => setMaxDeliveryTime(e.target.value)}
          placeholder="Max"
          className="w-full px-4 py-2 rounded-lg border"
        />
      </div>

      {/* STATUS */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-600">STATUS</h4>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'All', value: '' },
            { label: 'Open', value: 'true' },
            { label: 'Closed', value: 'false' },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => setIsOpen(o.value)}
              className={`px-3 py-1.5 rounded-lg border ${
                isOpen === o.value
                  ? 'bg-orange-100 text-orange-600 border-orange-500'
                  : 'border-gray-300'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold"
      >
        Apply Filters
      </button>

      <LogoutAlert />
    </div>
  )

  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden lg:block w-70 sticky top-24 p-6">
        {FilterContent}
      </aside>

      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-orange-500 text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-lg"
      >
        <SlidersHorizontal size={18} />
        Filters
      </button>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            {FilterContent}
          </div>
        </div>
      )}
    </>
  )
}
