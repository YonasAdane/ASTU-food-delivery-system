'use client';

import React from 'react';
import { Search, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface OrderFilters {
  search: string;
  status: string;
  hasComplaints: string;
}

interface OrderFiltersAreaProps {
  filters: OrderFilters;
  onFilterChange: (key: keyof OrderFilters, value: string) => void;
  onClear: () => void;
}

export function OrderFiltersArea({ filters, onFilterChange, onClear }: OrderFiltersAreaProps) {
  return (
    <Card className="bg-muted/30 border-none shadow-none p-0">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search Order ID, Customer, or Restaurant..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          
          {/* Status Filter */}
            <Select 
              value={filters.status || "all"} 
              onValueChange={(v) => onFilterChange('status', v === "all" ? "" : v)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="picked">Picked Up</SelectItem>
                <SelectItem value="en_route">En Route</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          {/* <div className="w-full md:w-[200px]">
          </div> */}

          {/* Complaints Filter */}
            <Select 
              value={filters.hasComplaints || "all"} 
              onValueChange={(v) => onFilterChange('hasComplaints', v === "all" ? "" : v)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="true">Flagged/Complaints</SelectItem>
                <SelectItem value="false">No Issues</SelectItem>
              </SelectContent>
            </Select>
          {/* <div className="w-full md:w-[200px]">
          </div> */}

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={onClear}
            className="shrink-0 gap-2 border-dashed"
          >
            <XCircle className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}