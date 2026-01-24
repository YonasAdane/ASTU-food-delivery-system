'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useQueryState } from 'nuqs';

interface ApplicationFiltersProps {
  onSearchChange: (value: string) => void;
  currentSearch: string;
}

export function ApplicationFilters({
  onSearchChange,
  currentSearch
}: ApplicationFiltersProps) {
  return (
    <div className="p-6 border-b border-border-color bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-main dark:text-white">Restaurant Verification</h2>
          <p className="text-text-muted text-sm mt-1 dark:text-gray-400">
            Reviewing pending applications
          </p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-border-color w-fit dark:bg-gray-700 dark:border-gray-600">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="status"
              className="peer sr-only"
              checked={true} // Only pending applications are shown
              readOnly
            />
            <div className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary`}>
              Pending
            </div>
          </label>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4 dark:text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={currentSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}