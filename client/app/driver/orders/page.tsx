"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {useUserStore} from "@/hooks/use-profile";
const API_URL = "http://localhost:5000";

export default function DriverOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const driverId = user?._id || "DRIVER_ID";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/drivers/${driverId}/orders`, { withCredentials: true });
        setOrders(res.data.data.orders);
      } catch (err) {
        console.log("No orders found");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-orange-600" /></div>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">My Tasks</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-slate-500 text-center mt-20">No orders assigned yet.</p>
        ) : (
          orders.map((order) => (
            <Link 
              href={`/driver/orders/${order._id}`} 
              key={order._id}
              className="block bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {order.status.replace("_", " ")}
                </span>
                <span className="text-slate-400 text-xs font-bold">#{order._id.slice(-4)}</span>
              </div>

              <div className="space-y-3 mb-4">
                {/* Pick Up */}
                <div className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-slate-300" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Pick Up</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Restaurant Name</p> 
                    {/* Note: Backend needs to populate restaurantId to show name here */}
                  </div>
                </div>
                {/* Vertical Line */}
                <div className="ml-1 w-0.5 h-4 bg-slate-200" />
                {/* Drop Off */}
                <div className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Drop Off</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Customer Location</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                   <Clock size={14} />
                   {format(new Date(order.createdAt), "h:mm a")}
                </div>
                <div className="font-black text-lg">
                  {order.total} <span className="text-xs text-orange-500">ETB</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}