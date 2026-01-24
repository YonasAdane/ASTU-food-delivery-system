"use client";

import { useState, useEffect } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { 
  getRestaurantApplications, 
  verifyRestaurant, 
  rejectRestaurant,
  RestaurantApplication 
} from "@/actions/application-actions";
import { ApplicationListItem } from "@/components/applications/ApplicationListItem";
import { ApplicationDetails } from "@/components/applications/ApplicationDetails";
import { ApplicationFilters } from "@/components/applications/ApplicationFilters";
import { ApplicationsPageSkeleton } from "@/components/applications/ApplicationSkeleton";
import { toast } from "sonner";
import { ModeToggle } from "@/components/common/modeToggle";

export default function ApplicationsPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));

  
  const [applications, setApplications] = useState<RestaurantApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<RestaurantApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const result = await getRestaurantApplications({
          page,
          search,
        });
        setApplications(result.data);
        
        // Auto-select the first application if none is selected
        if (!selectedApplication && result.data.length > 0) {
          setSelectedApplication(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(error instanceof Error ? error.message : "Failed to fetch applications");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [page, search]);

  const handleVerify = async (id: string) => {
    setActionLoading(true);
    try {
      await verifyRestaurant(id);
      toast.success("Restaurant verified successfully");
      
      // Refresh the applications list
      const result = await getRestaurantApplications({
        page,
        search,
      });
      setApplications(result.data);
      
      // Update selected application if it was the one verified
      if (selectedApplication?._id === id) {
        setSelectedApplication({
          ...selectedApplication,
          verified: true
        });
      }
    } catch (error) {
      console.error("Error verifying restaurant:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify restaurant");
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await rejectRestaurant(id);
      toast.success("Restaurant rejected successfully");
      
      // Refresh the applications list
      const result = await getRestaurantApplications({
        page,
        search,
      });
      setApplications(result.data);
      
      // Remove from selected if it was the one rejected
      if (selectedApplication?._id === id) {
        setSelectedApplication(result.data[0] || null);
      }
    } catch (error) {
      console.error("Error rejecting restaurant:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject restaurant");
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };
  
  if (isLoading) {
    return <ApplicationsPageSkeleton />;
  }
  
  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col">
      <ApplicationFilters 
        onSearchChange={handleSearchChange}
        currentSearch={search}
      />
      
      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pt-6">
        {/* List Column */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1 pb-4 h-full">
          {applications.map((application) => (
            <ApplicationListItem
              key={application._id}
              application={application}
              isActive={selectedApplication?._id === application._id}
              onClick={() => setSelectedApplication(application)}
            />
          ))}
        </div>
        
        {/* Details Panel */}
        <div className="lg:col-span-8 h-full flex flex-col">
          <ApplicationDetails
            application={selectedApplication || applications[0] || {} as RestaurantApplication}
            onVerify={handleVerify}
            onReject={handleReject}
            loading={actionLoading}
          />
        </div>
      </div>
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
    </div>
  );
}