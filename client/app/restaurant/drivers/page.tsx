"use client";

import { useState } from "react";
import { useAssignDrivers } from "@/hooks/use-assign-drivers";

/* ================= ICON ================= */
function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}

/* ================= PAGE ================= */
export default function AssignDriversPage() {
  const restaurantId = "68d23a7a4a2aa80cf134eb2f"; // later from /me

  const {
    loading,
    activeOrders,
    drivers,
    activeOrderId,
    inviteOpen,

    setActiveOrderId,
    setInviteOpen,
    assignDriver,
    invite,
  } = useAssignDrivers(restaurantId);

  if (loading) return <div className="p-6">Loading drivers…</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assign Drivers</h1>
          <p className="text-muted-foreground">
            Assign or change drivers for active orders
          </p>
        </div>

        <button
          onClick={() => setInviteOpen(true)}
          className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-6 font-semibold text-white hover:bg-orange-600"
        >
          <Icon name="add" />
          Invite Driver
        </button>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeOrders.map(order => (
          <div
            key={order._id}
            className="rounded-xl border bg-card p-5 space-y-4"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.status.toUpperCase()}
                </p>
              </div>
              <p className="font-bold">{order.total} ETB</p>
            </div>

            {order.driverId && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium">Driver</p>
                <p className="text-muted-foreground">
                  {typeof order.driverId === "string"
                    ? order.driverId
                    : order.driverId.phone}
                </p>
              </div>
            )}

            <button
              onClick={() => setActiveOrderId(order._id)}
              className="h-10 w-full rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
            >
              {order.driverId ? "Change Driver" : "Assign Driver"}
            </button>
          </div>
        ))}
      </div>

      {/* ================= ASSIGN MODAL ================= */}
      {activeOrderId && (
        <Modal
          title="Select Driver"
          onClose={() => setActiveOrderId(null)}
        >
          {drivers.map(d => (
            <button
              key={d._id}
              onClick={() => assignDriver(activeOrderId, d._id)}
              className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-muted"
            >
              <div>
                <p className="font-medium">{d.phone}</p>
                {d.email && (
                  <p className="text-xs text-muted-foreground">
                    {d.email}
                  </p>
                )}
              </div>
              <Icon name="chevron_right" />
            </button>
          ))}
        </Modal>
      )}

      {/* ================= INVITE MODAL ================= */}
      {inviteOpen && (
        <InviteDriverModal
          onClose={() => setInviteOpen(false)}
          onInvite={invite}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-card p-6 space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}

/* ================= INVITE DRIVER ================= */
function InviteDriverModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");

  return (
    <Modal title="Invite Driver" onClose={onClose}>
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Driver phone number"
        className="h-11 w-full rounded-lg border px-3"
      />
      <button
        onClick={() => onInvite(phone)}
        className="h-11 w-full rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
      >
        Invite Driver
      </button>
    </Modal>
  );
}
