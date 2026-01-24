import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-white p-8 shadow">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-12 w-1/3" />
    </div>
  );
}
