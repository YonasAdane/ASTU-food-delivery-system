"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/restaurant/dashboard", icon: "dashboard" },
  { label: "Profile", href: "/restaurant/profile", icon: "store" },
  { label: "Menu", href: "/restaurant/menu", icon: "restaurant_menu" },
  { label: "Orders", href: "/restaurant/orders", icon: "receipt_long" },
];

function Icon({ name }: { name: string }) {
  return <span className="material-symbols-outlined">{name}</span>;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between">
      {/* TOP */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            SG
          </div>
          <div>
            <h1 className="font-bold">Spice Garden</h1>
            <p className="text-xs text-gray-500">Restaurant</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    active
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-6 border-t">
        <button className="flex gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl w-full">
          <Icon name="logout" />
          Logout
        </button>
      </div>
    </aside>
  );
}
