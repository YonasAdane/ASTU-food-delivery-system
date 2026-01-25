"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered, Wallet, LogOut, CarTaxiFront,UserCircle2} from "lucide-react";
import LogoutAlert from "../common/logoutAlert";

export default function DriverNavBar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/driver/dashboard" },
    { icon: ListOrdered, label: "Orders", href: "/driver/orders" },
    { icon: Wallet, label: "Earnings", href: "/driver/earnings" },
    { icon: UserCircle2, label: "Profile", href: "/driver/profile" },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe z-50">
        <div className="flex justify-around items-center p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive
                    ? "text-orange-600 bg-orange-50 dark:bg-slate-800"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-col z-50">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
            <CarTaxiFront size={20} />
          </div>
          <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
            Driver App
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${
                  isActive
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions (Logout, etc) */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <LogoutAlert />
        </div>
      </div>
    </>
  );
}