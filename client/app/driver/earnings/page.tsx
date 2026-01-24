"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import {useUserStore} from "@/hooks/use-profile";
export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const user = useUserStore((state) => state.user);
  const driverId = user?._id || "DRIVER_ID";

  useEffect(() => {
    axios.get(`http://localhost:5000/drivers/${driverId}/earnings`, { withCredentials: true })
      .then(res => setData(res.data.data));
  }, []);

  if (!data) return <div className="p-6">Loading stats...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black mb-8">Earnings</h1>

      {/* TOTAL BALANCE CARD */}
      <div className="bg-slate-900 text-white p-6 rounded-[30px] shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
        <p className="text-slate-400 font-bold mb-1">Total Balance</p>
        <div className="text-4xl font-black mb-4">{data.totalEarnings} ETB</div>
        <div className="flex gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full">
           <TrendingUp size={16} /> +12% this month
        </div>
      </div>

      <h3 className="font-bold text-lg mb-4">Breakdown</h3>
      <div className="grid gap-4">
        {/* TODAY */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><DollarSign size={20}/></div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Today</p>
                <p className="font-bold text-lg">{data.todaysOrderCount} Orders</p>
              </div>
           </div>
           <span className="font-black text-xl">{data.todayEarnings}</span>
        </div>

        {/* WEEKLY */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Calendar size={20}/></div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase">This Week</p>
                <p className="font-bold text-lg">Weekly Total</p>
              </div>
           </div>
           <span className="font-black text-xl">{data.weeklyEarning}</span>
        </div>
      </div>
    </div>
  );
}