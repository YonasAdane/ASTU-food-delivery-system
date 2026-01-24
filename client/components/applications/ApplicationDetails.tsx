import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RestaurantApplication } from "@/actions/application-actions";
import { 
  StoreIcon, 
  FolderOpenIcon, 
  MapPinIcon, 
  UserIcon, 
  UtensilsIcon, 
  ClockIcon, 
  HomeIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon
} from "lucide-react";

interface ApplicationDetailsProps {
  application: RestaurantApplication;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}

export function ApplicationDetails({ 
  application, 
  onVerify, 
  onReject, 
  loading 
}: ApplicationDetailsProps) {
  if (!application) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden flex flex-col h-full items-center justify-center">
        <p className="text-text-muted dark:text-gray-400">Select a restaurant to review</p>
      </div>
    );
  }

  const handleVerify = () => {
    onVerify(application._id);
  };

  const handleReject = () => {
    onReject(application._id);
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-border-color overflow-hidden flex flex-col h-full bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Hero Image */}
      <div 
        className="h-32 w-full bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${application.coverImage || application.image || '/placeholder-hero.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Header Info */}
        <div className="px-8 pb-6 border-b border-border-color dark:border-gray-700">
          <div className="flex justify-between items-end -mt-10 mb-4 relative z-10">
            <div className="size-20 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                src={application.image || "/placeholder-logo.jpg"} 
                alt={`${application.name} Logo`} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder-logo.jpg";
                }}
              />
            </div>
            <div className="flex gap-2 mb-1">
              <a 
                className="flex items-center justify-center size-8 rounded-full bg-background-light text-text-muted hover:bg-primary/10 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-300"
                href={`https://${application.name.toLowerCase().replace(/\s+/g, '')}.com`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeIcon className="text-[18px]" />
              </a>
              <a 
                className="flex items-center justify-center size-8 rounded-full bg-background-light text-text-muted hover:bg-primary/10 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-300"
                href={`mailto:${application.ownerEmail}`}
              >
                <MailIcon className="text-[18px]" />
              </a>
              <a 
                className="flex items-center justify-center size-8 rounded-full bg-background-light text-text-muted hover:bg-primary/10 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-300"
                href={`tel:${application.ownerPhone}`}
              >
                <PhoneIcon className="text-[18px]" />
              </a>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-main dark:text-white">{application.name}</h1>
            <p className="text-text-muted mt-1 dark:text-gray-300">
              {application.area || "Restaurant details coming soon..."}
            </p>
          </div>
        </div>
        
        {/* Details Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section: Restaurant Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 dark:text-white">
              <StoreIcon className="text-primary text-[18px]" />
              Restaurant Details
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-xs text-text-muted dark:text-gray-400">Owner Name</span>
                <span className="text-sm font-medium text-text-main dark:text-white">
                  {(typeof application.ownerId === 'object' 
                    ? `${application.ownerId.firstName || ''} ${application.ownerId.lastName || ''}`.trim() 
                    : application.firstName || application.lastName 
                      ? `${application.firstName || ''} ${application.lastName || ''}`.trim()
                      : "N/A")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted dark:text-gray-400">Owner Email</span>
                <span className="text-sm font-medium text-text-main dark:text-white">
                  {typeof application.ownerId === 'object' 
                    ? application.ownerId.email 
                    : application.ownerEmail || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted dark:text-gray-400">Owner Phone</span>
                <span className="text-sm font-medium text-text-main dark:text-white">
                  {typeof application.ownerId === 'object' 
                    ? application.ownerId.phone 
                    : application.ownerPhone || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted dark:text-gray-400">Cuisine Type</span>
                <span className="text-sm font-medium text-text-main dark:text-white">
                  {application.area || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted dark:text-gray-400">Delivery Time</span>
                <span className="text-sm font-medium text-text-main dark:text-white">
                  {application.deliveryTime || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted dark:text-gray-400">Address</span>
                <span className="text-sm font-medium text-text-main dark:text-white">
                  {application.location.address || "N/A"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Section: Documents */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 dark:text-white">
              <FolderOpenIcon className="text-primary text-[18px]" />
              Verification Documents
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-lg border border-border-color bg-background-light hover:bg-white transition-colors cursor-pointer group dark:bg-gray-700 dark:border-gray-600">
                <div className="bg-red-100 text-red-600 rounded p-1.5 mr-3 group-hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400">
                  <FolderOpenIcon className="text-[20px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate dark:text-white">
                    Business_License_2024.pdf
                  </p>
                  <p className="text-xs text-text-muted dark:text-gray-400">
                    2.4 MB • Uploaded Oct 24
                  </p>
                </div>
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary">
                  visibility
                </span>
              </div>
              <div className="flex items-center p-3 rounded-lg border border-border-color bg-background-light hover:bg-white transition-colors cursor-pointer group dark:bg-gray-700 dark:border-gray-600">
                <div className="bg-blue-100 text-blue-600 rounded p-1.5 mr-3 group-hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400">
                  <MapPinIcon className="text-[20px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate dark:text-white">
                    Food_Safety_Cert.jpg
                  </p>
                  <p className="text-xs text-text-muted dark:text-gray-400">
                    1.8 MB • Uploaded Oct 24
                  </p>
                </div>
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary">
                  visibility
                </span>
              </div>
              <div className="flex items-center p-3 rounded-lg border border-border-color bg-background-light hover:bg-white transition-colors cursor-pointer group dark:bg-gray-700 dark:border-gray-600">
                <div className="bg-red-100 text-red-600 rounded p-1.5 mr-3 group-hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400">
                  <UtensilsIcon className="text-[20px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate dark:text-white">
                    Menu_Pricing_List.pdf
                  </p>
                  <p className="text-xs text-text-muted dark:text-gray-400">
                    5.1 MB • Uploaded Oct 24
                  </p>
                </div>
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary">
                  visibility
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map / Location Placeholder */}
        <div className="px-8 pb-8">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 mb-4 dark:text-white">
            <MapPinIcon className="text-primary text-[18px]" />
            Location
          </h3>
          <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden relative dark:bg-gray-700">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: `url('/placeholder-map.jpg')` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                <MapPinIcon className="text-[24px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Footer */}
      <div className="p-4 border-t border-border-color bg-gray-50 flex justify-between items-center shrink-0 dark:bg-gray-700 dark:border-gray-600">
        <button className="text-text-muted hover:text-text-main text-sm font-medium px-4 py-2 flex items-center gap-2 transition-colors dark:text-gray-300 dark:hover:text-white">
          <span className="material-symbols-outlined text-[18px]">flag</span>
          Report Issue
        </button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="px-5 py-2.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/5 font-medium transition-colors flex items-center gap-2 dark:border-red-700/50 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={handleReject}
            disabled={loading}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
            Reject
          </Button>
          <Button
            className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-orange-600 font-medium shadow-md shadow-orange-200 transition-colors flex items-center gap-2"
            onClick={handleVerify}
            disabled={loading}
          >
            <span className="material-symbols-outlined text-[20px]">check</span>
            Approve Restaurant
          </Button>
        </div>
      </div>
    </Card>
  );
}