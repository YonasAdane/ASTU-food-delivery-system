import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/common/modeToggle"

export function Header() {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/customer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#f48c25] rounded-lg flex items-center justify-center">
          </div>
          <span className="font-semibold text-lg text-foreground">ASTU Food</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/customer" className="text-foreground hover:text-[#22c55e] transition-colors">
            Home
          </Link>
          <Link href="/customer/restaurant" className="text-foreground hover:text-[#22c55e] transition-colors">
            Browse
          </Link>
          <Link href="#" className="text-foreground hover:text-[#22c55e] transition-colors">
            Support
          </Link>
          <ModeToggle />
          <Link href="/customer/profile">
            <Avatar className="w-10 h-10 border-2 border-[#f48c25] cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-muted text-[#f48c25]">JD</AvatarFallback>
            </Avatar>
          </Link>
        </nav>
      </div>
    </header>
  )
}
