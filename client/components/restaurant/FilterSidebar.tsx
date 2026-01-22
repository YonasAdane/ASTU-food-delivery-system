"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {SlidersHorizontal,Search,RotateCcw,MapPin,Clock,Star,MessageSquare,Sparkles,X,} from "lucide-react";
import LogoutAlert from "../common/logoutAlert";
import FilterContent from "./FilterContent";

const AREAS = ["Bole", "Geda", "Kereyu", "Fresh", "04", "Posta", "Mebrat", "Other"];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended", icon: <Sparkles size={14} /> },
  { label: "Highest Rated", value: "rating", icon: <Star size={14} /> },
  { label: "Most Reviewed", value: "reviews", icon: <MessageSquare size={14} /> },
  { label: "Fastest Delivery", value: "delivery_time", icon: <Clock size={14} /> },
  { label: "Newest", value: "newest", icon: <Clock size={14} /> },
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Initialize state
  const [sort, setSort] = useState(searchParams.get("sort") || "recommended");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [area, setArea] = useState(searchParams.get("area") || "");
  const [minDelivery, setMinDelivery] = useState(searchParams.get("minDelivery") || "");
  const [maxDelivery, setMaxDelivery] = useState(searchParams.get("maxDelivery") || "");
  const [isOpen, setIsOpen] = useState(searchParams.get("isOpen") || "");

  // FIX 1: Handle URL updates separately from closing the modal
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to page 1 on filter change

    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    if (area) params.set("area", area);
    if (minDelivery) params.set("minDelivery", minDelivery);
    if (maxDelivery) params.set("maxDelivery", maxDelivery);
    if (isOpen) params.set("isOpen", isOpen);

    router.push(`/customer/restaurant?${params.toString()}`);
  }, [router, sort, search, area, minDelivery, maxDelivery, isOpen]);

  // Handler for the "Apply Filters" button (updates URL + Closes Modal)
  const handleApplyClick = () => {
    updateURL();
    setOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSort("recommended");
    setSearch("");
    setArea("");
    setMinDelivery("");
    setMaxDelivery("");
    setIsOpen("");
    router.push("/customer/restaurant");
    setOpen(false);
  };
  const filterProps = {
    search, setSearch, sort, setSort, area, setArea,
    minDelivery, setMinDelivery, maxDelivery, setMaxDelivery,
    isOpen, setIsOpen, resetFilters, handleApplyClick, setOpen,
    AREAS, SORT_OPTIONS
  };
  // FIX 2: Debounce Search (Only update URL, DO NOT close modal)
  useEffect(() => {
    const t = setTimeout(() => {
      // Only push if the search value is different from what's currently in the URL
      if (search !== (searchParams.get("search") || "")) {
        updateURL();
      }
    }, 600);
    return () => clearTimeout(t);
  }, [search, searchParams, updateURL]);

  // FIX 3: Sync local state if URL changes externally (e.g. Browser Back Button)
  useEffect(() => {
    setSort(searchParams.get("sort") || "recommended");
    setSearch(searchParams.get("search") || "");
    setArea(searchParams.get("area") || "");
    setMinDelivery(searchParams.get("minDelivery") || "");
    setMaxDelivery(searchParams.get("maxDelivery") || "");
    setIsOpen(searchParams.get("isOpen") || "");
  }, [searchParams]);

  // Extracted JSX for reusability and cleaner render


  return (
    <>
      <aside className="hidden lg:block w-72 sticky top-28 h-[calc(100vh-8rem)]">
        <FilterContent {...filterProps} />
      </aside>

      {/* Mobile Toggle Button */}
      <button onClick={() => setOpen(true)} className="lg:hidden fixed bottom-6 right-6 z-40 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
        <SlidersHorizontal size={20} className="mr-2 inline" /> Filters
      </button>

      {/* Mobile Modal */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 w-full h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl p-6 overflow-hidden">
            <FilterContent {...filterProps} />
          </div>
        </div>
      )}
    </>
  );
}