"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Wallet,
  Calendar,
  FolderOpenDot,
} from "lucide-react";
import { ModeToggle } from "../common/modeToggle";
import { useUserStore } from "@/hooks/use-profile";
import ProfileDropdown from "../users/profileDropdown";
import clsx from "clsx";
const generateAvatar = (name?: string, email?: string) => {
  const displayName = name || email || "User";

  const background = "6366f1";
  const color = "fff";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName,
  )}&background=${background}&color=${color}`;
};
export default function Header() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isHomeActive =
    pathname === "/" || pathname.startsWith("/customer/restaurant");

  const navLinks = [
    {
      label: "Home",
      href: "/customer/restaurant",
      icon: Home,
      active: isHomeActive,
    },
    {
      label: "Orders",
      href: "/customer/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/customer/orders"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-4 md:px-10 py-3 shadow-sm">
      <div className="max-w-360 mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Logo Circle */}
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-orange-600 font-bold text-lg">AF</span>
          </div>

          {/* Logo Text */}
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            ASTU Food
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden ml-auto lg:flex gap-6">
          {navLinks.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              className={clsx(
                "flex items-center gap-2 text-sm transition-colors",
                active
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <Icon size={18} className="text-primary" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          <ProfileDropdown
            avatar={generateAvatar(user?.email)}
            email={user?.email}
            phone={user?.phone}
            role={user?.role}
            createdAt={user?.createdAt}
          />

          {/* Mobile Menu Button */}
          <button onClick={() => setOpen(!open)} className="lg:hidden">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden mt-4 px-4 pb-6 space-y-4">
          {/* Mobile Search */}
          <input
            placeholder="Search for restaurants..."
            className="w-full h-11 rounded-full px-4 bg-gray-100 dark:bg-gray-800 outline-none"
          />

          {/* Mobile Nav */}
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ label, href, icon: Icon, active }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 text-sm py-2",
                  active ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                <Icon size={18} className="text-primary" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
