"use client";

import Head from "next/head";

function Icon({
  name,
  className = "",
}: {
  name?: string;
  className?: string;
}) {
  if (!name) return null;
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}

export default function RestaurantProfilePage() {
  return (
    <>
      <Head>
        <title>Restaurant Profile</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </Head>

      {/* PAGE CONTENT ONLY – Sidebar comes from layout */}
      <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black">Restaurant Profile</h1>
          <p className="text-muted-foreground">
            Manage your restaurant information and branding
          </p>
        </div>

        {/* COVER & AVATAR */}
        <section className="bg-card border rounded-xl overflow-hidden">
          <div className="h-56 bg-muted relative">
            <button className="absolute bottom-4 right-4 bg-background border px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Icon name="add_a_photo" /> Change Cover
            </button>
          </div>

          <div className="p-6 -mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-muted border-4 border-background" />
                <button className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full">
                  <Icon name="edit" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-bold">Spicy Bites</h3>
                <p className="text-sm text-muted-foreground">
                  Mexican Cuisine
                </p>
              </div>
            </div>

            <span className="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-semibold">
              Open for Orders
            </span>
          </div>
        </section>

        {/* FORMS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Basic Information" icon="restaurant">
            <Input label="Restaurant Name" defaultValue="Spicy Bites" />
            <Input label="Tagline" defaultValue="Best Tacos on Campus" />
            <Textarea label="Description" />
          </Card>

          <Card title="Location & Contact" icon="location_on">
            <Input
              label="Address"
              defaultValue="Building B, Student Center"
            />
            <Input
              label="Phone"
              defaultValue="+1 (555) 123-4567"
            />
            <Input
              label="Email"
              defaultValue="contact@spicybites.edu"
            />
          </Card>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 border rounded-lg">
            Discard Changes
          </button>
          <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2">
            <Icon name="save" /> Save Profile
          </button>
        </div>
      </div>
    </>
  );
}

/* ----------------- COMPONENTS ----------------- */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Icon name={icon} />
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Input({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <input
        defaultValue={defaultValue}
        className="border rounded-lg px-3 py-2 text-sm bg-background"
      />
    </div>
  );
}

function Textarea({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <textarea
        rows={4}
        className="border rounded-lg px-3 py-2 text-sm bg-background"
      />
    </div>
  );
}
