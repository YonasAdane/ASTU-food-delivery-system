"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";



export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const { setCount } = useCartStore(); 

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customer/getCart`, { withCredentials: true });
      const cartData = res.data.data;
      setCart(cartData);
      setCount(cartData?.items?.length || 0); 
    } catch (err: any) {
      setCart(null);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAction = async (actionType: 'update' | 'remove' | 'clear', id: string, action: () => Promise<any>) => {
    setUpdatingId(id);
    try {
      await action();
      
      if (actionType === 'clear') {
        // Instant UI response for clearing
        setCart(null);
        setCount(0);
      } else {
        // Re-sync for updates/removals
        await fetchCart(); 
      }
    } catch (error: any) {
      console.log("Cart Action Failed:", error.response?.data || error.message);
      // If the action results in an empty cart (404), sync it
      if (error.response?.status === 404) {
        setCart(null);
        setCount(0);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <CartSkeleton />;

  if (!cart || !cart.items || cart.items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/restaurant" className="flex items-center text-sm text-gray-500 hover:text-orange-500 mb-2 transition">
              <ArrowLeft size={16} className="mr-1" /> Back to Menu
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-wrap">Checkout</h1>
            <p className="text-orange-600 font-medium">{cart.restaurantId?.name || "Restaurant"}</p>
          </div>
          <button 
            disabled={updatingId === 'clear'}
            onClick={() => handleAction('clear', 'clear', () => 
              axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customer/deleteCart/${cart.restaurantId?._id || cart.restaurantId}`, { withCredentials: true })
            )}
            className="text-gray-400 hover:text-red-500 text-sm font-medium transition disabled:opacity-50"
          >
            {updatingId === 'clear' ? "Clearing..." : "Clear All"}
          </button>
        </div>

        {/* Cart Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          {cart.items.map((item: any, idx: number) => (
            <div 
              key={item._id} 
              className={`p-5 flex items-center justify-between ${idx !== cart.items.length - 1 ? 'border-b border-gray-50 dark:border-slate-800' : ''}`}
            >
              <div className="flex-1 mr-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</h3>
                <p className="text-orange-500 font-bold text-sm">{item.price} ETB</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full px-2 py-1">
                  <button
                    disabled={updatingId === item._id || item.quantity <= 1}
                    onClick={() => handleAction('update', item._id, () => 
                      axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customer/updateCart/${item._id}`, { quantity: item.quantity - 1 }, { withCredentials: true })
                    )}
                    className="p-1 hover:text-orange-600 disabled:opacity-30 transition"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="w-8 text-center font-medium text-sm">
                    {updatingId === item._id ? <Loader2 size={14} className="animate-spin mx-auto" /> : item.quantity}
                  </span>

                  <button
                    disabled={updatingId === item._id}
                    onClick={() => handleAction('update', item._id, () => 
                      axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customer/updateCart/${item._id}`, { quantity: item.quantity + 1 }, { withCredentials: true })
                    )}
                    className="p-1 hover:text-orange-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* <button
                  disabled={updatingId === item._id}
                  onClick={() => handleAction('remove', item._id, () => 
                    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customer/removeFromCart/${item._id}`, { withCredentials: true })
                  )}
                  className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-800 dark:text-white">{cart.total} ETB</span>
          </div>
          <div className="flex justify-between mb-6 pt-4 border-t border-gray-50 dark:border-slate-800">
            <span className="text-lg font-bold text-gray-800 dark:text-white">Total</span>
            <span className="text-lg font-bold text-orange-600">{cart.total} ETB</span>
          </div>
          
          <button onClick={()=>console.log()} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition-all active:scale-[0.95]">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-slate-950">
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-full mb-4">
        <ShoppingBag size={48} className="text-orange-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Your cart is empty</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
      <Link href="/customer/restaurant" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-orange-200 dark:shadow-none">
        Browse Restaurants
      </Link>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded mb-4" />
      <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
      <div className="mt-8 h-40 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  );
}