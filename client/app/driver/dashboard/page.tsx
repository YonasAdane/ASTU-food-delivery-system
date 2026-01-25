"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Power, CheckCircle, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/hooks/use-profile";
import ProfileDropdown from "@/components/users/profileDropdown";
import { ModeToggle } from "@/components/common/modeToggle";

const generateAvatar = (name?: string, email?: string) => {
  const displayName = name || email || "User";
  const background = "6366f1";
  const color = "fff";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName,
  )}&background=${background}&color=${color}`;
};

export default function DriverDashboard() {
  const [status, setStatus] = useState("unavailable");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Get user from store
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // 2. STOP if user isn't loaded yet or doesn't have an ID
    if (!user || !user._id) {
        return; 
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/drivers/${user._id}/earnings`,
          { withCredentials: true },
        );
        setStats(res.data.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    
    // 3. IMPORTANT: Add user._id to dependency array
    // This ensures the code runs again once the store loads the real user
  }, [user?._id]); 

  // --- Handlers ---

  const toggleStatus = async () => {
    // Safety check for button click too
    if (!user?._id) return toast.error("User not fully loaded yet");

    const newStatus = status === "available" ? "unavailable" : "available";
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/drivers/status`,
        { status: newStatus },
        { withCredentials: true },
      );
      setStatus(newStatus);
      toast.success(`You are now ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Optional: Show skeleton while waiting for user store
  if (!user) {
     return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Hello, {user?.email || "Driver"} 👋
          </h1>
          <p className="text-slate-500 text-sm">Ready to work today?</p>
        </div>
        <div className="ml-auto flex gap-2">
          <ModeToggle />
          <ProfileDropdown
            avatar={generateAvatar(user?.email)}
            email={user?.email}
            phone={user?.phone}
            role={user?.role}
            createdAt={user?.createdAt}
          />
        </div>
      </div>

      {/* STATUS TOGGLE */}
      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`w-full py-6 rounded-3xl shadow-lg border-2 flex items-center justify-center gap-4 transition-all ${
          status === "available"
            ? "bg-green-500 border-green-400 text-white shadow-green-500/30"
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}
      >
        <Power size={32} />
        <span className="text-2xl font-bold uppercase tracking-wider">
          {status === "available" ? "Online" : "Offline"}
        </span>
      </button>

      {/* TODAY'S QUICK STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-orange-100 dark:bg-slate-800 rounded-full w-fit mb-3 text-orange-600">
            <CheckCircle size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase">
            Delivered
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.todaysOrderCount || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-green-100 dark:bg-slate-800 rounded-full w-fit mb-3 text-green-600">
            <Wallet size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase">Earned</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.todayEarnings || 0}
            <span className="text-sm"> ETB</span>
          </p>
        </div>
      </div>
    </div>
  );
}