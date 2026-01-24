import FloatingCart from "@/components/restaurant/FloatingCart";
import Header from "@/components/restaurant/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASTU Food Delivery - Customer Portal",
  description:
    "Order meals from campus cafeterias, track deliveries, and enjoy a seamless dining experience at ASTU.",
  keywords: ["ASTU", "Food Delivery", "Campus Cafeteria", "Orders", "Student Meals"],
  authors: [{ name: "ASTU Eats" }],
  openGraph: {
    title: "ASTU Food Delivery - Customer Portal",
    description:
      "Order meals from campus cafeterias, track deliveries, and enjoy a seamless dining experience at ASTU.",
    type: "website",
  },
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-50 dark:from-orange-900/20 dark:to-transparent" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-linear-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-40 dark:from-blue-900/20 dark:to-transparent" />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-linear-to-br from-green-100 to-transparent rounded-full blur-3xl opacity-30 dark:from-green-900/20 dark:to-transparent" />
      </div>

      <div className="relative min-h-screen">
        <Header />
        <FloatingCart />
        <main className="relative z-10">{children}</main>
      </div>
    </div>
  );
}
