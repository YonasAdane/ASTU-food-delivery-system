import Link from "next/link";
import { ArrowLeft, Store, Trash2 } from "lucide-react";

interface CartHeaderProps {
  restaurantName: string;
  isClearing: boolean;
  onClear: () => void;
}

export function CartHeader({ restaurantName, isClearing, onClear }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <Link href="/customer/restaurant" className="flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-2 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Menu
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Checkout</h1>
        <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
          <Store size={14} />
          <span className="font-medium">Ordering from <span className="text-orange-600 dark:text-orange-400">{restaurantName}</span></span>
        </div>
      </div>
      
      <button 
        disabled={isClearing}
        onClick={onClear}
        className="group flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
        Clear Cart
      </button>
    </div>
  );
}