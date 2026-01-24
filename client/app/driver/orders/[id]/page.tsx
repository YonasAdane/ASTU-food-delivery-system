"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Phone, Check, Package, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Dynamic import for the Map
const LiveTrackingMap = dynamic(() => import('@/components/orders/LiveTrackingMap'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold">Loading Map...</div>
});


export default function DriverOrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { withCredentials: true });
        setOrder(res.data.data);
      } catch (err) {
        toast.error("Order not found");
        router.push("/driver/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, router]);

  const updateStatus = async (newStatus: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`, { status: newStatus }, { withCredentials: true });
      setOrder({ ...order, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      if (newStatus === "delivered") {
        router.push("/driver/orders"); 
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;
  if (!order) return null;

  const renderActionButton = () => {
    switch(order.status) {
      case 'ready':
        return (
          <button onClick={() => updateStatus('picked')} className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-95 transition-transform">
            <Package size={20} /> Confirm Pickup
          </button>
        );
      case 'picked':
      case 'en_route':
        return (
          <button onClick={() => updateStatus('delivered')} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 active:scale-95 transition-transform">
            <Check size={20} /> Mark as Delivered
          </button>
        );
      case 'delivered':
        return <div className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl text-center">Completed</div>;
      default:
        return <div className="w-full py-4 bg-yellow-100 text-yellow-700 font-bold rounded-2xl text-center capitalize border border-yellow-200">Waiting for {order.status}</div>;
    }
  };

  // --- FIX START: Explicit Type Definition ---
  // We force these to be [number, number] so TypeScript is happy
  const customerLoc: [number, number] = order.deliveryLocation?.coordinates 
    ? [order.deliveryLocation.coordinates[1], order.deliveryLocation.coordinates[0]]
    : [9.0, 38.7];
    
  const restaurantLoc: [number, number] = order.restaurantId?.location?.coordinates
    ? [order.restaurantId.location.coordinates[1], order.restaurantId.location.coordinates[0]]
    : [9.0, 38.7]; 
  // --- FIX END ---

  return (
    <div className="pb-24 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="relative h-[45vh] w-full">
        {/* Now we pass strictly typed props */}
        <LiveTrackingMap 
           customerLocation={customerLoc} 
           restaurantLocation={restaurantLoc}
           driverId={order.driverId?._id}
        />
        <div className="absolute top-6 left-6 z-1000">
            <button 
              onClick={() => router.back()} 
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <ArrowRight className="rotate-180" size={20}/>
            </button>
        </div>
      </div>

      <div className="-mt-12 relative z-10 bg-white dark:bg-slate-900 rounded-t-[35px] p-8 shadow-2xl min-h-[60vh]">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Order #{order._id.slice(-4).toUpperCase()}</h2>
            <p className="text-slate-500 text-sm font-medium">{order.items.length} items • {order.paymentMethod}</p>
          </div>
          <div className="text-2xl font-black text-orange-600">{order.total} <span className="text-sm font-bold text-orange-400">ETB</span></div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-3xl mb-8 flex items-center gap-4 border border-gray-100 dark:border-slate-800">
          <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm">
            {order.customerId?.name?.[0] || "U"}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white text-lg">{order.customerId?.name || "Customer"}</p>
            <p className="text-sm text-slate-500">{order.customerId?.phone || "No phone"}</p>
          </div>
          {order.customerId?.phone && (
            <a href={`tel:${order.customerId.phone}`} className="p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors shadow-green-200 dark:shadow-none shadow-lg">
              <Phone size={24} />
            </a>
          )}
        </div>

        <div className="mb-8 sticky bottom-4 z-20">
           {renderActionButton()}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Order Items</h3>
          <div className="divide-y divide-dashed divide-gray-100 dark:divide-slate-800">
            {order.items.map((item: any, i:number) => (
              <div key={i} className="flex justify-between py-3">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    <span className="font-bold text-slate-900 dark:text-white mr-2">{item.quantity}x</span> 
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center mt-4">
            <span className="font-bold text-slate-500">Total Bill</span>
            <span className="font-black text-xl text-slate-900 dark:text-white">{order.total} ETB</span>
          </div>
        </div>
      </div>
    </div>
  );
}