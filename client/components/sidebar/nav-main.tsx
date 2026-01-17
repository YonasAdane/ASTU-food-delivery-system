"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "./types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavMain({ items }: { items: NavItem[] }) {
    const pathname=usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.id}>
                <Link href={item.url as string}>
                  <SidebarMenuButton size={"lg"} className={cn(item.url === pathname ? "bg-primary" : "")} tooltip={item.title}>
                      {Icon && <Icon className="mr-2 h-6 w-6" />}
                      <span className={cn(item.url === pathname ? "text-white" : "")}>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
