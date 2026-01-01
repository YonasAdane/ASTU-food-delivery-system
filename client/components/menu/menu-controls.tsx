// @/components/menu/menu-controls.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

const CATEGORIES = [
  "All",
  "Appetizers",
  "Main Course",
  "Beverages",
  "Desserts",
];

export function MenuControls() {
  const [search, setSearch] = useQueryState("search", {
    shallow: false,
    throttleMs: 300,
  });
  const [activeCat, setActiveCat] = useQueryState("category", {
    defaultValue: "All",
    shallow: false,
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search dishes..."
          className="pl-10 h-12 rounded-xl"
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCat === cat ? "default" : "outline"}
            className="rounded-full px-6"
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
