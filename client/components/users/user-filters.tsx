"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export function UserFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions({ shallow: false, throttleMs: 500 }));
  const [role, setRole] = useQueryState("role", parseAsString.withDefault("all").withOptions({ shallow: false }));
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center p-6 border-b">
      <div className="flex bg-muted p-1 rounded-lg">
        {["all", "customer", "driver", "restaurant"].map((r) => (
          <button
            key={r}
            onClick={() => { setRole(r); setPage(1); }}
            className={`px-4 py-2 rounded text-sm font-medium capitalize ${
              role === r ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
            }`}
          >
            {r}s
          </button>
        ))}
      </div>

      <div className="relative w-full lg:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
    </div>
  );
}