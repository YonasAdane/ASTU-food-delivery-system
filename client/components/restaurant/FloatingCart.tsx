"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FloatingCart() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  // --- API CALL PLACEHOLDER ---
  /*
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('/api/customer/cart');
        const data = await response.json();
        // Assuming data returns an array of items or a totalQuantity field
        setCartCount(data.totalQuantity || data.items.length);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };
    fetchCartData();
  }, []); 
  */
  // -----------------------------

  // Temporary mock for visualization (Remove this when you add your API)
  useEffect(() => {
    setCartCount(1); 
  }, []);

  if (cartCount === 0) return null;

  return (
    <button
      onClick={() => router.push("/customer/cart")}
      className="fixed top-17 right-6 z-40 group flex items-center gap-3 bg-transparent border p-2 pr-4 border-transparent rounded-full shadow-xl hover:shadow-orange-200/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1 active:scale-95"
    >
      <div className="relative bg-orange-500 p-2.5 rounded-full text-white shadow-lg group-hover:bg-orange-600 transition-colors">
        <ShoppingCart size={20} />
        {/* Item Count Badge */}
        <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
          {cartCount}
        </span>
      </div>
      
      {/* <div className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Cart</span>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
          {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
        </span>
      </div> */}
    </button>
  );
}