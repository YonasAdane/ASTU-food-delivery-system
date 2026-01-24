"use client";

import { useRestaurantOrders } from "@/hooks/use-restaurant-orders";
import type { RestaurantOrder, OrderStatus } from "@/types/restaurant-orders.types";

/* ================= PAGE ================= */
export default function RestaurantOrdersPage() {
  const {
    loading,
    filter,
    setFilter,
    stats,
    displayedOrders,
  } = useRestaurantOrders();

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Orders Management</h1>
          <p className="text-muted-foreground">
            Monitor and process customer orders
          </p>
        </div>

        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Restaurant Open
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        <Stat title="Total" value={stats.total} />
        <Stat title="Pending" value={stats.pending} />
        <Stat title="Preparing" value={stats.preparing} />
        <Stat title="Ready" value={stats.ready} />
        <Stat title="Delivering" value={stats.delivering} />
        <Stat title="Delivered" value={stats.delivered} />
        <Stat title="Cancelled" value={stats.cancelled} />
      </div>

      {/* FILTER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>

        <div className="flex gap-2 text-sm font-semibold">
          {["all", "pending", "preparing", "ready"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-1.5 rounded-full border transition ${
                filter === s
                  ? "bg-black text-white"
                  : "bg-muted hover:bg-accent"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedOrders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-card border rounded-xl p-5">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function OrderCard({ order }: { order: RestaurantOrder }) {
  const email = order.customerId.email;
  const avatarLetter = email.charAt(0).toUpperCase();

  return (
    <div className="bg-card border rounded-xl p-5 flex flex-col">
      <div className="flex justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            {avatarLetter}
          </div>

          <div>
            <p className="text-xs font-bold">
              ORDER #{order._id.slice(-4)}
            </p>
            <p className="text-xs text-muted-foreground">{email}</p>
            <p className="text-xs text-muted-foreground">
              {order.customerId.phone}
            </p>
          </div>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span className="text-muted-foreground">
              {item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold mt-auto pt-3 border-t">
        <span>Total</span>
        <span>{order.total}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const label =
    status === "picked" || status === "en_route"
      ? "DELIVERING"
      : status.toUpperCase();

  const map: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    preparing: "bg-blue-100 text-blue-700",
    ready: "bg-green-100 text-green-700",
    delivering: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full ${
        map[label.toLowerCase()]
      }`}
    >
      {label}
    </span>
  );
}
