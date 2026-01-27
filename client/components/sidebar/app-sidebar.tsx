"use client";

import { NavFooter } from "@/components/sidebar/nav-footer";
import { NavHeader } from "@/components/sidebar/nav-header";
import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  IconAd2,
  IconBellRinging,
  IconCalendar,
  IconCalendarStats,
  IconListDetails,
  IconNews,
  IconNotebook,
  IconProgressCheck,
  IconSettingsCode,
} from "@tabler/icons-react";
import { Car, ChartNoAxesColumnIncreasing, HandHelping, HandPlatter, LayoutDashboard, Package, ShoppingBag, Users2Icon } from "lucide-react";
import type { SidebarData } from "./types";
import Image from "next/image";

const data: SidebarData = {
  user: {
    name: "ephraim",
    email: "ephraim@blocks.so",
    avatar: "/avatar-01.png",
  },
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      id: "users",
      title: "Users",
      url: "/admin/users",
      icon: Users2Icon,
      isActive: true,
    },
    {
      id: "orders",
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      id: "restaurants",
      title: "Restaurants",
      url: "/admin/restaurants",
      icon: HandPlatter,
    },
    {
      id: "drivers",
      title: "Drivers",
      url: "/admin/drivers",
      icon: Car,
    },
    {
      id: "applications",
      title: "Applications",
      url: "/admin/applications",
      icon: HandHelping,
    },
    // {
    //   id: "reports",
    //   title: "Report",
    //   url: "/admin/reports",
    //   icon: ChartNoAxesColumnIncreasing,
    // },
  ],
  navCollapsible: {
    favorites: [
      // {
      //   id: "design",
      //   title: "Design",
      //   href: "#",
      //   color: "bg-green-400 dark:bg-green-300",
      // },
      // {
      //   id: "development",
      //   title: "Development",
      //   href: "#",
      //   color: "bg-blue-400 dark:bg-blue-300",
      // },
      // {
      //   id: "workshop",
      //   title: "Workshop",
      //   href: "#",
      //   color: "bg-orange-400 dark:bg-orange-300",
      // },
      // {
      //   id: "personal",
      //   title: "Personal",
      //   href: "#",
      //   color: "bg-red-400 dark:bg-red-300",
      // },
    ],
    teams: [
      // {
      //   id: "engineering",
      //   title: "Engineering",
      //   icon: IconSettingsCode,
      // },
      // {
      //   id: "marketing",
      //   title: "Marketing",
      //   icon: IconAd2,
      // },
    ],
    topics: [
      // {
      //   id: "product-updates",
      //   title: "Product Updates",
      //   icon: Package,
      // },
      // {
      //   id: "company-news",
      //   title: "Company News",
      //   icon: IconNews,
      // },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                <span>
                  <Image src="/logo-2.png" height={480} width={480} alt="logo" className="size-8 rounded-lg aspect-square mr-1" />
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold text-md">ASTU Food</span>
                    <span className="text-xs">Admin Portal</span>
                  </div>
                </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <NavHeader data={data} />
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavCollapsible
          favorites={data.navCollapsible.favorites}
          teams={data.navCollapsible.teams}
          topics={data.navCollapsible.topics}
        /> */}
      </SidebarContent>
      <NavFooter user={data.user} />
    </Sidebar>
  );
}
