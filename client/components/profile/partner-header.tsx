import { Bell } from "lucide-react"
import Image from "next/image"
import { ModeToggle } from "@/components/common/modeToggle"

export function PartnerHeader() {
  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Home</span>
            <span className="text-muted-foreground/60">›</span>
            <span className="text-amber-600 dark:text-amber-500">Profile</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ModeToggle />
          <button className="relative">
            <Bell className="w-6 h-6 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              2
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-foreground">John Doe</p>
              <p className="text-sm text-muted-foreground">Owner</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src="/images/photo-2026-01-19-04-53-42.jpg"
                alt="User avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
