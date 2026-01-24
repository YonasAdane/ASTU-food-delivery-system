import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  UsersRound,
  CheckCircle,
  Timer,
  Star
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  change?: string;
  changePositive?: boolean;
}

const StatCard = ({ title, value, icon, change, changePositive }: StatCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-[#e6e0db] dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <p className="text-[#8a7560] text-sm font-medium dark:text-gray-300">{title}</p>
          <div className="text-primary bg-primary/10 p-1 rounded-md dark:text-primary dark:bg-primary/20">
            {icon}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-[#181411] text-3xl font-bold leading-tight dark:text-white">
            {value}
          </p>
          {change && (
            <p className={`text-sm font-medium mb-1 ${changePositive ? 'text-[#07880e] dark:text-green-400' : 'text-red-500'}`}>
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface DriverStatsProps {
  totalFleet: number;
  activeNow: number;
  avgDeliveryTime: number;
  avgRating: number;
  isLoading?: boolean;
}

export function DriverStats({ 
  totalFleet, 
  activeNow, 
  avgDeliveryTime, 
  avgRating,
  isLoading 
}: DriverStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-white shadow-sm border border-[#e6e0db] dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                <Skeleton className="size-8 rounded-md dark:bg-gray-700" />
              </div>
              <div className="flex items-end gap-2">
                <Skeleton className="h-8 w-16 dark:bg-gray-700" />
                <Skeleton className="h-4 w-12 dark:bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Fleet" 
        value={totalFleet} 
        icon={<UsersRound className="text-[20px]" />} 
      />
      <StatCard 
        title="Active Now" 
        value={activeNow} 
        icon={<CheckCircle className="text-[20px] text-[#07880e] dark:text-green-400" />}
        change="+2 vs yesterday"
        changePositive={true}
      />
      <StatCard 
        title="Avg. Delivery Time" 
        value={
          <span>
            {avgDeliveryTime}
            <span className="text-lg font-normal text-[#8a7560] dark:text-gray-300"> min</span>
          </span>
        } 
        icon={<Timer className="text-[20px]" />}
        change="-2m"
        changePositive={true}
      />
      <StatCard 
        title="Avg. Rating" 
        value={avgRating.toFixed(1)} 
        icon={<Star className="text-[20px]" />}
        change="+0.1"
        changePositive={true}
      />
    </div>
  );
}