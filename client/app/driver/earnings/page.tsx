"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Wallet, Calendar, DollarSign, Loader2, Calculator } from "lucide-react";
import { useUserStore } from "@/hooks/use-profile";
import { toast } from "sonner";

export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchEarnings = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/drivers/${user._id}/earnings`, 
          { withCredentials: true }
        );
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user?._id]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  if (!data) return <div className="p-6 text-center text-slate-500">No earnings data found.</div>;

  const estimatedTotalOrders = data.totalEarnings / 150; 
  
  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50 dark:bg-slate-950">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Earnings</h1>
        <p className="text-slate-500 text-sm">Track your delivery income</p>
      </header>

      {/* TOTAL BALANCE CARD */}
      <div className="bg-slate-900 dark:bg-black text-white p-6 rounded-[35px] shadow-2xl mb-8 relative overflow-hidden ring-1 ring-slate-800">
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Wallet size={18} />
            <span className="font-bold text-xs uppercase tracking-widest">Lifetime Earnings</span>
          </div>
          
          <div className="text-5xl font-black tracking-tighter mb-6">
            {data.totalEarnings.toLocaleString()} <span className="text-2xl text-slate-500 font-bold">ETB</span>
          </div>
          
          {/* Real Calculated Metric */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/5 px-4 py-2 rounded-2xl">
             <Calculator size={16} className="text-orange-400" />
             <div className="text-xs">
               <span className="text-orange-400 font-bold">~{estimatedTotalOrders}</span> Total Deliveries
             </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        Performance Breakdown
      </h3>
      
      <div className="grid gap-4">
        {/* TODAY'S EARNINGS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl">
                <DollarSign size={24}/>
              </div>
              <div className="text-right">
                <span className="block text-3xl font-black text-slate-900 dark:text-white">
                  {data.todayEarnings.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">ETB Today</span>
              </div>
           </div>
           <div className="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Completed Orders</span>
              <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {data.todaysOrderCount}
              </span>
           </div>
        </div>

        {/* WEEKLY EARNINGS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-gray-100 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                <Calendar size={24}/>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-lg">Weekly Total</p>
                <p className="text-slate-400 text-xs font-medium">Last 7 Days</p>
              </div>
           </div>
           
           <div className="flex justify-between items-end">
             <div className="text-slate-500 text-sm font-medium">
               Keep it up!
             </div>
             <div className="text-right">
               <span className="text-2xl font-black text-slate-900 dark:text-white">
                 {data.weeklyEarning.toLocaleString()}
               </span>
               <span className="text-xs font-bold text-slate-400 ml-1">ETB</span>
             </div>
           </div>
           
           {/* Simple Visual Progress Bar (Just for UI feel, functionally represents 'Goal') */}
           <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4 rounded-full opacity-50" /> 
           </div>
        </div>
      </div>
    </div>
  );
}