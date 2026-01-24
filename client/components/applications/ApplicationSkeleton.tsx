import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationListSkeleton() {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4 h-full">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-3 w-20 mt-1 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ApplicationDetailsSkeleton() {
  return (
    <Card className="rounded-2xl shadow-sm border border-border-color overflow-hidden flex flex-col h-full bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Hero Image Skeleton */}
      <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto relative p-8">
        {/* Header Info Skeleton */}
        <div className="flex justify-between items-end -mt-10 mb-4 relative z-10">
          <Skeleton className="size-20 rounded-xl border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-2 mb-1">
            <Skeleton className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="mb-6">
          <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-64 mt-2 bg-gray-200 dark:bg-gray-700" />
        </div>
        
        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Restaurant Details Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex flex-col space-y-2">
                  <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Documents Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center p-3 rounded-lg border border-border-color bg-background-light dark:bg-gray-700 dark:border-gray-600"
                >
                  <Skeleton className="size-10 rounded p-1.5 mr-3 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-32 mb-1 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Map Skeleton */}
        <div className="pt-8">
          <Skeleton className="h-4 w-24 mb-4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="w-full h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      
      {/* Action Footer Skeleton */}
      <div className="p-4 border-t border-border-color bg-gray-50 flex justify-between items-center shrink-0 dark:bg-gray-700 dark:border-gray-600">
        <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-20 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </Card>
  );
}

export function ApplicationsPageSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col">
      {/* Filters Skeleton */}
      <div className="p-6 border-b border-border-color bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-48 mt-2 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm border border-border-color w-fit dark:bg-gray-700 dark:border-gray-600">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="px-4 py-1.5">
                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      
      {/* Split View Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pt-6">
        {/* List Column Skeleton */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1 pb-4 h-full">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div>
                    <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-20 mt-1 bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Details Panel Skeleton */}
        <div className="lg:col-span-8 h-full flex flex-col">
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex-1 overflow-y-auto relative p-8">
            <div className="flex justify-between items-end -mt-10 mb-4 relative z-10">
              <Skeleton className="size-20 rounded-xl border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-2 mb-1">
                <Skeleton className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="mb-6">
              <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-64 mt-2 bg-gray-200 dark:bg-gray-700" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="flex flex-col space-y-2">
                      <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center p-3 rounded-lg border border-border-color bg-background-light dark:bg-gray-700 dark:border-gray-600"
                    >
                      <Skeleton className="size-10 rounded p-1.5 mr-3 bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-32 mb-1 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-8">
              <Skeleton className="h-4 w-24 mb-4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="w-full h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          
          <div className="p-4 border-t border-border-color bg-gray-50 flex justify-between items-center shrink-0 dark:bg-gray-700 dark:border-gray-600">
            <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-20 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}