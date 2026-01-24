"use client";

import Head from "next/head";
import { useDashboard } from "@/hooks/use-dashboard";

/* ================= CONSTANTS ================= */
const quickActions = [
  "Add Menu Item",
  "Pause Orders",
  "Create Promo",
  "Help Center",
];

const ALLOWED_UPDATE_STATUSES = [
  "accepted",
  "preparing",
  "ready",
  "cancelled",
] as const;

function Icon({ name }: { name: string }) {
  return <span className="material-symbols-outlined">{name}</span>;
}

/* ================= PAGE ================= */
export default function DashboardPage() {
  const {
    loading,
    updating,
    page,
    totalPages,
    selectedOrder,

    paginatedOrders,
    activeOrders,
    deliveringOrders,
    completedOrders,
    dailyRevenue,

    setPage,
    setSelectedOrder,
    updateOrderStatus,
  } = useDashboard();

  if (loading) return <div className="p-10">Loading dashboard...</div>;

  return (
    <>
      <Head>
        <title>Restaurant Owner – Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </Head>

      <main className="p-10 max-w-7xl mx-auto text-foreground">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Welcome back, Owner</h1>
          <p className="text-muted-foreground">
            Here’s what’s happening at your restaurant today.
          </p>
        </div>

        {/* KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPI title="Active Orders" value={activeOrders.length} icon="receipt_long" />
          <KPI title="Daily Sales" value={`$${dailyRevenue.toFixed(2)}`} icon="attach_money" />
          <KPI title="Pending Delivery" value={deliveringOrders} icon="local_shipping" />
          <KPI title="Completed Orders" value={completedOrders} icon="task_alt" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LIVE ORDERS */}
          <section className="lg:col-span-2 rounded-xl border bg-card">
            <div className="p-6 border-b font-bold">Live Orders</div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map(order => (
                  <tr key={order._id} className="border-t">
                    <td className="p-4">#{order._id.slice(-4)}</td>
                    <td className="p-4">
                      {order.items
                        .map(i => `${i.quantity}x ${i.name}`)
                        .join(", ")}
                    </td>
                    <td className="p-4">{order.status}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-orange-500 text-white px-3 py-1 rounded"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-between p-4 border-t text-sm">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <span>
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6">
            <div className="rounded-xl p-6 bg-card border">
              <h2 className="font-bold mb-2">Weekly Revenue</h2>
              <p className="text-2xl font-extrabold">${dailyRevenue * 7}</p>
            </div>

            <div className="rounded-xl p-6 bg-orange-500 text-white">
              <h2 className="font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(a => (
                  <button key={a} className="bg-white/20 p-3 rounded">
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-full max-w-md">
            <h2 className="font-bold mb-4">Update Order Status</h2>

            <div className="grid grid-cols-2 gap-3">
              {ALLOWED_UPDATE_STATUSES.map(s => (
                <button
                  key={s}
                  disabled={updating}
                  onClick={() => updateOrderStatus(s)}
                  className="border py-2 rounded hover:bg-orange-500 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 text-sm text-muted-foreground w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= KPI ================= */
function KPI({ title, value, icon }: any) {
  return (
    <div className="rounded-xl border p-6 bg-card">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon name={icon} />
      </div>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}
