"use client";

import { 
  SlidersHorizontal, Search, RotateCcw, MapPin, 
  Clock, Star, MessageSquare, Sparkles, X 
} from "lucide-react";
import LogoutAlert from "../common/logoutAlert";

// Define the Props interface for type safety
interface FilterContentProps {
  search: string;
  setSearch: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  area: string;
  setArea: (val: string) => void;
  minDelivery: string;
  setMinDelivery: (val: string) => void;
  maxDelivery: string;
  setMaxDelivery: (val: string) => void;
  isOpen: string;
  setIsOpen: (val: string) => void;
  resetFilters: () => void;
  handleApplyClick: () => void;
  setOpen: (val: boolean) => void;
  AREAS: string[];
  SORT_OPTIONS: any[];
}

export default function FilterContent({
  search, setSearch, sort, setSort, area, setArea,
  minDelivery, setMinDelivery, maxDelivery, setMaxDelivery,
  isOpen, setIsOpen, resetFilters, handleApplyClick, setOpen,
  AREAS, SORT_OPTIONS
}: FilterContentProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-orange-500" />
          Filters
        </h2>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={resetFilters} 
            className="text-xs font-semibold text-gray-500 hover:text-orange-500 flex items-center gap-1"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        {/* SEARCH */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase">Search</h4>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Restaurant name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* SORT */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase">Sort By</h4>
          <div className="flex flex-col gap-3">
            {SORT_OPTIONS.map((item) => (
              <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === item.value}
                  onChange={() => setSort(item.value)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-full border peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors" />
                <span className={`text-sm ${sort === item.value ? "text-orange-600 font-semibold" : "text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100" } flex items-center gap-2`}>
                  {item.icon} {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* AREA */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
            <MapPin size={12} /> Location
          </h4>
          <select 
            value={area} 
            onChange={(e) => setArea(e.target.value)} 
            className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800"
          >
            <option value="">All Areas</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* DELIVERY */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase">Delivery Time (Min)</h4>
          <div className="flex gap-2">
            <input 
              value={minDelivery} 
              onChange={(e) => setMinDelivery(e.target.value)} 
              placeholder="Min" 
              type="number" 
              className="w-1/2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-slate-800" 
            />
            <input 
              value={maxDelivery} 
              onChange={(e) => setMaxDelivery(e.target.value)} 
              placeholder="Max" 
              type="number" 
              className="w-1/2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-slate-800" 
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase">Status</h4>
          <div className="flex gap-2">
            {[
              { label: "Open", value: "true" },
              { label: "Closed", value: "false" },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setIsOpen(isOpen === o.value ? "" : o.value)}
                className={`flex-1 py-2 rounded-xl border text-sm transition-colors ${
                  isOpen === o.value ? "bg-orange-500 text-white border-orange-500" : "text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t mt-auto">
        <button 
          onClick={handleApplyClick} 
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold mb-4 transition-colors dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Apply Filters
        </button>
        <LogoutAlert />
      </div>
    </div>
  );
}