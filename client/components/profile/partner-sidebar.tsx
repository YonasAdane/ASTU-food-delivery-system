"use client"

import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Store, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: UtensilsCrossed, label: "Menu Management", active: false },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Store, label: "Restaurant Profile", active: true },
  { icon: Settings, label: "Settings", active: false },
]

export function PartnerSidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col min-h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center">
            <span className="text-amber-600 dark:text-amber-500 font-semibold text-sm">AF</span>
          </div>
          <div>
            <h2 className="font-bold text-card-foreground">ASTU Food</h2>
            <p className="text-xs text-muted-foreground">Partner Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  item.active
                    ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className={cn("w-5 h-5", item.active ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <LogOut className="w-5 h-5 text-muted-foreground" />
          Logout
        </button>
      </div>
    </aside>
  )
}
