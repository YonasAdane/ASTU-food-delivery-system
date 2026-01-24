import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon, LayoutGridIcon, ListIcon } from "lucide-react";

interface DriverFiltersProps {
  search: string;
  status: string;
  sortBy: string;
  viewMode: 'grid' | 'list';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function DriverFilters({
  search,
  status,
  sortBy,
  viewMode,
  onSearchChange,
  onStatusChange,
  onSortByChange,
  onViewModeChange
}: DriverFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#e6e0db] dark:bg-gray-800 dark:border-gray-700">
      {/* Search */}
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7560] w-4 h-4 dark:text-gray-400" />
        <Input
          className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#f8f7f5] border-none text-[#181411] placeholder:text-[#8a7560] focus:ring-2 focus:ring-primary/50 text-base dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          placeholder="Search by name, ID, or vehicle..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
        <Select value={status || "all"} onValueChange={onStatusChange}>
          <SelectTrigger className="h-11 px-4 rounded-lg bg-[#f8f7f5] border-none text-[#181411] focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px] dark:bg-gray-700 dark:text-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Offline</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy || "rating"} onValueChange={onSortByChange}>
          <SelectTrigger className="h-11 px-4 rounded-lg bg-[#f8f7f5] border-none text-[#181411] focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px] dark:bg-gray-700 dark:text-white">
            <SelectValue placeholder="Sort by: Rating" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            <SelectItem value="rating">Sort by: Rating</SelectItem>
            <SelectItem value="newest">Sort by: Newest</SelectItem>
            <SelectItem value="deliveries">Sort by: Deliveries</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          className="h-11 w-11 flex items-center justify-center rounded-lg bg-[#f8f7f5] text-[#181411] hover:bg-[#eae7e4] dark:bg-gray-700 dark:text-white"
          onClick={() => onViewModeChange('grid')}
        >
          <LayoutGridIcon className="w-4 h-4" />
        </Button>
        
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          className="h-11 w-11 flex items-center justify-center rounded-lg bg-white text-[#8a7560] hover:bg-[#eae7e4] dark:bg-gray-700 dark:text-gray-300"
          onClick={() => onViewModeChange('list')}
        >
          <ListIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}