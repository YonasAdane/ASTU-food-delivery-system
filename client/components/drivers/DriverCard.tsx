import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/actions/driver-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  MessageCircle, 
  User, 
  Bike, 
  Car, 
  Zap,
  Star
} from "lucide-react";

interface DriverCardProps {
  driver: Driver;
  onMessage?: (driver: Driver) => void;
  onViewProfile?: (driver: Driver) => void;
}

export function DriverCard({ driver, onMessage, onViewProfile }: DriverCardProps) {
  // Use real data from the driver object
  // These would come from the API in a real implementation
  const trips = driver.trips || 0;
  const onTimeRate = driver.onTimeRate || 95;
  const rating = driver.rating || 4.5;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-[#07880e]/10 text-[#07880e]";
      case "unavailable":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "unavailable":
        return "Offline";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getVehicleIcon = (vehicleType?: string) => {
    // In a real app, vehicle type would be stored in the driver data
    // For now, we'll randomly assign one based on the driver ID
    const icons = [
      { icon: <Zap className="text-[20px]" />, text: "E-Scooter" },
      { icon: <Bike className="text-[20px]" />, text: "Bike" },
      { icon: <Car className="text-[20px]" />, text: "Car" },
    ];
    
    const randomIndex = driver._id ? driver._id.charCodeAt(0) % 3 : 0;
    return icons[randomIndex];
  };

  const vehicleInfo = getVehicleIcon();

  return (
    <Card 
      className={cn(
        "group flex flex-col bg-white rounded-xl shadow-sm border border-[#e6e0db] hover:shadow-md transition-shadow overflow-hidden",
        driver.status === "unavailable" && "opacity-90"
      )}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="relative">
              <Avatar className="size-14 border-2 border-white shadow-sm">
                <AvatarImage 
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${driver.firstName || driver.email}&backgroundColor=b6e7ff`}
                  alt={`${driver.firstName || driver.lastName || driver.email}`}
                />
                <AvatarFallback>
                  {(driver.firstName?.charAt(0) || driver.lastName?.charAt(0) || driver.email.charAt(0)).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div 
                className={cn(
                  "absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white",
                  driver.status === "available" ? "bg-[#07880e]" : 
                  driver.status === "unavailable" ? "bg-gray-400" : "bg-primary"
                )}
              />
            </div>
            <div>
              <h3 className="text-[#181411] text-lg font-bold dark:text-white">
                {driver.firstName || driver.lastName ? 
                  `${driver.firstName || ""} ${driver.lastName || ""}`.trim() : 
                  driver.email.split('@')[0]}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                  {driver.status === "available" ? "Student" : "Full-Time"}
                </Badge>
                <span className="text-[#8a7560] text-xs">#{driver._id.substring(0, 4).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-semibold capitalize",
              getStatusColor(driver.status)
            )}
          >
            {getStatusText(driver.status)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 divide-x divide-[#f5f2f0] border-t border-b border-[#f5f2f0] py-3">
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1 text-[#f48c25]">
              <span className="text-sm font-bold">{rating}</span>
              <Star className="fill-current text-[14px]" />
            </div>
            <span className="text-[11px] text-[#8a7560]">Rating</span>
          </div>
          <div className="flex flex-col items-center px-2">
            <span className="text-sm font-bold text-[#181411] dark:text-white">{trips}</span>
            <span className="text-[11px] text-[#8a7560]">Trips</span>
          </div>
          <div className="flex flex-col items-center px-2">
            <span className="text-sm font-bold text-[#181411] dark:text-white">{onTimeRate}%</span>
            <span className="text-[11px] text-[#8a7560]">On-Time</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#8a7560]">
            {vehicleInfo.icon}
            <span className="text-sm">{vehicleInfo.text}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full bg-[#f8f7f5] text-[#181411] hover:bg-[#e6e0db] transition-colors"
              onClick={() => onMessage?.(driver)}
              aria-label="Message"
            >
              <MessageCircle className="text-[18px]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full bg-[#f8f7f5] text-[#181411] hover:bg-[#e6e0db] transition-colors"
              onClick={() => onViewProfile?.(driver)}
              aria-label="View Profile"
            >
              <User className="text-[18px]" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}