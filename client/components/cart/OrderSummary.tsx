import { CreditCard, Banknote, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  isPlacingOrder: boolean;
  onPaymentChange: (method: string) => void;
  onPlaceOrder: () => void;
}

export function OrderSummary({ 
  subtotal, deliveryFee, paymentMethod, isPlacingOrder, onPaymentChange, onPlaceOrder 
}: OrderSummaryProps) {
  
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl sticky top-8 border border-gray-100 dark:border-slate-800">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <CreditCard size={18} className="text-orange-500" />
        Payment Method
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button 
          onClick={() => onPaymentChange('cash')}
          className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
            paymentMethod === 'cash' 
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
              : 'border-transparent bg-gray-50 dark:bg-slate-800 text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          <Banknote size={24} />
          <span className="text-xs font-bold">Cash</span>
          {paymentMethod === 'cash' && <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />}
        </button>

        <button 
          onClick={() => onPaymentChange('telebirr')}
          className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
            paymentMethod === 'telebirr' 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
              : 'border-transparent bg-gray-50 dark:bg-slate-800 text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          <CreditCard size={24} />
          <span className="text-xs font-bold">Telebirr</span>
          {paymentMethod === 'telebirr' && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />}
        </button>
      </div>

      <div className="space-y-3 py-6 border-t border-dashed border-gray-200 dark:border-slate-700">
        <div className="flex justify-between text-slate-500 text-sm font-medium">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} ETB</span>
        </div>
        <div className="flex justify-between text-slate-500 text-sm font-medium">
          <span>Delivery Fee</span>
          <span>{deliveryFee.toFixed(2)} ETB</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800 mb-6">
        <span className="text-lg font-bold text-slate-800 dark:text-white">Total</span>
        <span className="text-2xl font-black text-orange-600">{total.toFixed(2)} <span className="text-sm font-bold text-orange-400">ETB</span></span>
      </div>
      
      <button 
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
        className="w-full bg-slate-900 dark:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-orange-500 shadow-xl shadow-slate-200 dark:shadow-orange-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPlacingOrder ? <Loader2 className="animate-spin" /> : "Confirm Order"}
      </button>
    </div>
  );
}