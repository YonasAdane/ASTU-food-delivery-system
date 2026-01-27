"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter, DeleteIcon, Trash2, XCircle } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";

export function UserFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions({ shallow: false, throttleMs: 500 }));
  const [role, setRole] = useQueryState("role", parseAsString.withDefault("all").withOptions({ shallow: false }));
  const [isVerified, setIsVerified] = useQueryState("isVerified", parseAsString.withDefault("all").withOptions({ shallow: false }));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all").withOptions({ shallow: false }));
  const [deleted, setDeleted] = useQueryState("deleted", parseAsString.withDefault("false").withOptions({ shallow: false }));
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const clearFilters = () => {
    setRole("all");
    setIsVerified("all");
    setStatus("all");
    setDeleted("false");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="flex justify-between p-6 border-b">

      <div className="flex flex-wrap gap-4  items-center">
        
         {/* Quick Role Filter Buttons */}
        <div>
          {/* <label className="block text-sm font-medium mb-1">Quick Filter</label> */}
          <div className="bg-muted border-input text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]">
            {["all", "customer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setPage(1); }}
                className={`capitalize data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${
                  role === r ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

        </div>
         {(role !== "all" || isVerified !== "all" || status !== "all" || deleted !== "false") && (
            <Button variant={"outline"}
              onClick={clearFilters}
              className="shrink-0 gap-2 border-dashed"
            >
              <XCircle className="h-4 w-4" />
            Clear
            </Button>
           
          )}
      </div>

      <div className="flex flex-wrap gap-4  items-center">
         
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search users (email, phone)..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {/* Verification Status Filter */}
        <div>
          {/* <label className="block text-sm font-medium mb-1">Verification</label> */}
          <Select value={isVerified} onValueChange={(value) => { setIsVerified(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Driver Status Filter */}
        <div>
          {/* <label className="block text-sm font-medium mb-1">Driver Status</label> */}
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Driver Available</SelectItem>
              <SelectItem value="unavailable">Driver Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Account Status Filter */}
        <div>
          {/* <label className="block text-sm font-medium mb-1"></label> */}
          <Select value={deleted} onValueChange={(value) => { setDeleted(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectLabel>Account Status</SelectLabel> */}
              {/* <Select */}
               <SelectItem value="false">Active Only</SelectItem>
              <SelectItem value="true">Deleted Only</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      </div>
    </div>
  );
}