import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RestaurantApplication } from "@/actions/application-actions";
import { CalendarIcon } from "lucide-react";

interface ApplicationListItemProps {
  application: RestaurantApplication;
  isActive: boolean;
  onClick: () => void;
}

export function ApplicationListItem({ 
  application, 
  isActive, 
  onClick 
}: ApplicationListItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={`p-4 rounded-xl cursor-pointer transition-all ${
        isActive 
          ? 'bg-white shadow-md border-l-4 border-primary scale-[1.01]' 
          : 'bg-white shadow-sm border border-transparent hover:border-primary/30'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div 
            className="size-12 rounded-lg bg-cover bg-center bg-gray-100"
            style={{ backgroundImage: `url(${application.image || '/placeholder-restaurant.jpg'})` }}
          />
          <div>
            <h3 className="font-semibold text-text-main leading-tight dark:text-white">
              {application.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5 dark:text-gray-400">
              ID: #{application._id.substring(0, 4).toUpperCase()}
            </p>
          </div>
        </div>
        <Badge 
          variant="default" 
          className="bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300"
        >
          Pending
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-text-muted dark:text-gray-400">
        <div className="flex items-center gap-1">
          <CalendarIcon className="text-[16px]" />
          <span>{formatDate(application.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1 text-primary font-medium dark:text-primary">
          <span>Review</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </div>
      </div>
    </Card>
  );
}