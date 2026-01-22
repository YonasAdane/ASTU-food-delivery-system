"use client"

import { User, ClipboardList, Wallet, Heart, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: User, label: "Profile", active: true },
  { icon: ClipboardList, label: "Orders", active: false },
  { icon: Wallet, label: "Wallet", active: false },
  { icon: Heart, label: "Favorites", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function ProfileSidebar() {
  return (
    <div className="w-64 bg-background rounded-xl p-6 h-fit border border-border">
  
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="w-12 h-12 bg-muted">
          <AvatarImage src="/avatar.png" alt="John Doe" />
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">John Doe</p>
          <p className="text-sm text-[#f48c25] font-medium">ASTU STUDENT</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
              item.active
                ? "bg-slate-800 text-slate-300"
                : "text-muted-foreground hover:bg-slate-800"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors mt-6">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log Out</span>
      </button>
    </div>
  )
}
