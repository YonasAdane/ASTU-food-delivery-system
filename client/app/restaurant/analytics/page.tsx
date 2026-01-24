"use client";

import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useRestaurantAnalytics } from "@/hooks/use-restaurant-analytics";

/* ================= PAGE ================= */
export default function AnalyticsPage() {
  const { theme, setTheme } = useTheme();

  const {
    restaurant,
    stats,
    statusData,
    daily,
    loading,
    error,
  } = useRestaurantAnalytics();

  if (loading) return <div className="p-6">Loading analytics…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!restaurant || !stats) return null;

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {restaurant.name} Analytics
          </h1>
          <p className="text-muted-foreground">
            Area: {restaurant.area} · Delivery Time:{" "}
            {restaurant.deliveryTime} mins
          </p>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border rounded-lg px-4 py-2 text-sm font-medium"
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Total Orders" value={stats.totalOrders} />
        <KPI title="Total Revenue" value={`${stats.totalRevenue} ETB`} />
        <KPI
          title="Avg Orders / Day"
          value={(stats.totalOrders / 7).toFixed(1)}
        />
        <KPI title="Status" value="Active" />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 h-[320px]">
          <h3 className="font-semibold mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-xl p-6 h-[320px]">
          <h3 className="font-semibold mb-4">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

/* ================= KPI ================= */
function KPI({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-card border rounded-xl p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{String(value)}</p>
    </div>
  );
}
