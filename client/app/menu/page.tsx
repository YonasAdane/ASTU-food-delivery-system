// app/menu/page.tsx
import { getRestaurantData } from "@/actions/menu-actions";
import { AddItemDialog } from "@/components/menu/add-item-dialog";
import { MenuCard } from "@/components/menu/menu-card";
import { MenuControls } from "@/components/menu/menu-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const filters = await searchParams;

  return (
    <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant offerings.</p>
        </div>
        <AddItemDialog />
      </div>

      <MenuControls />

      <Suspense fallback={<MenuGridSkeleton />}>
        <MenuContent filters={filters} />
      </Suspense>
    </main>
  );
}

async function MenuContent({ filters }: { filters: { search?: string; category?: string } }) {
  const data = await getRestaurantData();
  
  if (!data ) return <div>
    Failed to load menu.
    <div>{JSON.stringify(data)}</div>
    </div>;

  // Filter the nested array based on search and category
  let items = data?.filter((item: any) => {
    const matchesSearch = filters.search 
      ? item.name.toLowerCase().includes(filters.search.toLowerCase()) 
      : true;
    const matchesCategory = !filters.category || filters.category === "All" 
      ? true 
      : item?.description?.includes(filters.category); // Using description as proxy since category isn't in your API snippet
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item: any) => (
        <MenuCard key={item._id} item={item} />
      ))}
    </div>
  );
}

function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
      ))}
    </div>
  );
}