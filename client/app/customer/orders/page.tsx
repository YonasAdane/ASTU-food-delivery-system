"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Package, Clock, CheckCircle, Truck, XCircle, 
  ChevronRight, Calendar, MapPin, Loader2, Utensils 
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const API_URL = "http://localhost:5000";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Based on your controller logic: exports.getOrderHistory
        const res = await axios.get(`${API_URL}/orders/all?limit=20`, { withCredentials: true });
        setOrders(res.data.data.orders);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <OrdersSkeleton />;
  
  if (error || orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Orders Yet</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't placed any orders yet. Hungry?</p>
          <Link href="/customer/restaurant" className="block w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition">
            Start Ordering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Your Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      {order.restaurantId?.name || "Restaurant"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={12} />
                      {format(new Date(order.createdAt), "MMM d, yyyy • h:mm a")}
                    </div>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="py-4 border-y border-dashed border-gray-100 dark:border-slate-800 my-2">
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
                  {order.items.map((item: any) => `${item.quantity}x ${item.name}`).join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {order.total} <span className="text-xs font-bold text-orange-500">ETB</span>
                  </span>
                </div>
                
                {/* Link to Detail Page (You can create app/customer/orders/[id]/page.tsx later) */}
                <Link 
                  href={`/customer/orders/${order._id}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition"
                >
                  Track Order <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper to color-code the status based on your Schema Enum
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    accepted: "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-indigo-100 text-indigo-700 border-indigo-200",
    ready: "bg-purple-100 text-purple-700 border-purple-200",
    picked: "bg-teal-100 text-teal-700 border-teal-200",
    en_route: "bg-orange-100 text-orange-700 border-orange-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    canceled: "bg-red-100 text-red-700 border-red-200",
  };

  const icons: any = {
    pending: <Clock size={12} />,
    en_route: <Truck size={12} />,
    delivered: <CheckCircle size={12} />,
    canceled: <XCircle size={12} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending} uppercase tracking-wide`}>
      {icons[status] || <Clock size={12} />}
      {status.replace("_", " ")}
    </span>
  );
}

function OrdersSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 dark:bg-slate-800 rounded-xl mb-8" />
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 bg-gray-100 dark:bg-slate-900 rounded-3xl" />
      ))}
    </div>
  );
}