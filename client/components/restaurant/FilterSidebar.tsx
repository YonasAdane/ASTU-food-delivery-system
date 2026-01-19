'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import LogoutAlert from '../common/logoutAlert'


// TODO: Fetch areas dynamically from backend API
// Example API call: GET /api/areas
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

  // Get existing filter values from URL
  const initialSort = searchParams.get('sort') || 'recommended'
  const initialSearch = searchParams.get('search') || ''
  const initialArea = searchParams.get('area') || ''
  const initialMinDelivery = searchParams.get('minDelivery') || ''
  const initialMaxDelivery = searchParams.get('maxDelivery') || ''
  const initialIsOpen = searchParams.get('isOpen') || ''

  // State for all filters
  const [sort, setSort] = useState(initialSort)
  const [search, setSearch] = useState(initialSearch)
  const [area, setArea] = useState(initialArea)
  const [minDeliveryTime, setMinDeliveryTime] = useState(initialMinDelivery)
  const [maxDeliveryTime, setMaxDeliveryTime] = useState(initialMaxDelivery)
  const [isOpen, setIsOpen] = useState(initialIsOpen)

  // TODO: Fetch areas dynamically when component mounts
  // useEffect(() => {
  //   const fetchAreas = async () => {
  //     try {
  //       const response = await fetch('/api/areas');
  //       const data = await response.json();
  //       // setAreas(data.areas);
  //     } catch (error) {
  //       console.error('Failed to fetch areas:', error);
  //     }
  //   };
  //   fetchAreas();
  // }, []);

  // Apply filters immediately on change (optional debounce for search)
  const applyFilters = () => {
    const params = new URLSearchParams()

    // Always reset to page 1 when filters change
    params.set('page', '1')

    // Add non-empty filter values
    if (sort) params.set('sort', sort)
    if (search) params.set('search', search)
    if (area) params.set('area', area)
    if (minDeliveryTime) params.set('minDelivery', minDeliveryTime)
    if (maxDeliveryTime) params.set('maxDelivery', maxDeliveryTime)
    if (isOpen) params.set('isOpen', isOpen)

    // TODO: This triggers a route change which should fetch new data
    // The parent component should listen to URL changes and call:
    // GET /api/restaurants?${params.toString()}
    router.push(`/customer/restaurant?${params.toString()}`)
  }

  // Reset all filters
  const resetFilters = () => {
    // TODO: This clears all filters and fetches default restaurant list
    // Backend call: GET /api/restaurants (without any query params)
    router.push('/customer/restaurant')
    setSort('recommended')
    setSearch('')
    setArea('')
    setMinDeliveryTime('')
    setMaxDeliveryTime('')
    setIsOpen('')
  }

  // Apply filters when any filter changes (with debounce for search)
  useEffect(() => {
    if (search !== initialSearch) {
      const timer = setTimeout(() => {
        applyFilters()
      }, 500) // Debounce search by 500ms
      return () => clearTimeout(timer)
    } else {
      applyFilters()
    }
    // Note: When this effect runs, it updates the URL which should trigger
    // a backend API call in the parent component
  }, [sort, area, minDeliveryTime, maxDeliveryTime, isOpen])

  // Handle search separately with debounce
  useEffect(() => {
    if (search !== initialSearch) {
      const timer = setTimeout(() => {
        applyFilters()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [search])

  return (
    <aside className="hidden lg:block w-70 sticky top-24 border-gray-200 p-6 space-y-8">
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
        <h4 className="text-sm font-bold tracking-wider text-gray-600">SEARCH</h4>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* SORT */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold tracking-wider text-gray-600">SORT BY</h4>
        {[
          { label: 'Recommended', value: 'recommended' },
          { label: 'Highest Rated', value: 'rating' },
          { label: 'Most Reviews', value: 'reviews' },
          { label: 'Fastest Delivery', value: 'delivery_time' },
          { label: 'Newest First', value: 'newest' },
        ].map((item) => (
          <label key={item.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={sort === item.value}
              onChange={() => setSort(item.value)}
              className="accent-orange-500"
            />
            <span className="text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>

      {/* AREA FILTER */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold tracking-wider text-gray-600">AREA</h4>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">All Areas</option>
          {AREAS.map((areaOption) => (
            <option key={areaOption.value} value={areaOption.value}>
              {areaOption.label}
            </option>
          ))}
        </select>
      </div>

      {/* DELIVERY TIME FILTER */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold tracking-wider text-gray-600">DELIVERY TIME</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum (minutes)</label>
            <input
              type="number"
              min="0"
              max="120"
              step="5"
              value={minDeliveryTime}
              onChange={(e) => setMinDeliveryTime(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum (minutes)</label>
            <input
              type="number"
              min="0"
              max="120"
              step="5"
              value={maxDeliveryTime}
              onChange={(e) => setMaxDeliveryTime(e.target.value)}
              placeholder="60"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* OPEN STATUS FILTER */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold tracking-wider text-gray-600">RESTAURANT STATUS</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: '' },
            { label: 'Open Now', value: 'true' },
            { label: 'Closed', value: 'false' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setIsOpen(option.value)}
              className={`px-3 py-1.5 rounded-lg border font-medium text-sm ${
                isOpen === option.value
                  ? 'bg-orange-100 border-orange-500 text-orange-600'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK APPLY BUTTON */}
      <button
        onClick={applyFilters}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
      >
        Apply Filters
      </button>
      <div className="mt-auto">

      <LogoutAlert/>
      </div>
    </aside>
  )
}