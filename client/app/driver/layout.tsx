"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered, Wallet, User, MapPin } from "lucide-react";
import DriverLocationTracker from "@/components/drivers/DriverLocationTracker";
import {useUserStore} from "@/hooks/use-profile";
export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const driverId = user?._id || "DRIVER_ID";
  console.log("Driver Layout Rendered with driverId:", driverId);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/driver/dashboard" },
    { icon: ListOrdered, label: "Orders", href: "/driver/orders" },
    { icon: Wallet, label: "Earnings", href: "/driver/earnings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20">
      {/* Background Location Tracker */}
      <DriverLocationTracker driverId={driverId} />

      <main>{children}</main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe z-50">
        <div className="flex justify-around items-center p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? "text-orange-600 bg-orange-50 dark:bg-slate-800" : "text-slate-400"
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}