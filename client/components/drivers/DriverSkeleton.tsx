import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DriverSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card 
          key={index}
          className="group flex flex-col bg-white rounded-xl shadow-sm border border-[#e6e0db] hover:shadow-md transition-shadow overflow-hidden dark:bg-gray-800 dark:border-gray-700"
        >
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="relative">
                  <Skeleton className="size-14 rounded-full dark:bg-gray-700" />
                  <Skeleton className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white dark:bg-gray-600 dark:border-gray-800" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 dark:bg-gray-700" />
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-12 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-6 w-20 dark:bg-gray-700" />
            </div>
            
            <div className="grid grid-cols-3 divide-x divide-[#f5f2f0] border-t border-b border-[#f5f2f0] py-3 dark:divide-gray-700 dark:border-gray-700">
              <div className="flex flex-col items-center px-2">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-8 dark:bg-gray-700" />
                  <Skeleton className="h-3 w-3 dark:bg-gray-700" />
                </div>
                <Skeleton className="h-3 w-12 dark:bg-gray-700" />
              </div>
              <div className="flex flex-col items-center px-2">
                <Skeleton className="h-4 w-8 dark:bg-gray-700" />
                <Skeleton className="h-3 w-12 dark:bg-gray-700" />
              </div>
              <div className="flex flex-col items-center px-2">
                <Skeleton className="h-4 w-8 dark:bg-gray-700" />
                <Skeleton className="h-3 w-12 dark:bg-gray-700" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 dark:bg-gray-700" />
                <Skeleton className="h-4 w-16 dark:bg-gray-700" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="size-9 rounded-full dark:bg-gray-700" />
                <Skeleton className="size-9 rounded-full dark:bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}