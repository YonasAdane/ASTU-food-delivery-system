"use client";

import Link from "next/link";
import { Utensils, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "../common/modeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              ASTU<span className="text-orange-500">Eats</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
          <ModeToggle/>
            <Link
              href="#features"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#vendors"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Vendors
            </Link>
            <Link
              href="/login"
              className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 transition-all"
            >
              Vendor Login
            </Link>
            <Link
              href="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md font-medium transition-all shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-900 dark:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="#features"
              onClick={() => setOpen(false)}
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              How it Works
            </Link>

            <Link
              href="#vendors"
              onClick={() => setOpen(false)}
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Vendors
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-center text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700"
            >
              Vendor Login
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block text-center bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
