"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Plus, Clock, Star, MapPin, Loader2, ChevronLeft, Info, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
const API_BASE = "http://localhost:5000";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  
  const { fetchCount } = useCartStore();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API_BASE}/restaurants/${id}`,{withCredentials:true});
        setRestaurant(res.data);
      } catch (err) {
        toast.error("Could not load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleAddToCart = async (item: any, forceClear = false) => {
    setAddingId(item._id);
    try {
      // 1. If user agreed to clear, we must delete the old cart first
      if (forceClear) {
        // We fetch the current cart to get the restaurantId needed for delete
        const currentCart = await axios.get(`${API_BASE}/customer/getCart`, { withCredentials: true });
        const oldRestId = currentCart.data.data.restaurantId._id;
        await axios.delete(`${API_BASE}/customer/deleteCart/${oldRestId}`, { withCredentials: true });
      }

      // 2. Add the new item
      await axios.post(`${API_BASE}/customer/addToCart`, {
        menuItemId: item._id,
        restaurantId: id,
        quantity: 1,
      }, { withCredentials: true });

      toast.success(`${item.name} added to cart!`, { icon: '🔥' });
      await fetchCount();
      setShowConflictModal(false);
    } catch (error: any) {
      if (error.response?.status === 400) {
        setShowConflictModal(true);
      } else {
        toast.error(error.response?.data?.message || "Failed to add item");
      }
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <MenuSkeleton />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-32">
      
      {/* Hero Header */}
      <div className="relative h-80 w-full">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200" 
          className="w-full h-full object-cover"
          alt="Food"
        />
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Restaurant Info Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 italic">
                {restaurant?.name.toUpperCase()}
              </h1>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-orange-500" /> {restaurant?.area}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-orange-500" /> {restaurant?.deliveryTime} mins</span>
              </div>
            </div>
            <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-orange-200 dark:shadow-none">
              <Star size={18} fill="currentColor" /> {restaurant?.ratings}
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 border-l-4 border-orange-500 pl-4">
            Popular Items
          </h2>
          
          <div className="grid gap-6">
            {restaurant?.menu.map((item: any) => (
              <motion.div 
                whileHover={{ y: -4 }}
                key={item._id}
                className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">{item.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-xl font-black text-orange-500 mt-3">{item.price} <span className="text-xs">ETB</span></p>
                </div>

                <button
                  disabled={!item.inStock || addingId === item._id}
                  onClick={() => handleAddToCart(item)}
                  className="relative overflow-hidden h-12 w-28 bg-slate-900 dark:bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 disabled:bg-gray-200"
                >
                  {addingId === item._id ? <Loader2 className="animate-spin" size={20} /> : "ADD"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Single Restaurant Constraint Modal */}
      <AnimatePresence>
        {showConflictModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-4xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Replace Cart?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Your cart contains items from another restaurant. Start a new order with <b>{restaurant?.name}</b> instead?
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleAddToCart(restaurant.menu[0], true)} // Simplified for example
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 dark:shadow-none hover:bg-orange-600 transition"
                >
                  Yes, Replace Items
                </button>
                <button 
                  onClick={() => setShowConflictModal(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-slate-900 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}