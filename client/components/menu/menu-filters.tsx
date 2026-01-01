// @/components/menu/menu-filters.tsx
"use client";

import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = ["All", "Appetizers", "Main Course", "Beverages", "Desserts", "Vegan"];

export function MenuFilters() {
  const [search, setSearch] = useQueryState("search", { shallow: false, throttleMs: 500 });
  const [category, setCategory] = useQueryState("category", { defaultValue: "All", shallow: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search dishes..." 
            className="pl-10"
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}