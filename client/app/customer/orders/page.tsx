"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Package, Clock, CheckCircle, Truck, XCircle, 
  ChevronRight, Calendar, Filter, ChevronLeft, ChevronDown 
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Loader2, Utensils } from "lucide-react";



// Filter Options
const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Picked Up", value: "picked" },
  { label: "On the Way", value: "en_route" },
  { label: "Delivered", value: "delivered" },
  { label: "Canceled", value: "canceled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/all`, { 
        params: { 
          page, 
          limit: 10,
          status: statusFilter,
          sortBy
        },
        withCredentials: true 
      });
      setOrders(res.data.data.orders);
      setPagination({
        page: res.data.data.pagination.currentPage,
        totalPages: res.data.data.pagination.totalPages
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter, sortBy]);

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Orders</h1>
          
          {/* Sorting Dropdown */}
          <div className="relative group z-10">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer shadow-sm"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && orders.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function OrderCard({ order }: { order: any }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/10 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <Utensils size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              {order.restaurantId?.name || "Unknown Restaurant"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
              <Calendar size={14} />
              {format(new Date(order.createdAt), "MMM d, yyyy • h:mm a")}
            </div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="py-4 border-y border-dashed border-gray-100 dark:border-slate-800 my-2">
        <div className="flex flex-wrap gap-2">
          {order.items.slice(0, 3).map((item: any, idx: number) => (
             <span key={idx} className="bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
               {item.quantity}x {item.name}
             </span>
          ))}
          {order.items.length > 3 && (
            <span className="bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-semibold text-slate-400">
              +{order.items.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Amount</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {order.total} <span className="text-xs font-bold text-orange-500">ETB</span>
          </span>
        </div>
        
        <Link 
          href={`/customer/orders/${order._id}`}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200 dark:shadow-none"
        >
          Track Order <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    pending:   { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
    accepted:  { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
    preparing: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Loader2 },
    ready:     { color: "bg-purple-100 text-purple-700 border-purple-200", icon: Package },
    picked:    { color: "bg-teal-100 text-teal-700 border-teal-200", icon: Package },
    en_route:  { color: "bg-orange-100 text-orange-700 border-orange-200", icon: Truck },
    delivered: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    canceled:  { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  };

  const { color, icon: Icon } = config[status] || config.pending;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${color} uppercase tracking-wide shadow-sm`}>
      <Icon size={14} className={status === 'preparing' ? 'animate-spin' : ''} />
      {status.replace("_", " ")}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
      <div className="w-24 h-24 bg-orange-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <Package size={40} className="text-orange-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders found</h2>
      <p className="text-slate-500 mb-8 max-w-xs text-center">We couldn't find any orders with the current filters.</p>
      <Link href="/customer/restaurants" className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition">
        Browse Restaurants
      </Link>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-56 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800" />
      ))}
    </div>
  );
}